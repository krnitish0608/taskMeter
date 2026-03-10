import { executeSql } from '@core/database/sqlite';
import { SYNC_STATUS, SyncStatus } from '@core/constants';

export interface TaskRecord {
  id: string;
  title: string;
  description: string;
  isCompleted: boolean;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
  userId: string;
  syncStatus: SyncStatus;
}

const mapRow = (row: any): TaskRecord => ({
  id: row.id,
  title: row.title,
  description: row.description ?? '',
  isCompleted: row.is_completed === 1,
  dueDate: row.due_date,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
  userId: row.user_id,
  syncStatus: row.sync_status,
});

export const taskDbService = {
  getAllTasks: async (userId: string): Promise<TaskRecord[]> => {
    const result = await executeSql(
      `SELECT * FROM tasks WHERE user_id = ? AND sync_status != ? ORDER BY created_at DESC`,
      [userId, SYNC_STATUS.PENDING_DELETE],
    );
    const tasks: TaskRecord[] = [];
    for (let i = 0; i < result.rows.length; i++) {
      tasks.push(mapRow(result.rows.item(i)));
    }
    return tasks;
  },

  getTaskById: async (id: string): Promise<TaskRecord | null> => {
    const result = await executeSql(`SELECT * FROM tasks WHERE id = ?`, [id]);
    if (result.rows.length === 0) {
      return null;
    }
    return mapRow(result.rows.item(0));
  },

  insertTask: async (
    task: Omit<TaskRecord, 'syncStatus'>,
  ): Promise<TaskRecord> => {
    await executeSql(
      `INSERT INTO tasks (id, title, description, is_completed, due_date, created_at, updated_at, user_id, sync_status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        task.id,
        task.title,
        task.description,
        task.isCompleted ? 1 : 0,
        task.dueDate,
        task.createdAt,
        task.updatedAt,
        task.userId,
        SYNC_STATUS.PENDING_CREATE,
      ],
    );
    return { ...task, syncStatus: SYNC_STATUS.PENDING_CREATE };
  },

  updateTask: async (
    id: string,
    updates: Partial<Pick<TaskRecord, 'title' | 'description' | 'isCompleted' | 'dueDate'>>,
  ): Promise<void> => {
    const now = new Date().toISOString();
    const setClauses: string[] = ['updated_at = ?', 'sync_status = ?'];
    const params: (string | number | null)[] = [now, SYNC_STATUS.PENDING_UPDATE];

    if (updates.title !== undefined) {
      setClauses.push('title = ?');
      params.push(updates.title);
    }
    if (updates.description !== undefined) {
      setClauses.push('description = ?');
      params.push(updates.description);
    }
    if (updates.isCompleted !== undefined) {
      setClauses.push('is_completed = ?');
      params.push(updates.isCompleted ? 1 : 0);
    }
    if (updates.dueDate !== undefined) {
      setClauses.push('due_date = ?');
      params.push(updates.dueDate);
    }

    params.push(id);
    await executeSql(
      `UPDATE tasks SET ${setClauses.join(', ')} WHERE id = ?`,
      params,
    );
  },

  deleteTask: async (id: string): Promise<void> => {
    // Mark as pending delete for sync, then remove after sync
    await executeSql(
      `UPDATE tasks SET sync_status = ?, updated_at = ? WHERE id = ?`,
      [SYNC_STATUS.PENDING_DELETE, new Date().toISOString(), id],
    );
  },

  hardDeleteTask: async (id: string): Promise<void> => {
    await executeSql(`DELETE FROM tasks WHERE id = ?`, [id]);
  },

  getPendingTasks: async (): Promise<TaskRecord[]> => {
    const result = await executeSql(
      `SELECT * FROM tasks WHERE sync_status != ?`,
      [SYNC_STATUS.SYNCED],
    );
    const tasks: TaskRecord[] = [];
    for (let i = 0; i < result.rows.length; i++) {
      tasks.push(mapRow(result.rows.item(i)));
    }
    return tasks;
  },

  markAsSynced: async (id: string): Promise<void> => {
    await executeSql(
      `UPDATE tasks SET sync_status = ? WHERE id = ?`,
      [SYNC_STATUS.SYNCED, id],
    );
  },

  toggleComplete: async (id: string, isCompleted: boolean): Promise<void> => {
    const now = new Date().toISOString();
    await executeSql(
      `UPDATE tasks SET is_completed = ?, updated_at = ?, sync_status = ? WHERE id = ?`,
      [isCompleted ? 1 : 0, now, SYNC_STATUS.PENDING_UPDATE, id],
    );
  },
};
