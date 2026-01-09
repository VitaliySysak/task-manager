import type { TypedUseSelectorHook } from 'react-redux';

import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';

import filtersReducer from '@/store/tasks/filters-slice';

import { api } from './api';
import tasksReducer from './tasks/tasks-slice';

const preloadedState = {};

const rootReducer = combineReducers({
  [api.reducerPath]: api.reducer,
  tasks: tasksReducer,
  filter: filtersReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(api.middleware),
  preloadedState,
  devTools: import.meta.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
