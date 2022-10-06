import { createSlice } from '@reduxjs/toolkit';
import {
  getGroupListAction,
  getGroupMessagesAction,
  Group,
  GroupMessage,
  newGroupMessageAction,
  newGroupToGroupListAction,
  resetNotReadAction,
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
      // if (state.groupList != undefined) {
      //   for (const group of state.groupList) {
      //     if (group.group_id === action.payload?.group_id) {
      //       group.not_read = 0;
      //       break;
      //     }
      //   }
      // }
    },

    // Update the messages of the specific group chat that is open:
    getGroupMessages: (state, action: getGroupMessagesAction) => {
      state.groupMessages = action.payload;
    },

    // Reset the not_read number of currentGroup:
    resetNotRead: (state, action: resetNotReadAction) => {
      // if (state.groupList != undefined) {
      //   for (const group of state.groupList) {
      //     if (group.group_id == action.payload) {
      //       group.not_read = 0;
      //       break;
      //     }
      //   }
      // }
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

      // Update the last message in the groupList:
      if (state.groupList != undefined) {
        for (const group of state.groupList) {
          if (group.group_id == action.payload?.group_id) {
            if (state.currentGroup?.group_id !== group.group_id) {
              group.not_read = group.not_read + 1;
              group.last_message = action.payload;
            }
            break;
          }
        }
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
  resetNotRead,
} = chatSlice.actions;

export default chatSlice.reducer;
