import sha1 from 'sha1';
import { Initial, Login, Register } from '../server/types';
import { postgres } from './buildDB';

export async function checkLogin(user: Login): Promise<boolean> {
  // Check if the user exists:
  const sql = `SELECT * FROM users WHERE user_name=$1 AND password=$2;`;
  const values = [user.username, sha1(user.password + user.username)];
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

export async function checkRegister(user: Register): Promise<boolean> {
  // Checks if the username is already in use in the database:
  const sql = `SELECT * FROM users WHERE user_name=$1;`;
  const values = [user.username];
  return new Promise<boolean>((resolve, _reject) => {
    postgres.query(sql, values, (err, res) => {
      if (err) {
        console.log(err.stack);
        resolve(false);
      } else {
        console.log(res.rows.length);
        if (res.rows.length === 0) resolve(true);
        else resolve(false);
      }
    });
  });
}

export async function checkToken(
  initialMsg: Initial
): Promise<boolean | Object> {
  // Checks if the username is already in use in the database:
  const sql = `SELECT user_name FROM users WHERE password=$1;`;
  const values = [initialMsg.token];
  return new Promise<boolean | Object>((resolve, _reject) => {
    postgres.query(sql, values, (err, res) => {
      if (err) {
        console.log(err.stack);
        resolve(false);
      } else {
        console.log(res.rows);
        if (res.rows.length === 1)
          resolve({
            type: 'login',
            username: res.rows[0].user_name,
            token: initialMsg.token,
          });
        else resolve(false);
      }
    });
  });
}
