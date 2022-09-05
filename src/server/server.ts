import { Server } from 'ws';
import { MessagesTypes, Client } from './types';
import { expressServer } from './express';
import { postgresConnect, createTables } from '../db/buildDB';
import { toObj, sendError } from './auxiliaryFunc';
import {
  newGroupFunction,
  initialFunction,
  loginFunction,
  groupMessagesFunction,
  registerFunction,
  messageSentFunction,
} from './serverFunctions';

init();
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

      if (type === 'initial') initialFunction(client, message);

      if (type === 'register') registerFunction(client, message);

      if (type === 'login') loginFunction(client, message);

      if (type === 'createNewGroup') newGroupFunction(ws, client, message);

      if (type === 'getGroupMessages') groupMessagesFunction(client, message);

      if (type === 'groupMessage') messageSentFunction(ws, client, message);

      // Sending an error message to the client:
      if (type === 'error') {
        client.send(sendError('error', 'string', 'This message is a string!'));
      }
    });

    client.on('close', () => console.log('Client disconnected'));
  });
}
