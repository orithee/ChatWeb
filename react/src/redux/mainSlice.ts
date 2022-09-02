import { createSlice } from '@reduxjs/toolkit';
import { GroupMessage } from '../assets/types';

export interface chatInterface {
  groupList: string[] | undefined;
  currentGroup: string | undefined;
  groupMessages: GroupMessage[] | undefined;
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
    getGroupMessages: (state, action) => {
      state.groupMessages = action.payload;
    },
    updateNewMessage: (
      state,
      action: {
        payload: GroupMessage;
        type: string;
      }
    ) => {
      if (
        state.groupMessages != undefined &&
        action.payload.group_name === state.currentGroup
      ) {
        state.groupMessages = [...state.groupMessages, action.payload];
      }
    },
    updateCurrentMessage: (state, action) => {
      state.currentMessage = action.payload;
    },
  },
});

export const {
  updateGroupList,
  updateCurrentGroup,
  getGroupMessages,
  updateNewMessage,
  updateCurrentMessage,
} = chatSlice.actions;

export default chatSlice.reducer;
