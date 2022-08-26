import { Login } from '../server/types';
import { postgres } from './createDB';

export async function checkLogin(user: Login) {
  // Check if the user exists:
  const sql = `SELECT * FROM users WHERE user_name=$1;`;
  const values = [user.username];
  postgres.query(sql, values, (err, res) => {
    if (err) {
      console.log(err.stack);
    } else {
      console.log(res.rows);
    }
  });
}
