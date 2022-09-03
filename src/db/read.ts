import sha1 from 'sha1';
import {
  GroupMessage,
  Initial,
  Login,
  LoginToClient,
  NewGroup,
  Register,
  UserGroups,
} from '../server/types';
import { postgres } from './buildDB';

export async function checkLogin(user: Login) {
  // Checking the trying to log in to the website:
  const sql = `SELECT * FROM users WHERE user_name=$1 AND password=$2;`;
  const values = [user.userName, sha1(user.password + user.userName)];
  return new Promise<boolean | LoginToClient>((resolve, _reject) => {
    postgres.query(sql, values, (err, res) => {
      if (err) {
        console.log(err.stack);
        resolve(false);
      } else {
        console.log(res.rows);
        if (res.rows.length === 1)
          resolve({
            type: 'login',
            userData: res.rows[0],
          });
        else resolve(true);
      }
    });
  });
}

export async function checkUsername(user: Register) {
  // Checks if the username is already in use in the database:
  const sql = `SELECT * FROM users WHERE user_name=$1;`;
  const values = [user.userName];
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

export async function checkToken(initialMsg: Initial) {
  // Checking if there is a username that matches the token from the client :
  const sql = `SELECT * FROM users WHERE password=$1;`;
  const values = [initialMsg.token];
  return new Promise<boolean | LoginToClient>((resolve, _reject) => {
    postgres.query(sql, values, (err, res) => {
      if (err) {
        console.log(err.stack);
        resolve(false);
      } else {
        console.log(res.rows[0] || { user_name: undefined });
        if (res.rows.length === 1)
          resolve({
            type: 'login',
            userData: res.rows[0],
          });
        else resolve(false);
      }
    });
  });
}

export async function checkGroupName(newGroup: NewGroup): Promise<boolean> {
  // Checks if the group name is already in use in the database:
  const sql = `SELECT * FROM groups WHERE group_name=$1;`;
  const values = [newGroup.groupName];
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

export async function checkMembers(members: string[]) {
  // Checks if the members exists in the database:
  const sql = `SELECT user_name FROM users;`;
  return new Promise<string[]>((resolve, _reject) => {
    postgres.query(sql, (err, res) => {
      if (err) {
        console.log(err.stack);
        // TODO: Find a good solution for that resolve case:
        resolve(['error']);
      } else {
        const rows = res.rows.map((row) => row.user_name);
        const membersNotExists = members.filter((member) => {
          if (!rows.includes(member)) return member;
        });

        console.log('membersNotExists', membersNotExists);
        if (membersNotExists.length != 0) resolve(membersNotExists);
        else resolve([]);
      }
    });
  });
}

export async function getGroupList(userId: number) {
  // Checks if the members exists in the database:
  const sql = `SELECT * FROM user_groups WHERE user_id=$1;`;
  const values = [userId];
  return new Promise<UserGroups[] | []>((resolve, _reject) => {
    postgres.query(sql, values, (err, res) => {
      if (err) {
        console.log(err.stack);
        // TODO: Reject the error
        // TODO: Explain that resolve....
        resolve([]);
      } else {
        // const rows = res.rows.map((row) => row.group_name);
        // console.log('rows', rows);
        resolve(res.rows);
      }
    });
  });
}

export async function getMessages(groupName: string) {
  // Get group messages by group name:
  const sql = `SELECT * FROM group_messages WHERE group_name=$1 ORDER BY created_at ASC, created_on ASC;`;
  const values = [groupName];
  return new Promise<GroupMessage[] | []>((resolve, _reject) => {
    postgres.query(sql, values, (err, res) => {
      if (err) {
        console.log(err.stack);
        resolve([]);
      } else {
        console.log('res.rows', res.rows);
        resolve(res.rows);
      }
    });
  });
}
