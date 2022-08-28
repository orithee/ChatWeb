import { createSlice } from '@reduxjs/toolkit';

export interface State {
  userName: string | undefined;
  message: any;
}

const initialState: State = {
  userName: undefined,
  message: '',
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
