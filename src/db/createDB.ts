import { Client } from 'pg';
import dotenv from 'dotenv';
import { join } from 'path';
dotenv.config({ path: join(__dirname, '../../.env') });

export const postgres = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

export async function postgresConnect() {
  try {
    await postgres.connect();
    console.log('Postgres connected successfully!');
  } catch (error) {
    console.log(error);
  }
}

export async function createTables() {
  // Create the tables if their not exists:
  try {
    await postgres.query(
      `CREATE TABLE IF NOT EXISTS users(
              user_id SERIAL PRIMARY KEY,
              username TEXT NOT NULL,
              password TEXT NOT NULL,
              email TEXT NOT NULL
              );`
    );

    await postgres.query(
      `CREATE TABLE IF NOT EXISTS groups(
              group_id SERIAL PRIMARY KEY,
              group_name TEXT NOT NULL,
              user_admin_id INTEGER,
              CONSTRAINT fk_user_admin_id FOREIGN KEY(user_admin_id)
              REFERENCES users(user_id)
              );`
    );

    await postgres.query(
      `CREATE TABLE IF NOT EXISTS group_messages(
              message_id SERIAL PRIMARY KEY,
              message_text TEXT NOT NULL,
              created_at TIME DEFAULT CURRENT_TIME,
              created_on DATE DEFAULT CURRENT_DATE,
              user_id INTEGER,
              group_id INTEGER,
              CONSTRAINT fk_user_id FOREIGN KEY(user_id)
              REFERENCES users(user_id),
              CONSTRAINT fk_group_id FOREIGN KEY(group_id)
              REFERENCES groups(group_id)
              );`
    );
  } catch (error) {
    console.log(error);
  } finally {
    console.log('Finish createTables');
  }
}
