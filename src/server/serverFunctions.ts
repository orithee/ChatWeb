import {
  Client,
  Login,
  Register,
  Initial,
  CreateNewGroup,
  GetGroupMessages,
  MessageSent,
} from './types';
import { createGroup, createUser, insertGroupMessage } from '../db/create';
import { toStr, sendError } from './auxiliaryFunc';
import {
  checkLogin,
  checkUsername as usernameIsAvailable,
  checkToken,
  checkGroupName,
  checkMembers,
  getListOfGroups,
  getMessages,
} from '../db/read';
import { Server } from 'ws';

// Checks if the token is worth some token on the database:
export async function initialFunction(client: Client, message: Initial) {
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

// Add a new user to the database:
export async function registerFunction(client: Client, message: Register) {
  if (await usernameIsAvailable(message)) {
    const newUser = await createUser(message);
    if (newUser) {
      client.send(toStr(newUser));
      client.send(toStr({ type: 'groupListFromServer', list: [] }));
    } else client.send(sendError('error', 'register', 'failed'));
  } else client.send(sendError('error', 'register', 'username'));
}

// Checks the username and password:
export async function loginFunction(client: Client, message: Login) {
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

// Add a new group to the database:
export async function newGroupFunction(
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

// Get messages of specific group:
export async function groupMessagesFunction(
  client: Client,
  message: GetGroupMessages
) {
  const messages = await getMessages(message.groupId);
  client.send(toStr({ type: 'groupMessagesFromServer', messages: messages }));
}

// A New group message:
export async function messageSentFunction(
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
