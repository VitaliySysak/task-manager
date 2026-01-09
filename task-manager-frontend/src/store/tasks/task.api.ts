import type { TaskModel } from '@/models/task.model';

import { api } from '@/store/api';

export const taskApi = api.injectEndpoints({
  endpoints: build => ({
    getTasks: build.query<TaskModel[], void>({
      query: () => ({
        url: '/tasks',
        method: 'GET',
      }),
      providesTags: ['Task'],
    }),

    createTask: build.mutation<TaskModel, Partial<TaskModel>>({
      query: task => ({
        url: '/tasks',
        method: 'POST',
        body: task,
      }),
      invalidatesTags: ['Task'],
    }),

    updateTask: build.mutation<TaskModel, Partial<TaskModel>>({
      query: ({ id, ...body }) => ({
        url: `/tasks/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Task'],
    }),

    deleteTask: build.mutation<TaskModel, string>({
      query: taskId => ({
        url: `/tasks/${taskId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Task'],
    }),

    deleteCompletedTasks: build.mutation<void, { ids: string[] }>({
      query: ids => ({
        url: '/tasks/delete-many',
        method: 'POST',
        body: ids,
      }),
      invalidatesTags: ['Task'],
    }),
  }),
});

export const {
  useGetTasksQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
  useDeleteCompletedTasksMutation,
} = taskApi;
