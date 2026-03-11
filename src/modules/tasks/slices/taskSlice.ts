import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { taskDbService, TaskRecord } from '@modules/tasks/services/taskDbService';
import { taskSyncService } from '@modules/tasks/services/taskSyncService';
import { notificationService } from '@modules/notifications/services/notificationService';
import type { RootState } from '@app/store';

interface TaskState {
  tasks: TaskRecord[];
  loading: boolean;
  syncing: boolean;
  error: string | null;
}

const initialState: TaskState = {
  tasks: [],
  loading: false,
  syncing: false,
  error: null,
};

const getUserId = (state: RootState): string => {
  const uid = state.auth.user?.uid;
  if (!uid) {
    throw new Error('User not authenticated');
  }
  return uid;
};

export const loadTasks = createAsyncThunk(
  'tasks/loadTasks',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const userId = state.auth.user?.uid;
      
      if (!userId) {
        throw new Error('User not authenticated');
      }

      // Create a timeout promise
      const timeoutPromise = new Promise((_resolve, reject) =>
        setTimeout(
          () => reject(new Error('Task loading timed out')),
          8000, // 8 second timeout
        ),
      );

      // Race between actual loading and timeout
      const results = await Promise.race([
        taskDbService.getAllTasks(userId),
        timeoutPromise as Promise<TaskRecord[]>,
      ]);

      return results;
    } catch (error: any) {
      console.error('Error loading tasks:', error);
      return rejectWithValue(error.message || 'Failed to load tasks');
    }
  },
);

export const addTask = createAsyncThunk(
  'tasks/addTask',
  async (
    payload: { title: string; description: string; dueDate: string | null },
    { getState, rejectWithValue },
  ) => {
    try {
      const userId = getUserId(getState() as RootState);
      const now = new Date().toISOString();
      const id = `task_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      const task = await taskDbService.insertTask({
        id,
        title: payload.title,
        description: payload.description,
        isCompleted: false,
        dueDate: payload.dueDate,
        createdAt: now,
        updatedAt: now,
        userId,
      });
      
      // Schedule notification if task has a due date
      if (payload.dueDate) {
        const dueDate = new Date(payload.dueDate);
        const now = new Date();
        
        // Only schedule if due date is in the future
        if (dueDate > now) {
          await notificationService.scheduleTaskReminder(
            id,
            '📅 Task Due Reminder',
            `"${payload.title}" is due today!`,
            dueDate,
          ).catch((err: any) => console.error('Failed to schedule notification:', err));
        }
      }
      
      return task;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

export const updateTask = createAsyncThunk(
  'tasks/updateTask',
  async (
    payload: {
      id: string;
      updates: Partial<Pick<TaskRecord, 'title' | 'description' | 'isCompleted' | 'dueDate'>>;
    },
    { rejectWithValue },
  ) => {
    try {
      await taskDbService.updateTask(payload.id, payload.updates);
      const updated = await taskDbService.getTaskById(payload.id);
      
      // If dueDate is updated, reschedule notification
      if (payload.updates.dueDate !== undefined) {
        // Cancel existing notification
        await notificationService.cancelTaskReminder(payload.id)
          .catch((err: any) => console.error('Failed to cancel notification:', err));
        
        // Schedule new notification if dueDate is set and in the future
        if (payload.updates.dueDate) {
          const dueDate = new Date(payload.updates.dueDate);
          const now = new Date();
          
          if (dueDate > now && updated) {
            await notificationService.scheduleTaskReminder(
              payload.id,
              '📅 Task Due Reminder',
              `"${updated.title}" is due today!`,
              dueDate,
            ).catch((err: any) => console.error('Failed to schedule notification:', err));
          }
        }
      }
      
      return updated!;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

export const toggleTaskComplete = createAsyncThunk(
  'tasks/toggleTaskComplete',
  async (payload: { id: string; isCompleted: boolean }, { getState, rejectWithValue }) => {
    try {
      await taskDbService.toggleComplete(payload.id, payload.isCompleted);
      
      // Show notification when task is marked as completed
      if (payload.isCompleted) {
        const state = getState() as RootState;
        const task = state.tasks.tasks.find(t => t.id === payload.id);
        
        if (task) {
          await notificationService.displayLocalNotification(
            '✅ Task Completed!',
            `Great job! You completed "${task.title}"`,
          ).catch((err: any) => console.error('Failed to show completion notification:', err));
        }
        
        // Cancel scheduled reminder when task is completed
        await notificationService.cancelTaskReminder(payload.id)
          .catch((err: any) => console.error('Failed to cancel notification:', err));
      }
      
      return payload;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

export const deleteTask = createAsyncThunk(
  'tasks/deleteTask',
  async (id: string, { rejectWithValue }) => {
    try {
      await taskDbService.deleteTask(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

export const syncTasks = createAsyncThunk(
  'tasks/syncTasks',
  async (_, { getState, rejectWithValue }) => {
    try {
      const userId = getUserId(getState() as RootState);

      const timeoutPromise = new Promise<never>((_resolve, reject) =>
        setTimeout(() => reject(new Error('Sync timed out')), 15000),
      );

      const syncWork = async () => {
        // Push local → Firestore
        await taskSyncService.syncPendingToFirestore(userId);
        // Pull Firestore → local
        await taskSyncService.pullFromFirestore(userId);
        // Reload from SQLite as source of truth
        return await taskDbService.getAllTasks(userId);
      };

      return await Promise.race([syncWork(), timeoutPromise]);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    clearTaskError(state) {
      state.error = null;
    },
    resetTasks() {
      return initialState;
    },
  },
  extraReducers: builder => {
    // Load
    builder
      .addCase(loadTasks.pending, state => {
        state.loading = true;
      })
      .addCase(loadTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(loadTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Add
    builder.addCase(addTask.fulfilled, (state, action) => {
      state.tasks.unshift(action.payload);
    });

    // Update
    builder.addCase(updateTask.fulfilled, (state, action) => {
      const idx = state.tasks.findIndex(t => t.id === action.payload.id);
      if (idx !== -1) {
        state.tasks[idx] = action.payload;
      }
    });

    // Toggle
    builder.addCase(toggleTaskComplete.fulfilled, (state, action) => {
      const idx = state.tasks.findIndex(t => t.id === action.payload.id);
      if (idx !== -1) {
        state.tasks[idx].isCompleted = action.payload.isCompleted;
      }
    });

    // Delete
    builder.addCase(deleteTask.fulfilled, (state, action) => {
      state.tasks = state.tasks.filter(t => t.id !== action.payload);
    });

    // Sync
    builder
      .addCase(syncTasks.pending, state => {
        state.syncing = true;
      })
      .addCase(syncTasks.fulfilled, (state, action) => {
        state.syncing = false;
        state.tasks = action.payload;
      })
      .addCase(syncTasks.rejected, (state, action) => {
        state.syncing = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearTaskError, resetTasks } = taskSlice.actions;
export default taskSlice.reducer;
