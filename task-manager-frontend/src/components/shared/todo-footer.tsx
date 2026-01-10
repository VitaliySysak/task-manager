import React from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';

import { FilterType } from '@/interfaces/filter';
import { cn } from '@/lib/utils';
import { TaskStatus } from '@/models/task.model';
import { useDeleteCompletedTasksMutation, useGetTasksQuery } from '@/store/tasks/task.api';
import { selectActiveFilter, setActive, setAll, setCompleted } from '@/store/tasks/tasks-slice';

import { Button } from '../ui/button';
import { Skeleton } from '../ui/skeleton';

type Props = {
  className?: string;
};

export const TodoFooter: React.FC<Props> = ({ className }) => {
  const dispatch = useDispatch();
  const activeFilter = useSelector(selectActiveFilter);
  const { data: tasks, isLoading } = useGetTasksQuery();
  const [deleteTask] = useDeleteCompletedTasksMutation();
  const taskToCompleteCount = tasks?.filter(({ status }) => status === TaskStatus.TODO).length ?? 0;
  const completedTasksId = tasks?.filter(({ status }) => status === TaskStatus.DONE).map(({ id }) => id) ?? [];

  const deleteCompletedTasks = async () => {
    if (completedTasksId.length) {
      await deleteTask({ ids: completedTasksId });
    } else {
      toast.error('No tasks completed');
    }
  };

  return (
    <footer className="flex flex-col gap-4">
      <div
        className={cn(
          'flex items-center justify-between px-4 sm:px-8 h-12 2xl:h-16 bg-primary rounded-b-md text-(--light-grayish-blue-hover)/40',
          className,
        )}
      >
        <div className="min-w-25">
          {!isLoading ? (
            <h3 className="text-sm sm:text-md 2xl:text-lg font-light ">
              <span className="tabular-nums">{taskToCompleteCount}</span> {taskToCompleteCount === 1 ? 'task' : 'tasks'}{' '}
              left
            </h3>
          ) : (
            <Skeleton className="w-22 h-6" />
          )}
        </div>
        <div className="hidden sm:flex">
          <Button
            onClick={() => dispatch(setAll())}
            className={cn(
              '2xl:text-lg text-(--light-grayish-blue-hover)/40 p-2 cursor-pointer',
              activeFilter === FilterType.ALL && 'text-(--active-font)',
            )}
          >
            All
          </Button>
          <Button
            onClick={() => dispatch(setActive())}
            className={cn(
              '2xl:text-lg text-(--light-grayish-blue-hover)/40 p-2 cursor-pointer',
              activeFilter === FilterType.ACTIVE && 'text-(--active-font)',
            )}
          >
            Active
          </Button>
          <Button
            onClick={() => dispatch(setCompleted())}
            className={cn(
              '2xl:text-lg text-(--light-grayish-blue-hover)/40 p-2 cursor-pointer',
              activeFilter === FilterType.COMPLETED && 'text-(--active-font)',
            )}
          >
            Completed
          </Button>
        </div>
        <Button
          onClick={deleteCompletedTasks}
          className="2xl:text-lg text-(--light-grayish-blue-hover)/40 font-light cursor-pointer"
        >
          Clear Completed
        </Button>
      </div>
      <div
        className={cn(
          'sm:hidden flex items-center justify-center px-4 sm:px-8 h-12',
          'bg-primary rounded-md text-(--very-dark-grayish-blue)',
        )}
      >
        <div className="flex">
          <Button
            onClick={() => dispatch(setAll())}
            className={cn(
              'text-(--light-grayish-blue-hover)/40 p-2 cursor-pointer',
              activeFilter === FilterType.ALL && 'text-(--active-font)',
            )}
          >
            All
          </Button>
          <Button
            onClick={() => dispatch(setActive())}
            className={cn(
              'text-(--light-grayish-blue-hover)/40 p-2 cursor-pointer',
              activeFilter === FilterType.ACTIVE && 'text-(--active-font)',
            )}
          >
            Active
          </Button>
          <Button
            onClick={() => dispatch(setCompleted())}
            className={cn(
              'text-(--light-grayish-blue-hover)/40 p-2 cursor-pointer',
              activeFilter === FilterType.COMPLETED && 'text-(--active-font)',
            )}
          >
            Completed
          </Button>
        </div>
      </div>
    </footer>
  );
};
