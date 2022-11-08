import { Server } from 'ws';
import { MessagesTypes, Client } from './types';
import { expressServer } from './express';
import { postgresConnect, createTables } from '../db/buildDB';
import { toObj, sendError, gifApiFunction } from './auxiliaryFunc';
import {
  newGroupFunction,
  initialFunction,
  loginFunction,
  groupMessagesFunction,
  registerFunction,
  messageSentFunction,
  messageWasReadFunction,
} from './serverFunctions';

init();
// A function that initializes the database and the server:
async function init() {
  try {
    await postgresConnect();
    await createTables();
    await webSocketConnect();
  } catch (error) {
    console.log(error);
  }
}

// Websocket server:
async function webSocketConnect() {
  // 1. Turning the express server to 'WebSocket':
  const ws = new Server({ server: expressServer });

  // 2. Connection to websocket:
  ws.on('connection', (client: Client) => {
    console.log('New client connected!');

    // 3. Filters messages and returns a reply to the client:
    client.on('message', async (msg) => {
      const message: MessagesTypes = toObj(msg);
      const type = message.type;
      console.log('request: ', type);

      if (type === 'initial') initialFunction(client, message);

      if (type === 'register') registerFunction(client, message);

      if (type === 'login') loginFunction(client, message);

      if (type === 'createNewGroup') newGroupFunction(ws, client, message);

      if (type === 'getGroupMessages') groupMessagesFunction(client, message);

      if (type === 'groupMessage') messageSentFunction(ws, client, message);

      if (type === 'wasReadMsg') messageWasReadFunction(ws, client, message);

      if (type === 'tryGif') gifApiFunction(client, message.termStr);

      if (type === 'error') {
        client.send(sendError('error', 'string', 'This message is a string!'));
      }
    });

    client.on('close', () => console.log('Client disconnected'));
  });
  ws.on('error', (err) => {
    console.log('error in ws server');
  });
  ws.on('close', () => {
    console.log('client connection closed');
  });
}
