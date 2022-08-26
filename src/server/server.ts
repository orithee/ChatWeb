import { Server } from 'ws';
import { MessageTypes, Client } from './types';
import { expressServer } from './express';
import { postgresConnect, createTables } from '../db/createDB';
import { createNewUser } from '../db/create';
import { checkLogin } from '../db/read';

init();
async function init() {
  try {
    await postgresConnect();
    await createTables();
    await webSocketConnect();
  } catch (error) {
    console.log(error);
  }
}

async function webSocketConnect() {
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
        try {
          createNewUser(message);
          client.send('Registration succeeded !');
        } catch (error) {
          client.send('Registration failed !');
        }
      }
      if (message.type === 'login') {
        try {
          checkLogin(message);
          client.send('Login succeeded !');
        } catch (error) {
          client.send('Login failed !');
        }
        client.send('login from server');
      }
      if (message.type === 'error') {
        client.send('error from server');
      }
    });

    client.on('close', () => console.log('Client disconnected'));
  });
}

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
