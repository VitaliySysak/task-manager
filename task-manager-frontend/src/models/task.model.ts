export type TaskModel = {
  id: string;
  title: string;
  priority: Priority;
  description: string;
  status: TaskStatus;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
};

export enum TaskStatus {
  TODO = 'TODO',
  DONE = 'DONE',
}

export enum Priority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGHT = 'HIGHT',
  CRITICAL = 'CRITICAL',
}
