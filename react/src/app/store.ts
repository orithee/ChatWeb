import { configureStore } from '@reduxjs/toolkit';
import globalSlice from './appSlice';
import { State } from './appSlice';

export const store = configureStore({
  reducer: {
    global: globalSlice,
  },
});

export type globalState = { global: State };
