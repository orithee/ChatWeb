import { postgres } from './buildDB';

// Update the last message id in the group:
export function updateLastMessage(messageId: number, groupId: number) {
  const update = `UPDATE groups SET last_message=$1 WHERE group_id=$2;`;
  const values = [messageId, groupId];

  return new Promise<boolean>((resolve, _reject) => {
    postgres.query(update, values, (err, res) => {
      if (err) {
        console.log(err.stack);
        resolve(false);
      } else {
        resolve(true);
      }
    });
  });
}

// Update the number of unread messages in the group:
export function updateNotReadByOne(groupId: number) {
  const update = `UPDATE user_groups SET not_read=not_read+1 WHERE group_id=$1`;
  const values = [groupId];

  return new Promise<boolean>((resolve, _reject) => {
    postgres.query(update, values, (err, res) => {
      if (err) {
        console.log(err.stack);
        resolve(false);
      } else {
        resolve(true);
      }
    });
  });
}

// Reset the number of unread messages of specific user:
export function resetNotRead(userName: string, groupId: number) {
  const update = `UPDATE user_groups SET not_read=0 WHERE user_name=$1 AND group_id=$2;`;
  const values = [userName, groupId];

  return new Promise<boolean>((resolve, _reject) => {
    postgres.query(update, values, (err, res) => {
      if (err) {
        console.log(err.stack);
        resolve(false);
      } else {
        resolve(true);
      }
    });
  });
}

// Reset 'was_read' row of specific group last message to true:
export function updateLastMessageOnDb(lastMsgId: number) {
  const update = `UPDATE group_messages SET was_read=true WHERE message_id=$1;`;
  const values = [lastMsgId];

  return new Promise<boolean>((resolve, _reject) => {
    postgres.query(update, values, (err, res) => {
      if (err) {
        console.log(err.stack);
        resolve(false);
      } else {
        resolve(true);
      }
    });
  });
}
