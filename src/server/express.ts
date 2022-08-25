import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { join } from 'path';

dotenv.config({ path: join(__dirname, '../../.env') });

// Initialize the server + port:
const PORT = process.env.PORT;
export const expressServer = express()
  .use((req: Request, res: Response) => {
    console.log('Request: ' + req.path);
    res.sendFile(req.path || 'index.html', {
      root: './dist',
    });
  })
  .listen(PORT, () => console.log(`Hosted: http://localhost:${PORT}`));
