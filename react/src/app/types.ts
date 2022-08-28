// Messages Types:
export type MessageTypes = LoginToClient | Error;

export interface LoginToClient {
  type: 'login';
  username: string;
  token: string;
}

interface Error {
  type: 'error';
  problem: string;
  title: string;
}
