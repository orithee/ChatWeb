import { createSlice } from '@reduxjs/toolkit';
import {
  NewGroupFromServer,
  updateGlobalMessageAction,
  ErrorFromServer,
  Initial,
  User,
  updateUserLoggedAction,
} from '../helpers/types';

export interface GlobalInterface {
  user: User | undefined;
  globalMessage: Initial | ErrorFromServer | NewGroupFromServer;
}

const initialState: GlobalInterface = {
  user: undefined,
  globalMessage: { type: 'initial' },
};

export const globalSlice = createSlice({
  name: 'global',
  initialState,
  reducers: {
    updateUserLogged: (state, action: updateUserLoggedAction) => {
      state.user = action.payload;
    },

    updateGlobalMessage: (state, action: updateGlobalMessageAction) => {
      state.globalMessage = action.payload;
    },
  },
});

export const { updateUserLogged, updateGlobalMessage } = globalSlice.actions;

export default globalSlice.reducer;
