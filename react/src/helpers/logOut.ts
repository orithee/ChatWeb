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
import { deleteToken } from './auxiliaryFunc';

export default function logOut(
  dispatch: Dispatch<AnyAction>,
  navigate: NavigateFunction
) {
  // A function that reset all - delete the token and return to the initial state:
  // 1. Reset token:
  deleteToken();

  // 2. Reset appSlice:
  dispatch(updateUserLogged(undefined));
  dispatch(updateGlobalMessage({ type: 'initial' }));

  // 3. Reset mainSlice:
  dispatch(getGroupList(undefined));
  dispatch(updateCurrentGroup(undefined));
  dispatch(updateNewGroupMessage(undefined));
  dispatch(getGroupMessages(undefined));

  // 4. Return home
  navigate('/', { replace: true });
}
