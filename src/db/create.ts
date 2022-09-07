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

// Create a new user - if the query succeeds, it will return the user.
export async function createUser(user: Register) {
  const insert = `INSERT INTO users (user_name, password, email, nickname) VALUES ($1, $2, $3, $4) RETURNING *;`;
  const password = sha1(user.password + user.userName);
  const values = [user.userName, password, user.email, user.userName];

  return new Promise<undefined | LoginToClient>((resolve, _reject) => {
    postgres.query(insert, values, (err, res) => {
      if (err) {
        console.log(err.stack);
        resolve(undefined);
      } else {
        if (res.rows.length === 1) {
          resolve({
            type: 'loginFromServer',
            userData: res.rows[0],
          });
          console.log('Finish createUser: ', res.rows[0]);
        } else resolve(undefined);
      }
    });
  });
}

// Create a new group -if the query succeeds, it will return the group.
export async function createGroup(group: CreateNewGroup) {
  const insert = `INSERT INTO groups (admin_id, group_name) VALUES ($1, $2) RETURNING *;`;
  const values = [group.userId, group.groupName];

  const NewGroup = await new Promise<undefined | Group>((resolve, _reject) => {
    postgres.query(insert, values, (err, res) => {
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

  // Insert the group members:
  if (!NewGroup || !(await insertMembers(group, NewGroup))) return undefined;
  else {
    console.log('Finish createGroup: ', group.groupName);
    return NewGroup;
  }
}

// Create a new group message - if the query succeeds, it will return the new group message.
export async function insertGroupMessage(message: MessageSent) {
  const insert = `INSERT INTO group_messages (message_text, sent_by_id, sent_by_name, group_id,
    is_image) VALUES ($1, $2, $3, $4, $5) RETURNING *;`;
  const values = [
    message.text,
    message.userId,
    message.userName,
    message.groupId,
    message.isImage,
  ];
  return new Promise<GroupMessage | undefined>((resolve, _reject) => {
    postgres.query(insert, values, (err, res) => {
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

// Create a new group members - if the query succeeds, it will return true.
async function insertMembers(group: CreateNewGroup, newGroup: Group) {
  try {
    let insert = `INSERT INTO user_groups (user_name, group_id, group_name) VALUES `;
    let values = `('${group.userName}','${newGroup.group_id}','${newGroup.group_name}'),`;
    for (let i = 0; i < group.members.length; i++) {
      values += `('${group.members[i]}','${newGroup.group_id}','${newGroup.group_name}'),`;
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
