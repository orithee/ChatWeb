import { Server } from 'ws';
import {
  MessagesTypes,
  Client,
  Login,
  Register,
  Initial,
  CreateNewGroup,
  GetGroupMessages,
  MessageSent,
} from './types';
import { expressServer } from './express';
import { postgresConnect, createTables } from '../db/buildDB';
import { createGroup, createUser, insertGroupMessage } from '../db/create';
import { toObj, toStr, sendError } from './auxiliaryFunc';
import {
  checkLogin,
  checkUsername as usernameIsAvailable,
  checkToken,
  checkGroupName,
  checkMembers,
  getListOfGroups,
  getMessages,
} from '../db/read';

init();
// TODO: Remove the functions to another file.
// TODO: Write more comments - for the frontend.
// TODO: Change the folders name of components to uppercase..
// TODO: Change the redux to chatSlice and globalSlice.
// TODO: Change the assets name to utilities / helpers.
// TODO: Change the reset name to log-out / something else.
// TODO: Check if exists something like redux clean... in reset.
//

async function init() {
  // A function that initializes the server and the database:
  try {
    await postgresConnect();
    await createTables();
    await webSocketConnect();
  } catch (error) {
    console.log(error);
  }
}

async function webSocketConnect() {
  /* 1. Turning the express server to 'WebSocket'.
     2. Connection to websocket.
     3. Filtering of message types.
     4. Answer to the client.  */
  const ws = new Server({ server: expressServer });

  ws.on('connection', (client: Client) => {
    console.log('New client connected!');

    client.on('message', async (msg) => {
      const message: MessagesTypes = toObj(msg);
      const type = message.type;
      console.log('request: ', type);

      // Check if the token is worth some token on the database:
      if (type === 'initial') initialFunction(client, message);

      // Adding a new user to the database:
      if (type === 'register') registerFunction(client, message);

      // Checks the username and password:
      if (type === 'login') loginFunction(client, message);

      // Adding a new group to the database:
      if (type === 'createNewGroup') newGroupFunction(ws, client, message);

      // Get messages of specific group:
      if (type === 'getGroupMessages') groupMessagesFunction(client, message);

      // New group message:
      if (type === 'groupMessage') messageSentFunction(ws, client, message);

      // Sending an error message to the client:
      if (type === 'error') {
        client.send(sendError('error', 'string', 'This message is a string!'));
      }
    });

    client.on('close', () => console.log('Client disconnected'));
  });
}

async function initialFunction(client: Client, message: Initial) {
  if (!message.token) client.send(sendError('error', 'initial', 'no token'));
  else {
    const login = await checkToken(message);
    if (login) {
      client.send(toStr(login));
      client.send(
        toStr({
          type: 'groupListFromServer',
          list: await getListOfGroups(login.userData.user_name),
        })
      );
    } else client.send(sendError('error', 'initial', 'no match'));
  }
}

async function registerFunction(client: Client, message: Register) {
  if (await usernameIsAvailable(message)) {
    const newUser = await createUser(message);
    if (newUser) {
      client.send(toStr(newUser));
      client.send(toStr({ type: 'groupListFromServer', list: [] }));
    } else client.send(sendError('error', 'register', 'failed'));
  } else client.send(sendError('error', 'register', 'username'));
}

async function loginFunction(client: Client, message: Login) {
  const login = await checkLogin(message);
  if (login) {
    client.send(toStr(login));
    client.send(
      toStr({
        type: 'groupListFromServer',
        list: await getListOfGroups(login.userData.user_name),
      })
    );
  } else client.send(sendError('error', 'login', 'no match'));
}

async function newGroupFunction(
  ws: Server,
  client: Client,
  message: CreateNewGroup
) {
  const checking = await checkMembers(message.members);
  if (Array.isArray(checking) && checking.length === 0) {
    if (await checkGroupName(message)) {
      const newGroup = await createGroup(message);
      if (newGroup) {
        ws.clients.forEach((client) => {
          client.send(
            toStr({
              type: 'newGroupFromServer',
              userName: message.userName,
              group: newGroup,
              members: message.members,
            })
          );
        });
      } else client.send(sendError('error', 'createNewGroup', 'failed'));
    } else client.send(sendError('error', 'createNewGroup', 'groupName'));
  } else client.send(sendError('error', 'createNewGroup', checking));
}

async function groupMessagesFunction(
  client: Client,
  message: GetGroupMessages
) {
  const messages = await getMessages(message.groupId);
  client.send(toStr({ type: 'groupMessagesFromServer', messages: messages }));
}

async function messageSentFunction(
  ws: Server,
  client: Client,
  message: MessageSent
) {
  const insertMsg = await insertGroupMessage(message);
  if (insertMsg) {
    ws.clients.forEach((client) => {
      client.send(
        toStr({ type: 'newGroupMessageFromServer', data: insertMsg })
      );
    });
  } else client.send(sendError('error', 'chatMessage', 'failed'));
}
