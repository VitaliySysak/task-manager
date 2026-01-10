import React from 'react';
import toast from 'react-hot-toast';
import { IoIosAdd, IoIosArrowDown } from 'react-icons/io';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { isOptimisticallyLoggedIn } from '@/lib/auth';
import { cn } from '@/lib/utils';
import { TaskStatus } from '@/models/task.model';
import { useAppDispatch } from '@/store/store';
import { useCreateTaskMutation, useGetTasksQuery } from '@/store/tasks/task.api';
import {
  resetTaskForm,
  selectTaskForm,
  setShowTaskDrawer,
  setTaskTitle,
  toggleTaskIsCompleted,
} from '@/store/tasks/tasks-slice';

import { TodoDrawer } from './todo-drawer';
import { Input } from '../ui/input';

type Props = {
  className?: string;
};

export const CreateTask: React.FC<Props> = ({ className }) => {
  const isLoggedIn = isOptimisticallyLoggedIn();
  const navigate = useNavigate();

  const [createTask] = useCreateTaskMutation();
  const { data: tasks } = useGetTasksQuery();

  const taskForm = useSelector(selectTaskForm);

  const dispatch = useAppDispatch();

  const onSubmitHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    try {
      event.preventDefault();
      const isExist = tasks?.some(({ title }) => title === taskForm.title);

      if (isLoggedIn) {
        if (taskForm.title) {
          if (!isExist) {
            createTask({
              title: taskForm.title,
              description: taskForm.description,
              status: taskForm.status,
            });
          } else {
            toast.error('Task with same title alredy exist');
          }
          dispatch(resetTaskForm());
        } else {
          toast.error("Task title can't be empty");
        }
      } else {
        navigate('/auth');
        toast.error('You need to log in!');
      }
    } catch (error) {
      console.error('Error while execution create-task/onSubmitHandler:', error);
    }
  };
  return (
    <>
      <form
        className={cn(
          'flex px-4 sm:px-8 gap-4 sm:gap-8 items-center bg-primary min-w-0 min-h-16 2xl:min-h-20',
          'overflow-y-auto overflow-x-hidden rounded-md',
          className,
        )}
        onSubmit={onSubmitHandler}
      >
        <figure
          onClick={() => dispatch(toggleTaskIsCompleted())}
          className={cn(
            taskForm.status === TaskStatus.DONE
              ? "bg-(image:--linear-gradient) before:text-xs sm:before:text-base before:content-['✔'] before:text-white before:flex before:items-center before:justify-center pt-1"
              : 'bg-transparent',
            'aspect-square border w-6 h-6 sm:w-8 sm:h-8 rounded-full border-(--very-dark-grayish-blue-2) cursor-pointer',
          )}
        />
        <Input
          name="create-task"
          className="h-8 text-base border-none sm:text-xl lg:text-2xl text-secondary-dark caret-white flex-1 placeholder:translate-y-0.5"
          placeholder="Create a new todo..."
          value={taskForm.title}
          onChange={(event) => dispatch(setTaskTitle(event.target.value))}
        />
        <div className="flex gap-2 sm:pr-0">
          <button
            onClick={() => dispatch(setShowTaskDrawer())}
            className="flex justify-center items-center w-8 h-8 sm:w-10 sm:h-10 cursor-pointer"
            type="button"
          >
            <IoIosArrowDown
              color="var(--very-dark-grayish-blue)"
              className={cn(taskForm.showDrawer && 'rotate-180', 'w-5 h-5 sm:w-8 sm:h-8')}
            />
          </button>
          <button className="cursor-pointer" type="submit">
            <IoIosAdd className="w-8 h-8 sm:w-10 sm:h-10" color="var(--very-dark-grayish-blue)" size={40} />
          </button>
        </div>
      </form>

      {taskForm.showDrawer && <TodoDrawer formData={taskForm} />}
    </>
  );
};
