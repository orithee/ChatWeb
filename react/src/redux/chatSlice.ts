import { createSlice } from '@reduxjs/toolkit';
import {
  getGroupListAction,
  getGroupMessagesAction,
  Group,
  GroupMessage,
  newGroupMessageAction,
  newGroupToGroupListAction,
  updateCurrentGroupAction,
} from '../helpers/types';

export interface ChatInterface {
  groupList: Group[] | undefined;
  currentGroup: Group | undefined;
  groupMessages: GroupMessage[] | undefined;
  currentMessage: GroupMessage | undefined;
}

const initialState: ChatInterface = {
  groupList: undefined,
  currentGroup: undefined,
  groupMessages: undefined,
  currentMessage: undefined,
};

export const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    // Update the 'groupList' state:
    getGroupList: (state, action: getGroupListAction) => {
      state.groupList = action.payload;
    },

    // Add group into 'groupList' state:
    newGroupToGroupList: (state, action: newGroupToGroupListAction) => {
      if (state.groupList === undefined) state.groupList = [action.payload];
      else state.groupList = [action.payload, ...state.groupList];
    },

    // Update the currentGroup that is open in the chat:
    updateCurrentGroup: (state, action: updateCurrentGroupAction) => {
      state.currentGroup = action.payload;
    },

    // Update the messages of the specific group chat that is open:
    getGroupMessages: (state, action: getGroupMessagesAction) => {
      state.groupMessages = action.payload;
    },

    // Insert a new message to the 'groupMessages' state:
    updateNewGroupMessage: (state, action: newGroupMessageAction) => {
      if (action.payload === undefined) {
        state.groupMessages = action.payload;
      } else {
        // - Now: action.payload = GroupMessage... -
        if (state.groupMessages === undefined) {
          state.groupMessages = [action.payload];
        } else if (action.payload.group_id === state.currentGroup?.group_id) {
          state.groupMessages = [...state.groupMessages, action.payload];
        }
        // TODO: Adding option to update the other groups that they receive a new message ...
      }
    },
  },
});

export const {
  getGroupList,
  newGroupToGroupList,
  getGroupMessages,
  updateNewGroupMessage,
  updateCurrentGroup,
} = chatSlice.actions;

export default chatSlice.reducer;
