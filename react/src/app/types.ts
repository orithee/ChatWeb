// Messages Types:
export type MessageTypes = Login | Error;

export interface Login {
  type: 'login';
  username: string;
}

interface Error {
  type: 'error';
}
