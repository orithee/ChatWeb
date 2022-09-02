import style from './Chat.module.scss';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { chatState } from '../../redux/store';
import { useContext, useState } from 'react';
import { WsConnection } from '../../App';
import ListGroup from 'react-bootstrap/esm/ListGroup';
import { toStr } from '../../assets/auxiliaryFunc';

function Chat() {
  const connection = useContext<WebSocket>(WsConnection);
  const messages = useSelector((state: chatState) => state.chat.groupMessages);
  let groupIdParam = useParams().groupId;
  const [inputMsg, setInputMsg] = useState<string>('');

  const submitForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!inputMsg) return;
    console.log(inputMsg);
    connection.send(
      toStr({
        type: 'chatMessage',
        group: groupIdParam,
        message: inputMsg,
      })
    );
    setInputMsg('');
  };

  return (
    <div className={style.container}>
      <div className={style.up}>
        <div className={style.up_left}>
          {/* TODO: Add profile img option */}
          <p>{groupIdParam}</p>
        </div>
      </div>
      <div className={style.main}>
        {messages &&
          messages.length != 0 &&
          messages.map((message, index) => {
            return (
              <ListGroup.Item className={style.message1} key={index}>
                <div className={style.message}>
                  <div className={style.sent_by}>{message.sent_by}</div>
                  <div className={style.text}>{message.message_text}</div>
                  <div className={style.hour}>{message.created_at}</div>
                </div>
              </ListGroup.Item>
            );
          })}
      </div>
      <div className={style.bottom}>
        <form onSubmit={(e) => submitForm(e)}>
          <input
            type="text"
            onChange={(e) => setInputMsg(e.target.value)}
            value={inputMsg}
            placeholder="Type a message"
          />
        </form>
      </div>

      {/* TODO:
          1. Option to send message - insert to group_messages table.
          2. Implement it by send the message to all clients that connected.
          3. UseEffect  - every message: insert into database, sent from server to all, 
             update the group_messages if this group is open.
          4. If this group does not opening now - add green indication about the message on the group list.
          5.
      */}
    </div>
  );
}

export default Chat;
