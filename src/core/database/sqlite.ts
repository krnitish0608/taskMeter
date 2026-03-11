import SQLite, {
  SQLiteDatabase,
  ResultSet,
} from 'react-native-sqlite-storage';

SQLite.enablePromise(true);

const DB_NAME = 'taskmeter.db';
const DB_INIT_TIMEOUT = 5000; // 5 second timeout for database initialization

let dbInstance: SQLiteDatabase | null = null;
let dbInitPromise: Promise<SQLiteDatabase> | null = null;

export const getDatabase = async (): Promise<SQLiteDatabase> => {
  if (dbInstance) {
    return dbInstance;
  }

  // If initialization is already in progress, wait for it
  if (dbInitPromise) {
    return dbInitPromise;
  }

  // Create database initialization with timeout
  dbInitPromise = (async () => {
    try {
      const timeoutPromise = new Promise<SQLiteDatabase>((_, reject) =>
        setTimeout(() => reject(new Error('Database initialization timeout')), DB_INIT_TIMEOUT),
      );

      const dbPromise = (async () => {
        const db = await SQLite.openDatabase({ name: DB_NAME, location: 'default' });
        console.log('✓ SQLite database opened');
        
        await initDatabase(db);
        console.log('✓ SQLite database initialized');
        
        dbInstance = db;
        return db;
      })();

      return await Promise.race([dbPromise, timeoutPromise]);
    } catch (error) {
      console.error('✗ Database initialization error:', error);
      dbInitPromise = null;
      throw error;
    }
  })();

  return dbInitPromise;
};

const initDatabase = async (db: SQLiteDatabase): Promise<void> => {
  try {
    await db.executeSql(`
      CREATE TABLE IF NOT EXISTS tasks (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        is_completed INTEGER DEFAULT 0,
        due_date TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        user_id TEXT NOT NULL,
        sync_status TEXT DEFAULT 'pending_create'
      );
    `);

    await db.executeSql(`
      CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id);
    `);

    await db.executeSql(`
      CREATE INDEX IF NOT EXISTS idx_tasks_sync_status ON tasks(sync_status);
    `);
  } catch (error: any) {
    console.error('✗ Table creation/indexing error:', error);
    throw error;
  }
};

export const executeSql = async (
  sql: string,
  params: (string | number | null)[] = [],
): Promise<ResultSet> => {
  try {
    const db = await getDatabase();
    const [result] = await db.executeSql(sql, params);
    return result;
  } catch (error) {
    console.error(`✗ SQL execution error: ${sql}`, error);
    throw error;
  }
};

export const closeDatabase = async (): Promise<void> => {
  if (dbInstance) {
    try {
      await dbInstance.close();
      dbInstance = null;
      dbInitPromise = null;
      console.log('✓ Database closed');
    } catch (error) {
      console.error('✗ Error closing database:', error);
    }
  }
};
