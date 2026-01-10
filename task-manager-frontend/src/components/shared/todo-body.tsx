import React from 'react';
import { cn } from '@/lib/utils';
import { TodoList } from './todo-list';
import { TodoFooter } from './todo-footer';

interface Props {
  className?: string;
}

export const TodoBody: React.FC<Props> = ({ className }) => {
  return (
    <div className={cn('', className)}>
      <TodoList />
      <TodoFooter />
    </div>
  );
};
