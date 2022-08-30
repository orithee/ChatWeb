import { createSlice } from '@reduxjs/toolkit';
import { MessageTypes } from './types';

export interface globalInterface {
  userName: string | undefined;
  message: MessageTypes;
}

const initialState: globalInterface = {
  userName: undefined,
  message: { type: 'initial' },
};

export const globalSlice = createSlice({
  name: 'global',
  initialState,
  reducers: {
    updateUserLogged: (state, action) => {
      state.userName = action.payload;
    },
    updateCurrentMessage: (state, action) => {
      state.message = action.payload;
    },
  },
});

export const { updateUserLogged, updateCurrentMessage } = globalSlice.actions;

export default globalSlice.reducer;
