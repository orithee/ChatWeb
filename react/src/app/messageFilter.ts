import { AnyAction } from '@reduxjs/toolkit';
import { Dispatch } from 'react';
import { updateUserLogged, updateCurrentMessage } from './appSlice';
import { MessageTypes } from './types';

export function messageFilter(
  event: MessageEvent<any>,
  dispatch: Dispatch<AnyAction>
) {
  console.log('messageFilter:', event.data);
  const message = toObj(event.data);
  if (message.type === 'login') {
    dispatch(updateUserLogged(message.username));
    setToken(message.token);
  }

  // dispatch(updateCurrentMessage(message));
}

function setToken(value: string) {
  const expire = new Date();
  expire.setTime(new Date().getTime() + 3600000 * 24 * 14);
  document.cookie = 'token=' + value + ';expires=' + expire.toUTCString();
}

function toObj(msg: string): MessageTypes {
  // A function that checks the value from the server and converts it to Object:
  try {
    const msgToObj = JSON.parse(msg);
    return msgToObj;
  } catch (error) {
    console.log('Error!  This message is not object');
    return { type: 'error' };
  }
}
