import firestore from '@react-native-firebase/firestore';
import { taskDbService, TaskRecord } from '@modules/tasks/services/taskDbService';
import { SYNC_STATUS } from '@core/constants';
import { getTasksCollection } from '@config/index';

const getCollection = (userId: string) =>
  firestore().collection(getTasksCollection()).doc(userId).collection('items');

export const taskSyncService = {
  /**
   * Push all pending local changes to Firestore.
   * Called when connectivity is restored or after local mutations.
   */
  syncPendingToFirestore: async (userId: string): Promise<number> => {
    const pending = await taskDbService.getPendingTasks();
    let syncedCount = 0;

    for (const task of pending) {
      if (task.userId !== userId) {
        continue;
      }
      try {
        switch (task.syncStatus) {
          case SYNC_STATUS.PENDING_CREATE:
          case SYNC_STATUS.PENDING_UPDATE: {
            await getCollection(userId).doc(task.id).set({
              title: task.title,
              description: task.description,
              isCompleted: task.isCompleted,
              dueDate: task.dueDate,
              createdAt: task.createdAt,
              updatedAt: task.updatedAt,
            });
            await taskDbService.markAsSynced(task.id);
            syncedCount++;
            break;
          }
          case SYNC_STATUS.PENDING_DELETE: {
            await getCollection(userId).doc(task.id).delete();
            await taskDbService.hardDeleteTask(task.id);
            syncedCount++;
            break;
          }
        }
      } catch {
        // Individual sync failure – will retry on next sync pass
      }
    }

    return syncedCount;
  },

  /**
   * Pull tasks from Firestore and merge into local SQLite.
   * Used on initial load or manual refresh.
   */
  pullFromFirestore: async (userId: string): Promise<TaskRecord[]> => {
    const snapshot = await getCollection(userId).get();
    const remoteTasks: TaskRecord[] = [];

    for (const doc of snapshot.docs) {
      const data = doc.data();
      const task: TaskRecord = {
        id: doc.id,
        title: data.title,
        description: data.description ?? '',
        isCompleted: data.isCompleted ?? false,
        dueDate: data.dueDate ?? null,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
        userId,
        syncStatus: SYNC_STATUS.SYNCED,
      };

      const localTask = await taskDbService.getTaskById(doc.id);
      if (!localTask) {
        // New from server – insert locally
        await taskDbService.insertTask({
          ...task,
        });
        await taskDbService.markAsSynced(doc.id);
      }
      // If local has pending changes, don't overwrite (local wins)

      remoteTasks.push(task);
    }

    return remoteTasks;
  },
};
