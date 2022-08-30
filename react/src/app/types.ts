// Messages Types:
export type MessageTypes =
  | LoginFromServer
  | ErrorFromServer
  | NewGroupFromServer
  | Initial
  | GroupListFromServer;

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
