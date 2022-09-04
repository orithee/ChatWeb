import sha1 from 'sha1';
import {
  GroupMessage,
  Initial,
  Login,
  LoginToClient,
  CreateNewGroup,
  Register,
  Group,
} from '../server/types';
import { postgres } from './buildDB';

export async function checkLogin(user: Login) {
  // Checking the trying to log into the website:
  const sql = `SELECT * FROM users WHERE user_name=$1 AND password=$2;`;
  const values = [user.userName, sha1(user.password + user.userName)];

  return new Promise<undefined | LoginToClient>((resolve, _reject) => {
    postgres.query(sql, values, (err, res) => {
      if (err) {
        console.log(err.stack);
        resolve(undefined);
      } else {
        if (res.rows.length === 1) {
          resolve({ type: 'login', userData: res.rows[0] });
        } else resolve(undefined);
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

  return new Promise<undefined | LoginToClient>((resolve, _reject) => {
    postgres.query(sql, values, (err, res) => {
      if (err) {
        console.log(err.stack);
        resolve(undefined);
      } else {
        console.log(res.rows[0].user_name || { user_name: undefined });
        if (res.rows.length === 1) {
          resolve({ type: 'login', userData: res.rows[0] });
        } else resolve(undefined);
      }
    });
  });
}

export async function checkGroupName(newGroup: CreateNewGroup) {
  // Checks if the group name is already in use in the database:
  const sql = `SELECT * FROM groups WHERE group_name=$1;`;
  const values = [newGroup.groupName];

  return new Promise<boolean>((resolve, _reject) => {
    postgres.query(sql, values, (err, res) => {
      if (err) {
        console.log(err.stack);
        resolve(false);
      } else {
        if (res.rows.length === 0) resolve(true);
        else resolve(false);
      }
    });
  });
}

export async function checkMembers(members: string[]) {
  // Checks if the members exists in the database:
  const sql = `SELECT user_name FROM users;`;
  return new Promise<string[] | string>((resolve, _reject) => {
    postgres.query(sql, (err, res) => {
      if (err) {
        console.log(err.stack);
        resolve('check members failed');
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

export async function getListOfGroups(userName: string) {
  // Pulling a list of groups from the database by username:
  const sql = `SELECT * FROM groups LEFT OUTER JOIN user_groups 
  ON groups.group_id=user_groups.group_id WHERE user_groups.user_name=$1;`;
  const values = [userName];

  return new Promise<Group[] | []>((resolve, _reject) => {
    postgres.query(sql, values, (err, res) => {
      if (err) {
        console.log(err.stack);
        resolve([]);
      } else resolve(res.rows);
    });
  });
}

export async function getMessages(groupId: number) {
  // Get group messages by group id:
  const sql = `SELECT * FROM group_messages WHERE group_id=$1 ORDER BY created_at ASC, created_on ASC;`;
  const values = [groupId];

  return new Promise<GroupMessage[] | []>((resolve, _reject) => {
    postgres.query(sql, values, (err, res) => {
      if (err) {
        console.log(err.stack);
        resolve([]);
      } else resolve(res.rows);
    });
  });
}
