import { NewGroup, Register } from 'src/server/types';
import { postgres } from './buildDB';
import sha1 from 'sha1';

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
    console.log('Finish createGroup: ', group.groupName);
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}
