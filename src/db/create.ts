import {
  GroupMessage,
  LoginToClient,
  MessageSent,
  CreateNewGroup,
  Register,
  Group,
} from 'src/server/types';
import { postgres } from './buildDB';
import sha1 from 'sha1';
// TODO: String validation !!
// TODO: Prevent errors in 'create group' and 'groupMembers' functions...

export async function createUser(user: Register) {
  // Create a new user:
  console.log('createUser', user);
  const insertNewUser =
    'INSERT INTO users (user_name, password, email, nickname) VALUES ($1, $2, $3, $4) RETURNING *;';
  const password = sha1(user.password + user.userName);
  const values = [user.userName, password, user.email, user.userName];

  return new Promise<boolean | LoginToClient>((resolve, _reject) => {
    postgres.query(insertNewUser, values, (err, res) => {
      if (err) {
        console.log(err.stack);
        resolve(false);
      } else {
        console.log(res.rows);
        if (res.rows.length === 1) {
          resolve({
            type: 'login',
            userData: res.rows[0],
          });
          console.log('Finish createUser: ', user.userName);
        } else resolve(true);
      }
    });
  });

  // try {
  //   const insertNewUser =
  //     'INSERT INTO users (user_name, password, email) VALUES ($1, $2, $3);';
  //   const values = [
  //     user.userName,
  //     sha1(user.password + user.userName),
  //     user.email,
  //   ];
  //   await postgres.query(insertNewUser, values);
  //   console.log('Finish createUser: ', user.userName);
  //   return true;
  // } catch (error) {
  //   console.log(error);
  //   return false;
  // }
}

export async function createGroup(group: CreateNewGroup) {
  // Create a new group:
  const sql =
    'INSERT INTO groups (admin_id, group_name) VALUES ($1, $2) RETURNING *;';
  const values = [group.userId, group.groupName];
  const NewGroup = await new Promise<undefined | Group>((resolve, _reject) => {
    postgres.query(sql, values, (err, res) => {
      if (err) {
        console.log(err.stack);
        resolve(undefined);
      } else {
        console.log(res.rows);
        if (res.rows.length === 1) resolve(res.rows[0]);
        else resolve(undefined);
      }
    });
  });

  if (NewGroup && !(await groupMembers(group, NewGroup))) return undefined;
  else {
    console.log('Finish createGroup: ', group.groupName);
    return NewGroup;
  }
}

export async function groupMembers(group: CreateNewGroup, newGroup: Group) {
  // Create a new uses_groups:

  // Get the is'd and insert here...
  console.log('groupMembers function');
  try {
    let insert =
      'INSERT INTO user_groups (user_name, group_id, group_name) VALUES ';
    let values = `('${group.userName}','${newGroup.group_id}','${newGroup.group_name}'),`;
    for (let i = 0; i < group.members.length; i++) {
      values += `('${group.members[i]}','${newGroup.group_id}','${newGroup.group_name}'),`;
      // values += `(${group.members[i]},'${NewGroup.group_id}'),`; ??????
    }
    insert = insert + values.slice(0, -1) + ';';
    console.log(insert);
    await postgres.query(insert);
    console.log('Finish groupMembers: ', [group.userName], group.members);
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function insertMessage(message: MessageSent) {
  // Insert a new message into the data base:
  const sql =
    'INSERT INTO group_messages (message_text, sent_by_id, sent_by_name, group_id) VALUES ($1, $2, $3, $4) RETURNING *;';
  const values = [
    message.text,
    message.userId,
    message.userName,
    message.groupId,
  ];
  return new Promise<GroupMessage | undefined>((resolve, _reject) => {
    postgres.query(sql, values, (err, res) => {
      if (err) {
        console.log(err.stack);
        resolve(undefined);
      } else {
        console.log('res.rows', res.rows);
        resolve(res.rows[0]);
      }
    });
  });
}
