import { AnyAction } from '@reduxjs/toolkit';
import { Dispatch } from 'react';
import { updateUserLogged, updateCurrentMessage } from './appSlice';
import { toObj, setToken } from '../assets/auxiliaryFunc';
import { updateGroupList } from '../components/main/mainSlice';

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
  } else {
    dispatch(updateCurrentMessage(message));
  }
}
