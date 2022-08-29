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
    // Users:
    await postgres.query(
      `CREATE TABLE IF NOT EXISTS users(
              user_id SERIAL,
              user_name TEXT NOT NULL PRIMARY KEY,
              password TEXT NOT NULL,
              email TEXT NOT NULL
              );`
    );

    // Groups:
    await postgres.query(
      `CREATE TABLE IF NOT EXISTS groups(
              group_id SERIAL,
              group_name TEXT NOT NULL PRIMARY KEY,
              admin_name TEXT,
              CONSTRAINT fk_admin_name FOREIGN KEY(admin_name)
              REFERENCES users(user_name)
              );`
    );

    // Groups that the user is in:
    await postgres.query(
      `CREATE TABLE IF NOT EXISTS user_groups(
              user_name TEXT,
              group_name TEXT,
              CONSTRAINT fk_user_name FOREIGN KEY(user_name)
              REFERENCES users(user_name),
              CONSTRAINT fk_group_name FOREIGN KEY(group_name)
              REFERENCES groups(group_name)
              );`
    );

    // All messages:
    await postgres.query(
      `CREATE TABLE IF NOT EXISTS group_messages(
              message_id SERIAL PRIMARY KEY,
              message_text TEXT NOT NULL,
              created_at TIME DEFAULT CURRENT_TIME,
              created_on DATE DEFAULT CURRENT_DATE,
              sent_by TEXT,
              group_name TEXT,
              CONSTRAINT fk_sent_by  FOREIGN KEY(sent_by )
              REFERENCES users(user_name),
              CONSTRAINT fk_group_name FOREIGN KEY(group_name)
              REFERENCES groups(group_name)
              );`
    );
  } catch (error) {
    console.log(error);
  } finally {
    console.log('Finish createTables');
  }
}
