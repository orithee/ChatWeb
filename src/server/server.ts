import { Server } from 'ws';
import {
  MessageTypes,
  Client,
  Login,
  Register,
  Initial,
  NewGroup,
  GetGroupMessages,
  MessageSent,
} from './types';
import { expressServer } from './express';
import { postgresConnect, createTables } from '../db/buildDB';
import { createGroup, createUser, insertMessage } from '../db/create';
import { toObj, toStr, sendError } from './auxiliaryFunc';
import {
  checkLogin,
  checkUsername,
  checkToken,
  checkGroupName,
  checkMembers,
  getGroupList,
  getMessages,
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

      // Get messages of specific group:
      if (message.type === 'getGroupMessages')
        groupMessagesFunction(client, message);

      // New message:
      if (message.type === 'chatMessage') messageSentFunction(ws, message);

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
        list: await getGroupList(login.userData.user_id),
      })
    );
  } else client.send(sendError('error', 'initial', 'no match'));
}

async function registerFunction(client: Client, message: Register) {
  if (await checkUsername(message)) {
    const newUser = await createUser(message);
    if (typeof newUser != 'boolean') {
      client.send(toStr(newUser));
      client.send(
        toStr({
          type: 'groupList',
          list: [],
        })
      );
    } else client.send(sendError('error', 'register', 'failed'));
  } else client.send(sendError('error', 'register', 'username'));
}

async function loginFunction(client: Client, message: Login) {
  const login = await checkLogin(message);
  if (typeof login != 'boolean') {
    client.send(toStr(login));
    client.send(
      toStr({
        type: 'groupList',
        list: await getGroupList(login.userData.user_id),
      })
    );
  } else client.send(sendError('error', 'login', 'no match'));
}

async function newGroupFunction(client: Client, message: NewGroup) {
  // TODO: Think about the group_name / group_id...
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

async function groupMessagesFunction(
  client: Client,
  message: GetGroupMessages
) {
  const messages = await getMessages(message.groupName);
  client.send(
    toStr({
      type: 'groupMessagesFromServer',
      messages: messages,
    })
  );
}

async function messageSentFunction(ws: Server, message: MessageSent) {
  const insertMsg = await insertMessage(message);
  if (insertMsg) {
    console.log(insertMsg);
    ws.clients.forEach((client) => {
      client.send(
        toStr({
          type: 'newMessage',
          data: insertMsg,
        })
      );
    });
  } else {
    // TODO: Send error to the specific client that send this message...
    console.log('error in message:', message);
  }
}
