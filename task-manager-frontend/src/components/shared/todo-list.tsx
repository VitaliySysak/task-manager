import React from 'react';
import { useSelector } from 'react-redux';

import { FilterType } from '@/interfaces/filter';
import { isOptimisticallyLoggedIn } from '@/lib/auth';
import { applyFilter } from '@/lib/task-filter';
import { cn } from '@/lib/utils';
import { selectTitleFilter } from '@/store/tasks/filters-slice';
import { useGetTasksQuery } from '@/store/tasks/task.api';
import { selectActiveFilter } from '@/store/tasks/tasks-slice';

import { TodoRowSkeleton } from '../ui/todo-row-skeleton';
import { TodoRow } from './todo-row';
import { AuthWindow } from './auth-window';
import { EmptyTaskList } from './empty-task-list';

type Props = {
  className?: string;
};

export const TodoList: React.FC<Props> = ({ className }) => {
  const isLoggedIn = isOptimisticallyLoggedIn();
  const { data: tasks = [], isLoading } = useGetTasksQuery();
  const activeFilter = useSelector(selectActiveFilter);
  const titleFilter = useSelector(selectTitleFilter);
  const filteredTasks = React.useMemo(() => {
    let result = applyFilter(tasks, activeFilter);

    if (titleFilter.trim()) {
      const lowerTitle = titleFilter.toLowerCase();
      result = result.filter((task) => task.title.toLowerCase().includes(lowerTitle));
    }

    return result;
  }, [tasks, activeFilter, titleFilter]);

  const isActiveEmpty = activeFilter === FilterType.ACTIVE && !filteredTasks.length;
  const isCompletedEmpty = activeFilter === FilterType.COMPLETED && !filteredTasks.length;

  if (!isLoggedIn) {
    return <AuthWindow />;
  }

  return (
    <ul
      className={cn(
        'bg-primary h-96.25 sm:h-96.25 2xl:h-120.25 rounded-t-md border-b',
        'border-(--very-dark-grayish-blue-2) overflow-y-auto',
        className,
      )}
    >
      {isLoading ? (
        <>
          {[...Array.from({ length: 4 })].map((_, i) => (
            <TodoRowSkeleton key={i} />
          ))}
        </>
      ) : !filteredTasks.length ? (
        <EmptyTaskList isActiveEmpty={isActiveEmpty} isCompletedEmpty={isCompletedEmpty} />
      ) : (
        <>
          {filteredTasks.map(({ id, title, description, status }) => (
            <TodoRow key={id} id={id} title={title} description={description} status={status} />
          ))}
        </>
      )}
    </ul>
  );
};
