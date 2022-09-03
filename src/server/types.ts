// Client type:
export type Client = {
  send: (arg0: string) => void;
  on: (arg0: string, arg1: { (msg: any): void }) => void;
};

// Messages Types:
export type MessageTypes =
  | Initial
  | Register
  | Login
  | CreateNewGroup
  | Error
  | GetGroupList
  | GetGroupMessages
  | MessageSent;

export interface Login {
  type: 'login';
  userName: string;
  password: string;
}

export interface Register {
  type: 'register';
  userName: string;
  password: string;
  email: string;
}

export interface Initial {
  type: 'initial';
  token: string | undefined;
}

export interface CreateNewGroup {
  type: 'createNewGroup';
  userName: string;
  userId: number;
  groupName: string;
  members: string[];
}

export interface GetGroupList {
  type: 'getGroupList';
  username: string;
}

export interface LoginToClient {
  type: 'login';
  userData: User;
}

export interface GetGroupMessages {
  type: 'getGroupMessages';
  groupName: string;
}

interface Error {
  type: 'error';
}

export interface MessageSent {
  type: 'chatMessage';
  userId: number;
  groupId: number;
  text: string;
}

export interface GroupMessage {
  message_id: number;
  message_text: string;
  created_at: string;
  created_on: object;
  sent_by: string;
  group_name: string;
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

export interface UserGroups {
  user_id: number;
  group_id: number;
}

export interface Group {
  group_id: number;
  admin_id: number;
  group_name: string;
  image: string;
}
