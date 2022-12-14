// Messages Types:
export type MessageTypes =
  | LoginFromServer
  | ErrorFromServer
  | NewGroupFromServer
  | Initial
  | GroupListFromServer
  | NewGroupMessageFromServer
  | OpenGroupData
  | LastMessageWasReadFromServer
  | GifFromServer;

export interface LoginFromServer {
  type: 'loginFromServer';
  userData: User;
}
export interface GifFromServer {
  type: 'gifRes';
  success: boolean;
  url: string;
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
  members: GroupMember[];
}

export interface Initial {
  type: 'initial';
}

interface GroupListFromServer {
  type: 'groupListFromServer';
  list: Group[];
}
export interface OpenGroupData {
  type: 'openGroup';
  messages: GroupMessage[] | [];
  members: GroupMember[];
  group: Group;
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
  is_image: boolean;
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
  last_message: number;
  row_to_json: GroupMessage;
  not_read: number;
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

export interface getGroupMembersAction {
  payload: GroupMember[];
  type: string;
}

export interface GroupMember {
  user_name: string;
  not_read: number;
}

export interface LastMessageWasReadFromServer {
  type: 'lastMessageWasRead';
  groupId: number;
  userName?: string;
}

export interface LastMessageWasReadAction {
  payload: { groupId: number; userName?: string | undefined };
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
  payload: Initial | ErrorFromServer | NewGroupFromServer | GifFromServer;
  type: string;
}

export interface updateUserLoggedAction {
  payload: User | undefined;
  type: string;
}
