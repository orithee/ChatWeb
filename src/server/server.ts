import { Server } from 'ws';
import { MessageTypes, Client } from './types';
import { expressServer } from './express';
import { postgresConnect, createTables } from '../db/buildDB';
import { createUser } from '../db/create';
import { checkLogin, checkRegister as checkRegister } from '../db/read';

init();
async function init() {
  try {
    await postgresConnect();
    await createTables();
    await webSocketConnect();
  } catch (error) {
    console.log('"init" function failed:');
    console.log(error);
  }
}

async function webSocketConnect() {
  // Turning the express server to 'WebSocket':
  const ws = new Server({ server: expressServer });

  ws.on('connection', (client: Client) => {
    console.log('Client connected');
    client.send('Hey client from WebSocket!');

    client.on('message', async (msg: any) => {
      const message: MessageTypes = toJson(msg);
      console.log(message);

      if (message.type === 'initial') {
        client.send('initial from server');
      }

      // Adding a new user to the database:
      if (message.type === 'register') {
        if (await checkRegister(message)) {
          if (await createUser(message))
            client.send('Registration succeeded !');
          else client.send('Registration failed !');
        } else client.send('Registration failed !');
      }

      // Checks the username and password:
      if (message.type === 'login') {
        if (await checkLogin(message)) client.send('Login succeeded !');
        else client.send('Login failed !');
      }

      // Sending an error message to the client:
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
