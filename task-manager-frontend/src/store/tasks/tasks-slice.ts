import { createSlice } from '@reduxjs/toolkit';

import type { TasksState } from '@/interfaces/filter';

import { FilterType } from '@/interfaces/filter';
import { TaskStatus } from '@/models/task.model';

import type { RootState } from '../store';

const initialState: TasksState = {
  formData: {
    title: '',
    description: '',
    status: TaskStatus.TODO,
    showDrawer: false,
  },
  isLoading: false,
  isTaskLoading: false,
  loadingTaskId: null,
  activeFilter: FilterType.ALL,
};

export const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setTaskTitle: (state, action) => {
      state.formData.title = action.payload;
    },
    setTaskDescription: (state, action) => {
      state.formData.description = action.payload;
    },
    toggleTaskIsCompleted: (state) => {
      state.formData.status = state.formData.status === TaskStatus.DONE ? TaskStatus.TODO : TaskStatus.DONE;
    },
    setShowTaskDrawer: (state) => {
      state.formData.showDrawer = !state.formData.showDrawer;
    },
    resetTaskForm: (state) => {
      state.formData = initialState.formData;
    },
    setAll: (state) => {
      state.activeFilter = FilterType.ALL;
    },
    setActive: (state) => {
      state.activeFilter = FilterType.ACTIVE;
    },
    setCompleted: (state) => {
      state.activeFilter = FilterType.COMPLETED;
    },
    setTasksloading: (state, action) => {
      state.isLoading = action.payload;
    },
  },
});

export const {
  setTaskTitle,
  setTaskDescription,
  toggleTaskIsCompleted,
  setShowTaskDrawer,
  resetTaskForm,
  setAll,
  setActive,
  setCompleted,
  setTasksloading,
} = tasksSlice.actions;
export const selectTaskForm = (state: RootState) => state.tasks.formData;
export const selectIsTasksLoading = (state: RootState) => state.tasks.isLoading;
export const selectActiveFilter = (state: RootState) => state.tasks.activeFilter;
export const selectTaskIdLoading = (state: RootState) => state.tasks.loadingTaskId;
export const selectTaskCreating = (state: RootState) => state.tasks.isTaskLoading;

const tasksReducer = tasksSlice.reducer;
export default tasksReducer;
