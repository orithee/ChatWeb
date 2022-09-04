import { MessagesTypes } from './types';

export function toObj(msg: any): MessagesTypes {
  // A function that checks the value from the client and converts it to JSON:
  try {
    const msgToObj = JSON.parse(msg);
    return msgToObj;
  } catch (error) {
    console.log('error!  This message is string');
    return { type: 'error' };
  }
}

export function toStr(msg: Object): string {
  // A function that Convert object to string:
  const objToStr = JSON.stringify(msg);
  return objToStr;
}

export function sendError(
  type: string,
  problem: string,
  title: string | string[]
) {
  return toStr({
    type: type,
    problem: problem,
    title: title,
  });
}
