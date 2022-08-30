// Messages Types:
export type MessageTypes =
  | LoginFromServer
  | ErrorFromServer
  | NewGroupFromServer
  | Initial;

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
