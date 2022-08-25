export type MessageTypes = Initial | Register | Login | Error;

interface Login {
  type: 'login';
  username: string;
  password: string;
}

interface Register {
  type: 'register';
  username: string;
  password: string;
  mail: string;
}

interface Initial {
  type: 'initial';
  token: string | undefined;
}

interface Error {
  type: 'error';
}

// verified: boolean;
// userId: number;
