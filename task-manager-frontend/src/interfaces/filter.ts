import type { TaskStatus } from '@/models/task.model';

export type TasksState = {
  formData: {
    title: string;
    description: string;
    status: TaskStatus;
    showDrawer: boolean;
  };
  isLoading: boolean;
  isTaskLoading: boolean;
  loadingTaskId: number | null;
  activeFilter: FilterType;
};

export enum FilterType {
  ALL = 'ALL',
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
}
