import { Group, MessageTypes } from './types';

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

export function convertTime(str: string) {
  // Displaying the current time to the user:
  let hour = Number(str.slice(0, 2)) + 3;
  if (hour > 24) return '0' + (hour -= 24) + str.slice(2, 5);
  if (10 > hour) return '0' + hour + str.slice(2, 5);
  else return hour + str.slice(2, 5);
}

export function cutMessageText(group: Group) {
  const lastMsg = group.row_to_json;
  if (group === undefined) return '';
  else if (lastMsg?.is_image) return ': 📷';
  else if (lastMsg && lastMsg.message_text.length > 10) {
    return ': ' + lastMsg?.message_text.slice(0, 10) + '...';
  } else return ': ' + lastMsg?.message_text;
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
