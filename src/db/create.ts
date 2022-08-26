import { Register } from 'src/server/types';
import { postgres } from './createDB';

export async function createNewUser(user: Register) {
  // Create a new user.
  try {
    const insertNewUser =
      'INSERT INTO users (user_name, password, email) VALUES ($1, $2, $3);';
    const values = [user.username, user.password, user.email];
    await postgres.query(insertNewUser, values);
    console.log('Finish createNewUser: ', user.username);
  } catch (error) {
    console.log(error);
  }
}
