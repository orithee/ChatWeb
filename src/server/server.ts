import { Server } from 'ws';
import {
  MessageTypes,
  Client,
  Login,
  Register,
  Initial,
  NewGroup,
  GetGroupList,
} from './types';
import { expressServer } from './express';
import { postgresConnect, createTables } from '../db/buildDB';
import { createGroup, createUser } from '../db/create';
import { toObj, toStr, sendError } from './auxiliaryFunc';
import {
  checkLogin,
  checkUsername,
  checkToken,
  checkGroupName,
  checkMembers,
  getGroupList,
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
      console.log('request: ', message.type);

      // Check if the token is worth some token on the database:
      if (message.type === 'initial') initialFunction(client, message);

      // Adding a new user to the database:
      if (message.type === 'register') registerFunction(client, message);

      // Checks the username and password:
      if (message.type === 'login') loginFunction(client, message);

      // Adding a new group to the database:
      if (message.type === 'createNewGroup') newGroupFunction(client, message);

      // Sending an error message to the client:
      if (message.type === 'error') {
        client.send(sendError('error', 'error', 'error from server'));
      }
    });

    client.on('close', () => console.log('Client disconnected'));
  });
}

async function initialFunction(client: Client, message: Initial) {
  const login = await checkToken(message);
  if (typeof login != 'boolean') {
    client.send(toStr(login));
    client.send(
      toStr({
        type: 'groupList',
        list: await getGroupList(login.username),
      })
    );
  } else client.send(sendError('error', 'initial', 'no match'));
}

async function registerFunction(client: Client, message: Register) {
  if (await checkUsername(message)) {
    if (await createUser(message)) {
      client.send(
        toStr({
          type: 'groupList',
          list: [],
        })
      );
      client.send(
        toStr({
          type: 'login',
          username: message.username,
          token: sha1(message.password + message.username),
        })
      );
    } else client.send(sendError('error', 'register', 'failed'));
  } else client.send(sendError('error', 'register', 'username'));
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
    client.send(
      toStr({
        type: 'groupList',
        list: await getGroupList(message.username),
      })
    );
  } else client.send(sendError('error', 'login', 'no match'));
}

async function newGroupFunction(client: Client, message: NewGroup) {
  const checking = await checkMembers(message.members);
  if (checking.length === 0) {
    if (await checkGroupName(message)) {
      if (await createGroup(message)) {
        client.send(
          toStr({
            type: 'createNewGroup',
            userName: message.userName,
            members: message.members,
          })
        );
      } else client.send(sendError('error', 'createNewGroup', 'failed'));
    } else client.send(sendError('error', 'createNewGroup', 'groupName'));
  } else client.send(sendError('error', 'createNewGroup', checking));
}
