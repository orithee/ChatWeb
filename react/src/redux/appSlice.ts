import { createSlice } from '@reduxjs/toolkit';
import { MessageTypes, User } from '../assets/types';

export interface globalInterface {
  user: User | undefined;
  message: MessageTypes;
}

const initialState: globalInterface = {
  user: undefined,
  message: { type: 'initial' },
};

export const globalSlice = createSlice({
  name: 'global',
  initialState,
  reducers: {
    updateUserLogged: (state, action) => {
      state.user = action.payload;
    },
    updateCurrentMessage: (state, action) => {
      state.message = action.payload;
    },
  },
});

export const { updateUserLogged, updateCurrentMessage } = globalSlice.actions;

export default globalSlice.reducer;
