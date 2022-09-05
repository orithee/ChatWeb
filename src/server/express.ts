import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { join } from 'path';

dotenv.config({ path: join(__dirname, '../../.env') });

// Initialize the server + port:
const PORT = process.env.PORT;
export const expressServer = express()
  .use((req: Request, res: Response) => {
    console.log('Request in expressServer:', req.path);
    if (process.env.NODE_ENV === 'production') {
      const route = (str: string) => req.path.toString().startsWith(str);
      if (route('/main') || route('/register') || route('/login')) {
        res.sendFile('/index.html', { root: './dist' });
      } else {
        res.sendFile(req.path || '/index.html', { root: './dist' });
      }
    }
  })
  .listen(PORT, () => console.log(`Hosted: http://localhost:${PORT}`));
