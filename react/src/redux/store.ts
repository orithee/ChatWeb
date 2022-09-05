import { configureStore } from '@reduxjs/toolkit';
import chatSlice from './chatSlice';
import { ChatInterface } from './chatSlice';
import globalSlice from './globalSlice';
import { GlobalInterface } from './globalSlice';

export const store = configureStore({
  reducer: {
    global: globalSlice,
    chat: chatSlice,
  },
});

export type globalState = { global: GlobalInterface };
export type chatState = { chat: ChatInterface };
