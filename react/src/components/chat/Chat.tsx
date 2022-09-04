import style from './Chat.module.scss';
import { useSelector } from 'react-redux';
import { chatState, globalState } from '../../redux/store';
import { useContext, useEffect, useRef, useState } from 'react';
import { WsConnection } from '../../App';
import ListGroup from 'react-bootstrap/esm/ListGroup';
import { toStr } from '../../assets/auxiliaryFunc';
import { useParams } from 'react-router-dom';

function Chat() {
  const connection = useContext<WebSocket>(WsConnection);
  const messages = useSelector((state: chatState) => state.chat.groupMessages);
  const group = useSelector((state: chatState) => state.chat.currentGroup);
  const user = useSelector((state: globalState) => state.global.user);

  const [inputMsg, setInputMsg] = useState<string>('');
  const mainContainer = useRef<null | HTMLDivElement>(null);

  const submitForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!inputMsg) return;
    if (user && group) {
      console.log(group.group_id);
      connection.send(
        toStr({
          type: 'chatMessage',
          userId: user.user_id,
          userName: user.user_name,
          groupId: group.group_id,
          text: inputMsg,
        })
      );
      setInputMsg('');
    }
  };

  useEffect(() => {
    if (mainContainer.current) {
      const scrolling = mainContainer.current;
      scrolling.scrollTop = scrolling.scrollHeight;
    }
  }, [messages]);

  // useEffect(() => {
  //   if (useParams().groupId !== group?.group_id) {
  //   }
  // }, [group]);

  return (
    <div className={style.container}>
      <div className={style.up}>
        <div className={style.up_left}>
          {/* TODO: Add profile img option */}
          <p>{group?.group_name}</p>
        </div>
      </div>
      <div ref={mainContainer} className={style.main}>
        {messages &&
          messages.length !== 0 &&
          messages.map((message, index) => {
            return (
              <ListGroup.Item className={style.item} key={index}>
                <div className={style.message}>
                  <div className={style.sent_by}>{message.sent_by_name}</div>
                  <div className={style.text}>{message.message_text}</div>
                  <div className={style.hour}>
                    {message.created_at.slice(0, 5)}
                  </div>
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
