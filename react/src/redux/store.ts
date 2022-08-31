import { configureStore } from '@reduxjs/toolkit';
import chatSlice from './mainSlice';
import { chatInterface } from './mainSlice';
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
