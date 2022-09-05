import style from './Chat.module.scss';
import { useSelector } from 'react-redux';
import { chatState, globalState } from '../../redux/store';
import { useContext, useEffect, useRef, useState } from 'react';
import { WsConnection } from '../../App';
import ListGroup from 'react-bootstrap/esm/ListGroup';
import { toStr } from '../../helpers/auxiliaryFunc';
import { GroupMessage } from '../../helpers/types';

function Chat() {
  const connection = useContext<WebSocket>(WsConnection);
  const messages = useSelector((state: chatState) => state.chat.groupMessages);
  const group = useSelector((state: chatState) => state.chat.currentGroup);
  const user = useSelector((state: globalState) => state.global.user);

  const [inputMsg, setInputMsg] = useState<string>('');
  const mainContainer = useRef<null | HTMLDivElement>(null);

  const submitForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (inputMsg && user && group) {
      connection.send(
        toStr({
          type: 'groupMessage',
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

  const textDirection = (message: GroupMessage): React.CSSProperties => {
    const condition = message.sent_by_name === user?.user_name;
    return { textAlign: condition ? 'start' : 'end' };
  };

  const msgDirection = (message: GroupMessage): React.CSSProperties => {
    const condition = message.sent_by_name === user?.user_name;
    return { justifyContent: condition ? 'flex-start' : 'flex-end' };
  };
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
              <ListGroup.Item
                className={style.item}
                style={msgDirection(message)}
                key={index}
              >
                <div className={style.message}>
                  <div className={style.sent_by} style={textDirection(message)}>
                    {message.sent_by_name}
                  </div>
                  <div className={style.text} style={textDirection(message)}>
                    {message.message_text}
                  </div>
                  <div
                    className={style.hour}
                    style={{
                      textAlign:
                        message.sent_by_name === user?.user_name
                          ? 'end'
                          : 'start',
                    }}
                  >
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
    </div>
  );
}

export default Chat;