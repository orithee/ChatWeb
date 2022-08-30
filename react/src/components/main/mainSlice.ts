import { createSlice } from '@reduxjs/toolkit';

export interface chatInterface {
  groupList: string[] | undefined;
  currentGroup: string | undefined;
  groupMessages: string[] | undefined;
  currentMessage: string | undefined;
}

const initialState: chatInterface = {
  groupList: undefined,
  currentGroup: undefined,
  groupMessages: undefined,
  currentMessage: undefined,
};

export const chatSlice = createSlice({
  name: 'main',
  initialState,
  reducers: {
    updateGroupList: (state, action) => {
      console.log(action.payload);
      state.groupList = action.payload;
    },
    updateCurrentGroup: (state, action) => {
      state.currentGroup = action.payload;
    },
    updateGroupMessages: (state, action) => {
      state.groupMessages = action.payload;
    },
    updateCurrentMessage: (state, action) => {
      state.currentMessage = action.payload;
    },
  },
});

export const {
  updateGroupList,
  updateCurrentGroup,
  updateGroupMessages,
  updateCurrentMessage,
} = chatSlice.actions;

export default chatSlice.reducer;
