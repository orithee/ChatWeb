import { AnyAction } from '@reduxjs/toolkit';
import { Dispatch } from 'react';
import { updateUserLogged, updateGlobalMessage } from '../redux/globalSlice';
import { toObj, setToken } from './auxiliaryFunc';
import {
  getGroupList,
  getGroupMessages,
  updateNewGroupMessage,
  updateCurrentGroup,
  newGroupToGroupList,
  getGroupMembers,
  updateLastMessageWasRead,
} from '../redux/chatSlice';
import { NewGroupFromServer, User } from './types';

export default function messageFilter(
  event: MessageEvent<any>,
  dispatch: Dispatch<AnyAction>,
  user: User | undefined
) {
  // A function that filters the messages from the server and updates the reducer:
  const message = toObj(event.data);

  // The server returned that the connection was successful:
  if (message.type === 'loginFromServer') {
    dispatch(updateUserLogged(message.userData));
    setToken(message.userData.password);

    // List of groups (from the server):
  } else if (message.type === 'groupListFromServer') {
    dispatch(getGroupList(message.list));

    // Group messages (from the server):
  } else if (message.type === 'groupMessagesFromServer') {
    dispatch(getGroupMessages(message.messages));

    // Update the last message - 'was_read' (from the server):
  } else if (message.type === 'lastMessageWasRead') {
    const msg = { groupId: message.groupId, userName: message.userName };
    dispatch(updateLastMessageWasRead(msg));

    // Group members (from the server):
  } else if (message.type === 'groupMembersFromServer') {
    dispatch(getGroupMembers(message.members));

    // A new message has been created (from the server):
  } else if (message.type === 'newGroupMessageFromServer') {
    dispatch(updateNewGroupMessage(message.data));

    // A new group has been created (from the server):
  } else if (message.type === 'newGroupFromServer') {
    dispatch(updateGlobalMessage(message));
    showTheNewGroup(dispatch, message, user);

    // initial, error:
  } else {
    dispatch(updateGlobalMessage(message));
  }
}

function showTheNewGroup(
  dispatch: Dispatch<AnyAction>,
  message: NewGroupFromServer,
  user: User | undefined
) {
  /* A function that updates the current group and the group list if
     the member list includes the current user */
  if (user) {
    const userInMembers = message.members.includes(user.user_name);
    if (userInMembers || user.user_name === message.userName) {
      dispatch(updateCurrentGroup(message.group));
      dispatch(newGroupToGroupList(message.group));
      dispatch(getGroupMessages(undefined));
    }
  }
}
