import { configureStore } from '@reduxjs/toolkit';
import mainSlice from '../components/main/mainSlice';
import { mainInterface } from '../components/main/mainSlice';
import globalSlice from './appSlice';
import { globalInterface } from './appSlice';

export const store = configureStore({
  reducer: {
    global: globalSlice,
    main: mainSlice,
  },
});

export type globalState = { global: globalInterface };
export type mainState = { global: mainInterface };
