import { configureStore } from '@reduxjs/toolkit';
import globalSlice from './appSlice';

export const store = configureStore({
  reducer: {
    global: globalSlice,
  },
});
