import { AnyAction } from '@reduxjs/toolkit';
import { Dispatch } from 'react';
import { updateUserLogged, updateCurrentMessage } from './appSlice';
import { toObj, setToken } from '../assets/auxiliaryFunc';

export function messageFilter(
  event: MessageEvent<any>,
  dispatch: Dispatch<AnyAction>
) {
  // A function that filters the messages from the server and updates the reducer:
  console.log('messageFilter:', event.data);
  const message = toObj(event.data);

  if (message.type === 'login') {
    dispatch(updateUserLogged(message.username));
    setToken(message.token);
  }
  dispatch(updateCurrentMessage(message));
}
