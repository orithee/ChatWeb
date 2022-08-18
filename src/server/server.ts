import express, { Request, Response } from 'express';
import { json } from 'body-parser';
import cors from 'cors';

const server = express();
server.use(json());
server.use(express.static('./dist'));
server.use(cors());

// Get requests:
server.get('/get', async (req: Request, res: Response) => {
  console.log('get request');
  res.send({ message: true });
});

// Initialize the server + port:
const port = process.env.PORT || 4000;
server.listen(port, () => console.log('Hosted: http://localhost:' + port));
