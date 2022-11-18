import { createSlice } from '@reduxjs/toolkit';
import {
  getGroupListAction,
  getGroupMessagesAction,
  Group,
  GroupMessage,
  newGroupMessageAction,
  newGroupToGroupListAction,
  updateCurrentGroupAction,
  GroupMember,
  getGroupMembersAction,
  LastMessageWasReadAction,
} from '../helpers/types';

export interface ChatInterface {
  groupList: Group[] | undefined;
  currentGroup: Group | undefined;
  groupMessages: GroupMessage[] | undefined;
  groupMembers: GroupMember[] | undefined;
  currentMessage: GroupMessage | undefined;
}

const initialState: ChatInterface = {
  groupList: undefined,
  currentGroup: undefined,
  groupMessages: undefined,
  groupMembers: undefined,
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

    // Update that a specific user has read the messages in a specific (current) group:
    updateNotReadSpecificMember: (state, action: LastMessageWasReadAction) => {
      if (state.groupMembers && state.currentGroup) {
        if (state.currentGroup.group_id === action.payload.groupId)
          for (const member of state.groupMembers) {
            if (member.user_name === action.payload.userName) {
              member.not_read = 0;
              break;
            }
          }
      }
    },

    // A function that updates that all the messages in the group have been read:
    updateWas_readToTrue: (state, action: LastMessageWasReadAction) => {
      // Update the last message - 'was_read' to true on specific group:
      if (state.groupList !== undefined) {
        for (const group of state.groupList) {
          if (group.group_id === action.payload.groupId && group.row_to_json) {
            group.row_to_json.was_read = true;
            break;
          }
        }
      }

      // Update all 'not_read' members to 0 if the update is on the current group:
      if (state.groupMembers && state.currentGroup) {
        if (state.currentGroup.group_id === action.payload.groupId)
          for (const member of state.groupMembers) member.not_read = 0;
      }
    },

    // Update the currentGroup that is open in the chat:
    updateCurrentGroup: (state, action: updateCurrentGroupAction) => {
      state.currentGroup = action.payload;

      // Reset the 'not_read' number of currentGroup:
      if (state.groupList !== undefined) {
        for (const group of state.groupList) {
          if (group.group_id === action.payload?.group_id) {
            group.not_read = 0;
            break;
          }
        }
      }
    },

    // Update the messages of the specific group chat that is open:
    getGroupMessages: (state, action: getGroupMessagesAction) => {
      state.groupMessages = action.payload;
    },

    // Update the 'groupMembers':
    getGroupMembers: (state, action: getGroupMembersAction) => {
      state.groupMembers = action.payload;
    },

    // Insert a new message to the 'groupMessages' state:
    updateNewGroupMessage: (state, action: newGroupMessageAction) => {
      if (action.payload === undefined) {
        // In the case of disconnection there is a situation where the operation is equal to undefined:
        state.groupMessages = action.payload;
      } else {
        // - Now: action.payload = GroupMessage... -
        if (state.groupMessages === undefined) {
          state.groupMessages = [action.payload];
        } else if (action.payload.group_id === state.currentGroup?.group_id) {
          state.groupMessages = [...state.groupMessages, action.payload];
        }
      }

      // Update the last message in the 'groupList':
      if (state.groupList !== undefined) {
        state.groupList.forEach((group, index) => {
          if (group.group_id === action.payload?.group_id) {
            group.row_to_json = action.payload;
            group.last_message = action.payload.message_id;
            if (group.group_id !== state.currentGroup?.group_id) {
              group.not_read++;
            }

            // Update the 'groupList' order:
            if (index > 0) {
              state.groupList?.splice(index, 1);
              state.groupList?.splice(0, 0, group);
            }
          }
        });
      }

      // Update 'not_read' number:
      if (state.groupMembers) {
        for (const member of state.groupMembers) {
          if (member.user_name === action.payload?.sent_by_name) continue;
          member.not_read++;
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
  getGroupMembers,
  updateNotReadSpecificMember,
  updateWas_readToTrue,
} = chatSlice.actions;

export default chatSlice.reducer;
