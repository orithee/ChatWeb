import {
  GroupMessage,
  MessageSent,
  NewGroup,
  Register,
} from 'src/server/types';
import { postgres } from './buildDB';
import sha1 from 'sha1';
// TODO: String validation !!
// TODO: Prevent errors in 'create group' and 'groupMembers' functions...

export async function createUser(user: Register): Promise<boolean> {
  // Create a new user:
  try {
    const insertNewUser =
      'INSERT INTO users (user_name, password, email) VALUES ($1, $2, $3);';
    const values = [
      user.username,
      sha1(user.password + user.username),
      user.email,
    ];
    await postgres.query(insertNewUser, values);
    console.log('Finish createUser: ', user.username);
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function createGroup(group: NewGroup): Promise<boolean> {
  // Create a new group:
  try {
    const insertNewGroup =
      'INSERT INTO groups (group_name, admin_name) VALUES ($1, $2);';
    const values = [group.groupName, group.userName];
    await postgres.query(insertNewGroup, values);
    if (!(await groupMembers(group))) return false;
    console.log('Finish createGroup: ', group.groupName);
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function groupMembers(group: NewGroup): Promise<boolean> {
  // Create a new group:
  try {
    let insert = 'INSERT INTO user_groups (user_name, group_name) VALUES ';
    let values = `('${group.userName}','${group.groupName}'),`;
    for (let i = 0; i < group.members.length; i++) {
      values += `('${group.members[i]}','${group.groupName}'),`;
    }
    insert = insert + values.slice(0, -1) + ';';
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
    'INSERT INTO group_messages (message_text, sent_by, group_name) VALUES ($1, $2, $3) RETURNING *;';
  const values = [message.text, message.username, message.group];
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
