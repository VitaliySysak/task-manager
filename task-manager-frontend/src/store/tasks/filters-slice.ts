import { createSlice } from '@reduxjs/toolkit';

import type { RootState } from '@/store/store';

import { TaskStatus } from '@/models/task.model';

const initialState = {
  title: '',
  description: '',
  status: TaskStatus.TODO,
};

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setTitleFilter: (state, action) => {
      state.title = action.payload;
    },
  },
});

export const { setTitleFilter } = filtersSlice.actions;
export const selectTitleFilter = (state: RootState) => state.filter.title;

const filtersReducer = filtersSlice.reducer;
export default filtersReducer;
