import type { TaskModel } from '@/models/task.model';

import { FilterType } from '@/interfaces/filter';
import { TaskStatus } from '@/models/task.model';

export function applyFilter(allTasks: TaskModel[], filter: FilterType): TaskModel[] {
  switch (filter) {
    case FilterType.ACTIVE:
      return allTasks.filter(task => task.status === TaskStatus.TODO);
    case FilterType.COMPLETED:
      return allTasks.filter(task => task.status === TaskStatus.DONE);
    default:
      return allTasks;
  }
}
