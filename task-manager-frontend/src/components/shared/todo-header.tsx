import React from 'react';

import { cn } from '@/lib/utils';

import { Filter } from './filter';

type Props = {
  className?: string;
};

export const TodoHeader: React.FC<Props> = ({ className }) => {
  return (
    <header className={cn('flex justify-between items-center mb-2 md:mb-0 2xl:mb-6 sm:gap-16 md:gap-24', className)}>
      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-[1rem]">TODO</h1>
      <Filter />
    </header>
  );
};
