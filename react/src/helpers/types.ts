import { IndexRouteProps } from 'react-router-dom';

// Messages Types:
export type MessageTypes =
  | LoginFromServer
  | ErrorFromServer
  | NewGroupFromServer
  | Initial
  | GroupMessagesFromServer
  | GroupListFromServer
  | NewGroupMessageFromServer;

export interface LoginFromServer {
  type: 'loginFromServer';
  userData: User;
}

export interface ErrorFromServer {
  type: 'error';
  problem: string;
  title: string | string[];
}

export interface NewGroupFromServer {
  type: 'newGroupFromServer';
  userName: string;
  group: Group;
  members: string[];
}

export interface Initial {
  type: 'initial';
}

interface GroupListFromServer {
  type: 'groupListFromServer';
  list: Group[];
}
export interface GroupMessagesFromServer {
  type: 'groupMessagesFromServer';
  messages: GroupMessage[] | [];
}

export interface NewGroupMessageFromServer {
  type: 'newGroupMessageFromServer';
  data: GroupMessage;
}

export interface GroupMessage {
  message_id: number;
  message_text: string;
  created_at: string;
  created_on: object;
  sent_by_id: number;
  sent_by_name: string;
  group_id: number;
  was_read: boolean;
}

export interface User {
  user_id: number;
  user_name: string;
  password: string;
  email: string;
  nickname: string;
  image: string;
  online: boolean;
}

export interface Group {
  group_id: number;
  admin_id: number;
  group_name: string;
  image: string;
}

export interface UserGroup {
  user_id: number;
  group_id: number;
  group_name: string;
}

export interface newGroupMessageAction {
  payload: GroupMessage | undefined;
  type: string;
}

export interface getGroupMessagesAction {
  payload: GroupMessage[] | undefined;
  type: string;
}

export interface updateCurrentGroupAction {
  payload: Group | undefined;
  type: string;
}

export interface newGroupToGroupListAction {
  payload: Group;
  type: string;
}

export interface getGroupListAction {
  payload: Group[] | undefined;
  type: string;
}

export interface updateGlobalMessageAction {
  payload: Initial | ErrorFromServer | NewGroupFromServer;
  type: string;
}

export interface updateUserLoggedAction {
  payload: User | undefined;
  type: string;
}
