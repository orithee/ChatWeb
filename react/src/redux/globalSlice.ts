import { createSlice } from '@reduxjs/toolkit';
import { MessageTypes, User } from '../helpers/types';

export interface GlobalInterface {
  user: User | undefined;
  message: MessageTypes;
}

const initialState: GlobalInterface = {
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
