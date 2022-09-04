import { AnyAction } from '@reduxjs/toolkit';
import { Dispatch } from 'react';
import { updateUserLogged, updateCurrentMessage } from '../redux/appSlice';
import { toObj, setToken } from './auxiliaryFunc';
import {
  updateGroupList,
  getGroupMessages,
  updateNewMessage,
  updateCurrentGroup,
  newGroupToGroupList,
} from '../redux/mainSlice';
import { User } from './types';

export default function messageFilter(
  event: MessageEvent<any>,
  dispatch: Dispatch<AnyAction>,
  user: User | undefined
) {
  // A function that filters the messages from the server and updates the reducer:
  const message = toObj(event.data);

  // TODO: Change this structure to switch !
  if (message.type === 'login') {
    dispatch(updateUserLogged(message.userData));
    setToken(message.userData.password);
  } else if (message.type === 'groupList') {
    dispatch(updateGroupList(message.list));
  } else if (message.type === 'groupMessagesFromServer') {
    dispatch(getGroupMessages(message.messages));
  } else if (message.type === 'newMessage') {
    dispatch(updateNewMessage(message.data));
  } else if (message.type === 'createNewGroup') {
    dispatch(updateCurrentMessage(message));
    if (
      user &&
      (message.members.includes(user.user_name) ||
        user.user_name === message.userName)
    ) {
      dispatch(updateCurrentGroup(message.group));
      dispatch(newGroupToGroupList(message.group));
      dispatch(getGroupMessages(undefined));
    }
  } else {
    dispatch(updateCurrentMessage(message));
  }
}
