import { createSlice } from '@reduxjs/toolkit';

export interface mainInterface {
  groupList: string[] | undefined;
  currentGroup: string | undefined;
  groupMessages: string[] | undefined;
  currentMessage: string | undefined;
}

const initialState: mainInterface = {
  groupList: undefined,
  currentGroup: undefined,
  groupMessages: undefined,
  currentMessage: undefined,
};

export const mainSlice = createSlice({
  name: 'main',
  initialState,
  reducers: {
    updateGroupList: (state, action) => {
      state.groupList = action.payload;
    },
    currentGroup: (state, action) => {
      state.groupList = action.payload;
    },
    groupMessages: (state, action) => {
      state.groupList = action.payload;
    },
    currentMessage: (state, action) => {
      state.groupList = action.payload;
    },
  },
});

export const { updateGroupList, currentGroup, groupMessages, currentMessage } =
  mainSlice.actions;

export default mainSlice.reducer;
