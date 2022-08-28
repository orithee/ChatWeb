import { createSlice } from '@reduxjs/toolkit';

interface State {
  userName: string | undefined;
}

const initialState: State = {
  userName: undefined,
};

export const globalSlice = createSlice({
  name: 'global',
  initialState,
  reducers: {
    updateUserLogged: (state, action) => {
      state.userName = action.payload;
    },
  },
});

export const { updateUserLogged } = globalSlice.actions;

export default globalSlice.reducer;
