import { MessagesTypes } from './types';

// A function that checks the value from the client and converts it to JSON:
export function toObj(msg: any): MessagesTypes {
  try {
    const msgToObj = JSON.parse(msg);
    return msgToObj;
  } catch (error) {
    console.log('error!  This message is string');
    return { type: 'error' };
  }
}

// A function that Convert object to string:
export function toStr(msg: Object): string {
  const objToStr = JSON.stringify(msg);
  return objToStr;
}

// A function that accepts 3 parameters and returns a string-object:
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
