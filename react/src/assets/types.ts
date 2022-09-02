// Messages Types:
export type MessageTypes =
  | LoginFromServer
  | ErrorFromServer
  | NewGroupFromServer
  | Initial
  | GroupMessagesFromServer
  | GroupListFromServer
  | NewMessage;

export interface LoginFromServer {
  type: 'login';
  username: string;
  token: string;
}

interface ErrorFromServer {
  type: 'error';
  problem: string;
  title: string | string[];
}

interface NewGroupFromServer {
  type: 'createNewGroup';
  userName: string;
  members: string[];
}

interface Initial {
  type: 'initial';
}

interface GroupListFromServer {
  type: 'groupList';
  list: string[];
}
export interface GroupMessagesFromServer {
  type: 'groupMessagesFromServer';
  messages: GroupMessage[] | [];
}

export interface NewMessage {
  type: 'newMessage';
  data: GroupMessage;
}

export interface GroupMessage {
  message_id: number;
  message_text: string;
  created_at: string;
  created_on: object;
  sent_by: string;
  group_name: string;
}
