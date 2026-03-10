import SQLite, {
  SQLiteDatabase,
  ResultSet,
} from 'react-native-sqlite-storage';

SQLite.enablePromise(true);

const DB_NAME = 'taskmeter.db';

let dbInstance: SQLiteDatabase | null = null;

export const getDatabase = async (): Promise<SQLiteDatabase> => {
  if (dbInstance) {
    return dbInstance;
  }
  dbInstance = await SQLite.openDatabase({ name: DB_NAME, location: 'default' });
  await initDatabase(dbInstance);
  return dbInstance;
};

const initDatabase = async (db: SQLiteDatabase): Promise<void> => {
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
};

export const executeSql = async (
  sql: string,
  params: (string | number | null)[] = [],
): Promise<ResultSet> => {
  const db = await getDatabase();
  const [result] = await db.executeSql(sql, params);
  return result;
};

export const closeDatabase = async (): Promise<void> => {
  if (dbInstance) {
    await dbInstance.close();
    dbInstance = null;
  }
};
