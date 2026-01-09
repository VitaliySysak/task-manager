import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { BASE_URL } from '@/constants/api.constants';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    credentials: 'include',
    prepareHeaders: (headers) => {
      headers.set('Content-Type', 'application/json;charset=UTF-8');
      headers.set('Authorization', 'anonymous');

      return headers;
    },
  }),
  tagTypes: ['Task', 'Auth'],
  endpoints: _ => ({}),
});
