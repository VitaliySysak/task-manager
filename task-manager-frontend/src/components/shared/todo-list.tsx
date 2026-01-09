import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { FilterType } from '@/interfaces/filter';
import { isOptimisticallyLoggedIn } from '@/lib/auth';
import { applyFilter } from '@/lib/task-filter';
import { cn } from '@/lib/utils';
import { selectTitleFilter } from '@/store/tasks/filters-slice';
import { useGetTasksQuery } from '@/store/tasks/task.api';
import { selectActiveFilter } from '@/store/tasks/tasks-slice';

import { GlowButton } from '../ui/glow-button';
import { TodoRowSkeleton } from '../ui/todo-row-skeleton';
import { TodoRow } from './todo-row';

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
      result = result.filter(task => task.title.toLowerCase().includes(lowerTitle));
    }

    return result;
  }, [tasks, activeFilter, titleFilter]);

  const isActiveEmpty = activeFilter === FilterType.ACTIVE && !filteredTasks.length;
  const isCompletedEmpty = activeFilter === FilterType.COMPLETED && !filteredTasks.length;

  return isLoading
    ? (
        <>
          {!isLoggedIn
            ? (
                <ul
                  className={cn(
                    'bg-primary h-96.25 sm:h-96.25 2xl:h-120.25 rounded-t-md overflow-y-auto dark:scheme-dark',
                    className,
                  )}
                >
                  <div className="h-full flex justify-center items-center px-4">
                    <div className="text-(--light-grayish-blue-hover)/40 text-md sm:text-xl lg:text-2xl text-center">
                      <p className="mb-4 sm:mb-2">To get started with your first task, please:</p>
                      <div className="flex justify-center items-center gap-2">
                        <span className="text-md sm:text-xl lg:text-2xl font-medium">Log in or register</span>
                        <Link to="/auth">
                          <GlowButton className="text-xs cursor-pointer">Go to Auth</GlowButton>
                        </Link>
                      </div>
                    </div>
                  </div>
                </ul>
              )
            : (
                <ul
                  className={cn(
                    'bg-primary h-96.25 sm:h-96.25 2xl:h-120.25 rounded-t-md border-b border-(--very-dark-grayish-blue-2) overflow-y-auto dark:scheme-dark',
                    className,
                  )}
                >
                  {[...Array.from({ length: 4 })].map((_, i) => (
                    <TodoRowSkeleton key={i} />
                  ))}
                </ul>
              )}
        </>
      )
    : (
        <ul
          className={cn(
            'bg-primary h-96.25 sm:h-96.25 2xl:h-120.25 rounded-t-md border-b',
            'border-(--very-dark-grayish-blue-2) overflow-y-auto dark:scheme-dark',
            className,
          )}
        >
          {!filteredTasks.length
            ? (
                <div className="h-full flex justify-center items-center">
                  <h1 className="text-(--light-grayish-blue-hover)/40 text-md sm:text-xl lg:text-2xl">
                    {isActiveEmpty
                      ? (
                          'No active tasks set'
                        )
                      : isCompletedEmpty
                        ? (
                            'No completed tasks set'
                          )
                        : (
                            <>
                              Nothing here,
                              <br />
                              Add your first task for this day
                            </>
                          )}
                  </h1>
                </div>
              )
            : (
                <>
                  {filteredTasks.map(({ id, title, description, status }) => (
                    <TodoRow key={id} id={id} title={title} description={description} status={status} />
                  ))}
                </>
              )}
        </ul>
      );
};
