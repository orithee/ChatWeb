// Client type:
export type Client = {
  send: (arg0: string) => void;
  on: (arg0: string, arg1: { (msg: any): void }) => void;
};

// Messages Types:
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
  email: string;
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
