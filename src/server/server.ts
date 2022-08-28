import { Server } from 'ws';
import { MessageTypes, Client } from './types';
import { expressServer } from './express';
import { postgresConnect, createTables } from '../db/buildDB';
import { createUser } from '../db/create';
import { checkLogin, checkRegister, checkToken } from '../db/read';
import sha1 from 'sha1';

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

      // Check if the token is worth some token on the database:
      if (message.type === 'initial') {
        const login = await checkToken(message);
        if (login) client.send(toStr(login));
        else client.send('no match');
      }

      // Adding a new user to the database:
      if (message.type === 'register') {
        if (await checkRegister(message)) {
          if (await createUser(message)) {
            client.send(
              toStr({
                type: 'login',
                username: message.username,
                token: sha1(message.password + message.username),
              })
            );
          } else client.send('Registration failed !');
        } else client.send('Change username !');
      }

      // Checks the username and password:
      if (message.type === 'login') {
        if (await checkLogin(message)) {
          client.send(
            toStr({
              type: 'login',
              username: message.username,
              token: sha1(message.password + message.username),
            })
          );
        } else client.send('Login failed !');
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

function toStr(msg: Object): string {
  // A function that Convert object to string:
  const objToStr = JSON.stringify(msg);
  return objToStr;
}
