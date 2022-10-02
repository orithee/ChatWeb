import bcrypt from 'bcrypt';
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

// Checks the trying to log into the website:
export async function checkLogin(user: Login) {
  const sql = `SELECT * FROM users WHERE user_name=$1;`;
  const values = [user.userName];

  return new Promise<undefined | LoginToClient>((resolve, _reject) => {
    postgres.query(sql, values, async (err, res) => {
      if (err) {
        console.log(err.stack);
        resolve(undefined);
      } else {
        if (res.rows.length === 1) {
          const hashFromDatabase = res.rows[0].password;
          const passFromLogin = user.password + user.userName;
          const result = await bcrypt.compare(passFromLogin, hashFromDatabase);
          if (result) {
            resolve({ type: 'loginFromServer', userData: res.rows[0] });
          } else resolve(undefined);
        } else resolve(undefined);
      }
    });
  });
}

// Checks if the username is already in use in the database:
export async function checkUsername(user: Register) {
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

// Checks if there is a username that matches the token from the client :
export async function checkToken(initialMsg: Initial) {
  const sql = `SELECT * FROM users WHERE password=$1;`;
  const values = [initialMsg.token];

  return new Promise<undefined | LoginToClient>((resolve, _reject) => {
    postgres.query(sql, values, async (err, res) => {
      if (err) {
        console.log(err.stack);
        resolve(undefined);
      } else {
        if (res.rows.length === 1) {
          resolve({ type: 'loginFromServer', userData: res.rows[0] });
        } else resolve(undefined);
      }
    });
  });
}

// Checks if the group name is already in use in the database:
export async function checkGroupName(newGroup: CreateNewGroup) {
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

// Checks if the members exists in the database:
export async function checkMembers(members: string[]) {
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

// Pulling a list of groups from the database by username:
export async function getListOfGroups(userName: string) {
  const sql = `SELECT * FROM groups LEFT OUTER JOIN user_groups 
  ON groups.group_id=user_groups.group_id WHERE user_groups.user_name=$1;`;
  const values = [userName];

  return new Promise<Group[] | []>((resolve, _reject) => {
    postgres.query(sql, values, async (err, res) => {
      if (err) {
        console.log(err.stack);
        resolve([]);
      } else {
        resolve(await groupsWithLastMessages(res.rows));
      }
    });
  });
}

async function groupsWithLastMessages(groups: Group[]) {
  return await Promise.all(
    groups.map(async (group) => {
      group.lastMessage = await getLastMessage(group.group_id);
      return group;
    })
  );
}

async function getLastMessage(groupId: number) {
  const sql = `SELECT * FROM group_messages WHERE group_id=$1 ORDER BY created_on DESC, created_at DESC LIMIT 1;`;
  const values = [groupId];

  return new Promise<GroupMessage | undefined>((resolve, _reject) => {
    postgres.query(sql, values, (err, res) => {
      if (err) {
        console.log(err.stack);
        resolve(undefined);
      } else {
        resolve(res.rows[0]);
      }
    });
  });
}

// Pulling group messages from the database by group id:
export async function getMessages(groupId: number) {
  const sql = `SELECT * FROM group_messages WHERE group_id=$1 ORDER BY created_on ASC, created_at ASC;`;
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
