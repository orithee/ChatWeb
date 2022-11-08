import { Client, MessagesTypes } from './types';
import dotenv from 'dotenv';
import { join } from 'path';
import axios from 'axios';
dotenv.config({ path: join(__dirname, '../../.env') });

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

// A function that makes an api for gif:
export async function gifApiFunction(client: Client, term: string) {
  try {
    const key = process.env.GIF_API_KEY;
    let url = `https://api.giphy.com/v1/gifs/search?api_key=${key}&limit=3&q=`;
    url = url.concat(term.trim());
    const content = await axios.get(url);
    if (content.data.data[0].images.downsized.url) {
      client.send(
        toStr({
          type: 'gifRes',
          success: true,
          url: content.data.data[0].images.downsized.url,
        })
      );
    }
  } catch (error) {
    client.send(toStr({ type: 'gifRes', success: false, url: '' }));
  }
}
