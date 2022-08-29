import { Server } from 'ws';
import {
  MessageTypes,
  Client,
  Login,
  Register,
  Initial,
  NewGroup,
} from './types';
import { expressServer } from './express';
import { postgresConnect, createTables } from '../db/buildDB';
import { createGroup, createUser } from '../db/create';
import { toObj, toStr } from './auxiliaryFunc';
import {
  checkLogin,
  checkUsername,
  checkToken,
  checkGroupName,
} from '../db/read';
import sha1 from 'sha1';

init();
async function init() {
  // A function that initializes the server and the database:
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

    client.on('message', async (msg) => {
      const message: MessageTypes = toObj(msg);
      console.log(message.type, 'request');

      // Check if the token is worth some token on the database:
      if (message.type === 'initial') initialFunction(client, message);

      // Adding a new user to the database:
      if (message.type === 'register') registerFunction(client, message);

      // Checks the username and password:
      if (message.type === 'login') loginFunction(client, message);

      // Adding a new group to the database:
      if (message.type === 'createNewGroup') {
        createNewGroupFunction(client, message);
      }

      // Sending an error message to the client:
      if (message.type === 'error') {
        client.send('error from server');
      }
    });

    client.on('close', () => console.log('Client disconnected'));
  });
}

async function loginFunction(client: Client, message: Login) {
  if (await checkLogin(message)) {
    client.send(
      toStr({
        type: 'login',
        username: message.username,
        token: sha1(message.password + message.username),
      })
    );
  } else
    client.send(
      toStr({
        type: 'error',
        problem: 'login',
        title: 'no match',
      })
    );
}

async function registerFunction(client: Client, message: Register) {
  if (await checkUsername(message)) {
    if (await createUser(message)) {
      client.send(
        toStr({
          type: 'login',
          username: message.username,
          token: sha1(message.password + message.username),
        })
      );
    } else client.send('Registration failed !');
  } else
    client.send(
      toStr({
        type: 'error',
        problem: 'register',
        title: 'username',
      })
    );
}

async function initialFunction(client: Client, message: Initial) {
  const login = await checkToken(message);
  if (login) client.send(toStr(login));
  else client.send('no match');
}

async function createNewGroupFunction(client: Client, message: NewGroup) {
  if (await checkGroupName(message)) {
    if (await createGroup(message)) {
      console.log('createNewGroup');
      // client.send(
      //   toStr({
      //     type: 'createNewGroup',
      //     title: '',
      //   })
      // );
    } else {
      client.send(
        toStr({
          type: 'error',
          problem: 'createNewGroup',
          title: 'fail',
        })
      );
    }
  } else {
    client.send(
      toStr({
        type: 'error',
        problem: 'createNewGroup',
        title: 'groupName',
      })
    );
  }
}
