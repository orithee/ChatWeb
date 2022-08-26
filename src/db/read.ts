import { Login } from '../server/types';
import { postgres } from './createDB';

export async function checkLogin(user: Login): Promise<boolean> {
  // Check if the user exists:
  const sql = `SELECT * FROM users WHERE user_name=$1 AND password=$2;`;
  const values = [user.username, user.password];
  return new Promise<boolean>((resolve, _reject) => {
    postgres.query(sql, values, (err, res) => {
      if (err) {
        console.log(err.stack);
        resolve(false);
      } else {
        console.log(res.rows);
        if (res.rows.length === 0) resolve(false);
        else resolve(true);
      }
    });
  });
}
