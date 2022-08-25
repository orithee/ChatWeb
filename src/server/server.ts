import { Server } from 'ws';
import { MessageTypes, Client } from './types';
import { expressServer } from './express';

// Turning the express server to 'WebSocket':
const ws = new Server({ server: expressServer });

ws.on('connection', (client: Client) => {
  console.log('Client connected');
  client.send('Hey client from WebSocket!');

  client.on('message', (msg: any) => {
    const message: MessageTypes = toJson(msg);
    console.log(message);

    if (message.type === 'initial') {
      client.send('initial from server');
    }
    if (message.type === 'register') {
      client.send('register from server');
    }
    if (message.type === 'login') {
      client.send('login from server');
    }
    if (message.type === 'error') {
      client.send('error from server');
    }
  });

  client.on('close', () => console.log('Client disconnected'));
});

function toJson(msg: any): MessageTypes {
  // A function that checks the value from the client and converts it to JSON:
  try {
    const msgToJson = JSON.parse(msg);
    return msgToJson;
  } catch (error) {
    console.log('error!  This message is string');
    return { type: 'error' };
  }
}
