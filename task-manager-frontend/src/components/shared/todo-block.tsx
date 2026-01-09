import React from 'react';

import { cn } from '@/lib/utils';

import { CreateTask } from './create-task';
import { TodoFooter } from './todo-footer';
import { TodoHeader } from './todo-header';
import { TodoList } from './todo-list';

type Props = {
  className?: string;
};

export const TodoBlock: React.FC<Props> = ({ className }) => {
  return (
    <section
      className={cn(
        'gap-4 sm:gap-6 2xl:gap-8 flex flex-col absolute justify-center',
        'w-[clamp(16rem,80vw,30rem)] sm:w-[clamp(18rem,76vw,46rem)] md:w-[clamp(18rem,76vw,40rem)] lg:w-160 2xl:w-[clamp(18rem,76vw,46rem)]',
        'top-1/4 -translate-y-1/4 md:top-1/2 md:-translate-y-1/2 left-1/2 -translate-x-1/2',
        className,
      )}
    >
      <TodoHeader />
      <CreateTask />
      <div>
        <TodoList />
        <TodoFooter />
      </div>
    </section>
  );
};
