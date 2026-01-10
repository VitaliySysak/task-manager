import React from 'react';
import { cn } from '@/lib/utils';

interface Props {
  className?: string;
  isActiveEmpty: boolean;
  isCompletedEmpty: boolean;
}

export const EmptyTaskList: React.FC<Props> = ({ className, isActiveEmpty, isCompletedEmpty }) => {
  return (
    <div className={cn('h-full flex justify-center items-center', className)}>
      <h1 className="text-(--light-grayish-blue-hover)/40 text-md sm:text-xl lg:text-2xl">
        {isActiveEmpty ? (
          'No active tasks set'
        ) : isCompletedEmpty ? (
          'No completed tasks set'
        ) : (
          <>
            Nothing here,
            <br />
            Add your first task for this day
          </>
        )}
      </h1>
    </div>
  );
};
