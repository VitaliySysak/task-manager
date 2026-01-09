import { LucideLoaderCircle } from 'lucide-react';
import React from 'react';
import { IoIosArrowDown } from 'react-icons/io';

import { cn } from '@/lib/utils';
import { TaskStatus } from '@/models/task.model';
import { useDeleteTaskMutation, useUpdateTaskMutation } from '@/store/tasks/task.api';

type Props = {
  className?: string;
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
};

export const TodoRow: React.FC<Props> = ({ className, id, title, description, status }) => {
  const [updateTask, { isLoading }] = useUpdateTaskMutation();
  const [showDrawer, setShowDrawer] = React.useState(false);

  const [deleteTask] = useDeleteTaskMutation();

  const onUpdate = async () => {
    const isDone = status === TaskStatus.DONE;
    const newStatus = isDone ? TaskStatus.TODO : TaskStatus.DONE;
    updateTask({ id, title, description, status: newStatus });
  };

  return (
    <>
      <li
        className={cn(
          'flex py-2 2xl:py-4 px-4 sm:px-8 gap-4 sm:gap-8 items-center bg-primary min-h-16 2xl:min-h-20 h-auto rounded-t-md border-b border-(--very-dark-grayish-blue-2)',
          className,
        )}
      >
        {isLoading
          ? (
              <LucideLoaderCircle className="w-6 h-6 sm:w-8 sm:h-8 animate-spin" color="white" />
            )
          : (
              <figure
                onClick={onUpdate}
                className={cn(
                  status === TaskStatus.DONE
                    ? 'bg-(image:--linear-gradient) before:text-xs sm:before:text-base before:content-[\'✔\'] before:text-white before:flex before:items-center before:justify-center pt-1'
                    : 'bg-transparent',
                  'border w-6 h-6 sm:w-8 sm:h-8 rounded-full border-(--very-dark-grayish-blue-2) cursor-pointer',
                )}
              />
            )}

        <h2
          className={cn(
            'text-base sm:text-xl 2xl:text-2xl caret-white text-(--primary-font)',
            'focus:outline-none flex-1 wrap-break-word whitespace-normal overflow-hidden',
            status === TaskStatus.DONE && 'line-through text-(--very-dark-grayish-blue)',
          )}
        >
          {title}
        </h2>
        <div className="flex gap-2 items-center">
          {description && (
            <button
              onClick={() => setShowDrawer(prev => !prev)}
              className="flex justify-center items-center w-6 h-6 sm:w-10 sm:h-10 cursor-pointer"
              type="button"
            >
              <IoIosArrowDown
                color="var(--very-dark-grayish-blue)"
                className={cn(showDrawer && 'rotate-180', 'w-5 h-5 sm:w-8 sm:h-8')}
              />
            </button>
          )}

          <button
            type="button"
            onClick={() => deleteTask(id)}
            className="flex justify-center items-center w-8 h-8 sm:w-10 sm:h-10 cursor-pointer"
          >
            <img className="w-4 h-4 sm:w-5 sm:h-5" src="/icons/icon-cross.svg" fetchPriority="high" alt="cross" />
          </button>
        </div>
      </li>

      {showDrawer && description && (
        <div className="px-14 sm:px-24 py-3 bg-(--very-dark-desaturated-blue) rounded-b-md text-sm sm:text-base border-t border-(--very-dark-grayish-blue-2)">
          <p className="whitespace-pre-line wrap-break-word">{description}</p>
        </div>
      )}
    </>
  );
};
