// Messages Types:
export type MessagesTypes =
  | Initial
  | Register
  | Login
  | CreateNewGroup
  | GetGroupList
  | GetGroupMessages
  | MessageSent
  | WasReadMsg
  | TryGif
  | Error;

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
  groupId: number;
  members: string[];
}

export interface GetGroupList {
  type: 'getGroupList';
  username: string;
}

export interface GetGroupMessages {
  type: 'getGroupMessages';
  groupId: number;
  userName: string;
  lastMsgId: number;
  groupName: string;
}
export interface WasReadMsg {
  type: 'wasReadMsg';
  userName: string;
  groupId: number;
  lastMsgId: number;
}

export interface MessageSent {
  type: 'groupMessage';
  userId: number;
  userName: string;
  groupId: number;
  text: string;
  isImage: boolean;
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
  group: Promise<GroupMessage | undefined>;
  group_id: number;
  admin_id: number;
  group_name: string;
  image: string;
  last_message: number;
  row_to_json: GroupMessage;
  not_read: number;
}

export interface GroupMember {
  user_name: string;
  not_read: number;
}

export interface UserGroups {
  user_name: string;
  group_id: number;
  group_name: string;
}

export interface GroupMessage {
  message_id: number;
  message_text: string;
  created_at: string;
  created_on: object;
  sent_by_id: number;
  sent_by_name: string;
  group_id: number;
  is_image: boolean;
  was_read: boolean;
}

interface Error {
  type: 'error';
}

export interface LoginToClient {
  type: 'loginFromServer';
  userData: User;
}

export interface TryGif {
  type: 'tryGif';
  termStr: string;
}

// Client type:
export type Client = {
  send: (arg0: string) => void;
  on: (arg0: string, arg1: { (msg: any): void }) => void;
};
