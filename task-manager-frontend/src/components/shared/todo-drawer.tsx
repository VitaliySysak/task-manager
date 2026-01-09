import React from 'react';
import { useDispatch } from 'react-redux';

import type { TaskStatus } from '@/models/auth.model';

import { cn } from '@/lib/utils';
import { setTaskDescription } from '@/store/tasks/tasks-slice';

type FormData = {
  title: string;
  description: string;
  status: TaskStatus;
  showDrawer: boolean;
};

type Props = {
  className?: string;
  formData: FormData;
};

export const TodoDrawer: React.FC<Props> = ({ className, formData }) => {
  const dispatch = useDispatch();
  return (
    <div
      className={cn(
        'absolute top-36 sm:top-43 2xl:top-57 h-96.25 sm:h-96.25 2xl:h-120.25 rounded-md w-full px-4 sm:px-8 py-4 bg-(--very-dark-desaturated-blue) z-10',
        className,
      )}
    >
      <label htmlFor="description" className="block mb-2 text-sm sm:text-base">
        Add a description:
      </label>
      <textarea
        id="description"
        value={formData.description}
        onChange={event => dispatch(setTaskDescription(event.target.value))}
        className="w-full p-2 rounded bg-(--very-dark-grayish-blue) max-h-100 focus:outline-none"
        rows={3}
        placeholder="Write more details about your task..."
      />
    </div>
  );
};
