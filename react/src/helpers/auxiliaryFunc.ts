import { MessageTypes } from './types';

export function toStr(msg: Object): string {
  // A function that Convert object to string:
  const objToStr = JSON.stringify(msg);
  return objToStr;
}

export function toObj(msg: string): MessageTypes {
  // A function that convert string to Object:
  try {
    const msgToObj = JSON.parse(msg);
    return msgToObj;
  } catch (error) {
    console.log('Error!  This message is not object');
    return { type: 'error', problem: 'convert', title: 'is string' };
  }
}

export function setToken(value: string) {
  // 1. Delete the last token(if exists):
  document.cookie = `token=; expires=Thu, 01 Jan 2000 00:00:01 GMT;`;

  // 2. Define the new token:
  const expire = new Date();
  expire.setTime(new Date().getTime() + 3600000 * 24 * 14);
  document.cookie =
    'token=' +
    value +
    ';path=/' +
    ';expires=' +
    'SameSite=Lax' +
    expire.toUTCString();
}

export function deleteToken() {
  document.cookie = 'token=; expires=Thu, 01 Jan 2000 00:00:01 GMT;';
}
