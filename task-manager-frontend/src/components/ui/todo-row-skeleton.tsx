import React from 'react';

import { cn } from '@/lib/utils';

import { Skeleton } from './skeleton';

type Props = {
  className?: string;
};

export const TodoRowSkeleton: React.FC<Props> = ({ className }) => {
  return (
    <>
      <li
        className={cn(
          'flex py-4 px-4 sm:px-8 gap-4 sm:gap-8 items-center bg-primary h-16 lg:h-20 rounded-t-md border-b border-(--very-dark-grayish-blue-2)',
          className,
        )}
      >
        <figure className="w-6 h-6 sm:w-8 sm:h-8">
          <Skeleton className="h-full w-full rounded-full" />
        </figure>
        <div className="flex-1 h-8">
          <Skeleton className="h-full w-full" />
        </div>
        <button type="button" className="w-6 h-6 sm:w-8 sm:h-8 mr-1">
          <Skeleton className="h-full w-full" />
        </button>
      </li>
    </>
  );
};
