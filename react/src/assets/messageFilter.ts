import { AnyAction } from '@reduxjs/toolkit';
import { Dispatch } from 'react';
import { updateUserLogged, updateCurrentMessage } from '../redux/appSlice';
import { toObj, setToken } from './auxiliaryFunc';
import {
  updateGroupList,
  getGroupMessages,
  updateNewMessage,
} from '../redux/mainSlice';

export function messageFilter(
  event: MessageEvent<any>,
  dispatch: Dispatch<AnyAction>
) {
  // A function that filters the messages from the server and updates the reducer:
  const message = toObj(event.data);
  // TODO: Update the groupList every time the user create new group...

  if (message.type === 'login') {
    dispatch(updateUserLogged(message.username));
    setToken(message.token);
  } else if (message.type === 'groupList') {
    dispatch(updateGroupList(message.list));
  } else if (message.type === 'groupMessagesFromServer') {
    console.log(message);
    dispatch(getGroupMessages(message.messages));
  } else if (message.type === 'newMessage') {
    dispatch(updateNewMessage(message.data));
  } else {
    dispatch(updateCurrentMessage(message));
  }
}
