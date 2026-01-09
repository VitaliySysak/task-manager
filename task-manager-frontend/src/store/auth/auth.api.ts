import type { LoginPayloadModel, RegisterPayloadModel } from '@/models/auth.model';
import type { StatusResponseModel } from '@/models/status-response.model';

import { api } from '@/store/api';

export const authApi = api.injectEndpoints({
  endpoints: build => ({
    register: build.mutation<StatusResponseModel, RegisterPayloadModel>({
      query: registerPayload => ({
        url: '/auth/register',
        method: 'POST',
        body: registerPayload,
      }),
      invalidatesTags: ['Auth'],
    }),
    login: build.mutation<StatusResponseModel, LoginPayloadModel>({
      query: loginPayload => ({
        url: '/auth/login',
        method: 'POST',
        body: loginPayload,
      }),
      invalidatesTags: ['Auth'],
    }),
    logOut: build.mutation<StatusResponseModel, void>({
      query: () => ({
        url: '/auth/log-out',
        method: 'POST',
      }),
      invalidatesTags: ['Auth'],
    }),
  }),
});

export const { useRegisterMutation, useLoginMutation, useLogOutMutation } = authApi;
