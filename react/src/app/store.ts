import { configureStore } from '@reduxjs/toolkit';
import chatSlice from '../components/main/mainSlice';
import { chatInterface } from '../components/main/mainSlice';
import globalSlice from './appSlice';
import { globalInterface } from './appSlice';

export const store = configureStore({
  reducer: {
    global: globalSlice,
    chat: chatSlice,
  },
});

export type globalState = { global: globalInterface };
export type chatState = { chat: chatInterface };
