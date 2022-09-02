import { AnyAction } from '@reduxjs/toolkit';
import { Dispatch } from 'react';
import { updateUserLogged, updateCurrentMessage } from '../redux/appSlice';
import { toObj, setToken } from './auxiliaryFunc';
import { updateGroupList, updateGroupMessages } from '../redux/mainSlice';

export function messageFilter(
  event: MessageEvent<any>,
  dispatch: Dispatch<AnyAction>
) {
  // A function that filters the messages from the server and updates the reducer:
  const message = toObj(event.data);
  if (message.type === 'login') {
    dispatch(updateUserLogged(message.username));
    setToken(message.token);
  } else if (message.type === 'groupList') {
    dispatch(updateGroupList(message.list));
  } else if (message.type === 'groupMessagesFromServer') {
    console.log(message);
    dispatch(updateGroupMessages(message.messages));
  } else {
    dispatch(updateCurrentMessage(message));
  }
}
