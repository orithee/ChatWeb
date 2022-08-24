import express, { Request, Response } from 'express';
import { json } from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import { join } from 'path';
import { Server } from 'ws';
dotenv.config({ path: join(__dirname, '../../.env') });

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
  on: (arg0: string, arg1: { (msg: string): void }) => void;
};

ws.on('connection', (client: Client) => {
  console.log('Client connected');
  client.send('Hey client from WebSocket!');

  client.on('message', (msg: string) => {
    console.log('Message from client: ' + msg);
  });

  client.on('close', () => console.log('Client disconnected'));
});
