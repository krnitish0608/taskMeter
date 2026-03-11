import React, { useCallback, useEffect } from 'react';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useAppDispatch } from '@core/hooks/useAppDispatch';
import { useAppSelector } from '@core/hooks/useAppSelector';
import { addTask, updateTask } from '@modules/tasks/slices/taskSlice';
import { TaskForm } from '@modules/tasks/components/TaskForm';
import type { AppStackParamList } from '@core/types/navigation';

type AddEditRoute = RouteProp<AppStackParamList, 'AddEditTask'>;

const AddEditTaskScreen = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const route = useRoute<AddEditRoute>();
  const taskId = route.params?.taskId;
  const existingTask = useAppSelector(state =>
    state.tasks.tasks.find(t => t.id === taskId),
  );
  const isEditing = !!existingTask;

  useEffect(() => {
    navigation.setOptions({
      title: isEditing ? 'Edit Task' : 'New Task',
    });
  }, [navigation, isEditing]);

  const handleSubmit = useCallback(
    (data: { title: string; description: string; dueDate: string | null }) => {
      if (isEditing && taskId) {
        dispatch(updateTask({ id: taskId, updates: data }));
      } else {
        dispatch(addTask(data));
      }
      navigation.goBack();
    },
    [dispatch, navigation, isEditing, taskId],
  );

  return (
    <TaskForm
      initialTitle={existingTask?.title}
      initialDescription={existingTask?.description}
      initialDueDate={existingTask?.dueDate}
      submitLabel={isEditing ? 'Update Task' : 'Add Task'}
      onSubmit={handleSubmit}
    />
  );
};

export default AddEditTaskScreen;
