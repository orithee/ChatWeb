import { createSlice } from '@reduxjs/toolkit';
import {
  NewGroupFromServer,
  updateGlobalMessageAction,
  ErrorFromServer,
  Initial,
  User,
  updateUserLoggedAction,
  GifFromServer,
} from '../helpers/types';

export interface GlobalInterface {
  user: User | undefined;
  globalMessage: Initial | ErrorFromServer | NewGroupFromServer | GifFromServer;
}

const initialState: GlobalInterface = {
  user: undefined,
  globalMessage: { type: 'initial' },
};

export const globalSlice = createSlice({
  name: 'global',
  initialState,
  reducers: {
    // Update the user connected:
    updateUserLogged: (state, action: updateUserLoggedAction) => {
      state.user = action.payload;
    },

    // Update the current 'globalMessage':
    updateGlobalMessage: (state, action: updateGlobalMessageAction) => {
      state.globalMessage = action.payload;
    },
  },
});

export const { updateUserLogged, updateGlobalMessage } = globalSlice.actions;

export default globalSlice.reducer;
