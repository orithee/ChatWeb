import { AnyAction } from '@reduxjs/toolkit';
import { Dispatch } from 'react';
import { NavigateFunction } from 'react-router-dom';
import { updateGlobalMessage, updateUserLogged } from '../redux/globalSlice';
import {
  getGroupMessages,
  updateCurrentGroup,
  updateNewGroupMessage,
  getGroupList,
} from '../redux/chatSlice';

export default function logOut(
  dispatch: Dispatch<AnyAction>,
  navigate: NavigateFunction
) {
  // A function that reset all - delete the token and return to the initial state:
  // Reset appSlice:
  dispatch(updateUserLogged(undefined));
  dispatch(updateGlobalMessage({ type: 'initial' }));

  // Reset mainSlice:
  dispatch(getGroupList(undefined));
  dispatch(updateCurrentGroup(undefined));
  dispatch(updateNewGroupMessage(undefined));
  dispatch(getGroupMessages(undefined));

  // Reset token:
  document.cookie = 'token=; Path=/; Expires=Thu, 01 Jan 2000 00:00:01 GMT;';
  navigate('/', { replace: true });
}
