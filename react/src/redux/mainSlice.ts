import { createSlice } from '@reduxjs/toolkit';
import { Group, GroupMessage } from '../assets/types';

export interface chatInterface {
  groupList: Group[] | undefined;
  currentGroup: Group | undefined;
  groupMessages: GroupMessage[] | undefined;
  currentMessage: GroupMessage | undefined;
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
      state.groupList = action.payload;
    },
    newGroupToGroupList: (state, action) => {
      if (state.groupList === undefined) state.groupList = [action.payload];
      else state.groupList = [action.payload, ...state.groupList];
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
      if (state.groupMessages === undefined) {
        if (action.payload !== undefined) {
          state.groupMessages = [action.payload];
        }
      } else if (action.payload.group_id === state.currentGroup?.group_id) {
        state.groupMessages = [...state.groupMessages, action.payload];
      }
    },
    updateCurrentGroupMessage: (state, action) => {
      state.currentMessage = action.payload;
    },
  },
});

export const {
  updateGroupList,
  updateCurrentGroup,
  getGroupMessages,
  updateNewMessage,
  updateCurrentGroupMessage,
  newGroupToGroupList,
} = chatSlice.actions;

export default chatSlice.reducer;
