import express, { Request, Response } from 'express';
import { json } from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import { join } from 'path';
import { Server } from 'ws';
import { MessageTypes } from './Interfaces';
dotenv.config({ path: join(__dirname, '../../.env') });

// TODO: Divided the 'express' server and the 'WebSocket' server to separate files.

// Initialize the server + port:
const PORT = process.env.PORT;
const server = express()
  .use((req: Request, res: Response) => {
    console.log('Request: ' + req.path);
    res.sendFile(req.path || 'index.html', {
      root: './dist',
    });
  })
  .listen(PORT, () => console.log(`Hosted: http://localhost:${PORT}`));

// Turning the express server to 'WebSocket':
const ws = new Server({ server });
type Client = {
  send: (arg0: string) => void;
  on: (arg0: string, arg1: { (msg: any): void }) => void;
};

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
      client.send('register from server');
    }
    if (message.type === 'login') {
      client.send('login from server');
    }
    if (message.type === 'error') {
      client.send('error from server');
    }
  });

  client.on('close', () => console.log('Client disconnected'));
});

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
