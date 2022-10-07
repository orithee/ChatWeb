import style from './Chat.module.scss';
import { useSelector } from 'react-redux';
import { chatState, globalState } from '../../redux/store';
import { useContext, useEffect, useRef, useState } from 'react';
import { WsConnection } from '../../App';
import ListGroup from 'react-bootstrap/esm/ListGroup';
import { toStr, convertTime } from '../../helpers/auxiliaryFunc';
import { GroupMessage } from '../../helpers/types';
import Emoji from '../Emoji/Emoji';
import Gif from '../Gif/Gif';

// A component that contains the group messages and the option to send emojis:
function Chat() {
  const connection = useContext<WebSocket>(WsConnection);
  const messages = useSelector((state: chatState) => state.chat.groupMessages);
  const group = useSelector((state: chatState) => state.chat.currentGroup);
  const user = useSelector((state: globalState) => state.global.user);

  const [inputMsg, setInputMsg] = useState<string>('');
  const [emojiOpen, setEmojiOpen] = useState<boolean>(false);
  const [gifOpen, setGifOpen] = useState<boolean>(false);
  const mainContainer = useRef<HTMLDivElement>(null);

  const submitForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    sendMessage(false);
  };

  const sendMessage = (img: boolean, url: string = inputMsg) => {
    if (url === inputMsg && inputMsg === '') return;
    if (user && group) {
      connection.send(
        toStr({
          type: 'groupMessage',
          userId: user.user_id,
          userName: user.user_name,
          groupId: group.group_id,
          text: url,
          isImage: img,
        })
      );
      setEmojiOpen(false);
      setInputMsg('');
    }
  };

  useEffect(() => {
    if (mainContainer.current) {
      const scrolling = mainContainer.current;
      setTimeout(() => {
        scrolling.scrollTop = scrolling.scrollHeight;
      }, 300);
      setTimeout(() => {
        scrolling.scrollTop = scrolling.scrollHeight;
      }, 900);
    }
  }, [messages]);

  useEffect(() => {
    if (emojiOpen) setGifOpen(false);
  }, [emojiOpen]);

  useEffect(() => {
    if (gifOpen) setEmojiOpen(false);
  }, [gifOpen]);

  const textDirection = (message: GroupMessage): React.CSSProperties => {
    const condition = message.sent_by_name === user?.user_name;
    return { textAlign: condition ? 'start' : 'end' };
  };

  const msgDirection = (message: GroupMessage): React.CSSProperties => {
    const condition = message.sent_by_name === user?.user_name;
    return {
      justifyContent: condition ? 'flex-start' : 'flex-end',
    };
  };

  const msgColor = (message: GroupMessage): React.CSSProperties => {
    const condition = message.sent_by_name === user?.user_name;
    return {
      backgroundColor: condition ? '#202c33' : '#005c4b',
    };
  };

  return (
    <div className={style.container}>
      <div className={style.up}>
        <div className={style.up_left}>
          {/* // TODO: Add profile img option */}
          <p>{group?.group_name}</p>
          {gifOpen && <Gif sendMessage={sendMessage} setGifOpen={setGifOpen} />}
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
                <div className={style.message} style={msgColor(message)}>
                  <div className={style.sent_by} style={textDirection(message)}>
                    {message.sent_by_name}
                  </div>
                  <div className={style.text} style={textDirection(message)}>
                    {!message.is_image && message.message_text}
                    {message.is_image && (
                      <span>
                        <img src={message.message_text} alt="img" />
                      </span>
                    )}
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
                    {convertTime(message.created_at)}
                  </div>
                </div>
              </ListGroup.Item>
            );
          })}
      </div>
      <div className={style.bottom}>
        <span
          className={style.emoji_button}
          onClick={() => setEmojiOpen(!emojiOpen)}
          style={{
            border: emojiOpen ? 'dotted 1px greenyellow' : 'none',
            borderRadius: emojiOpen ? '25%' : 'none',
          }}
        >
          😀
        </span>
        <span
          className={style.gif_button}
          onClick={() => setGifOpen(!gifOpen)}
          style={{
            border: gifOpen ? 'dotted 1px greenyellow' : 'none',
            borderRadius: gifOpen ? '25%' : 'none',
          }}
        >
          gif
        </span>
        <div
          className={style.emoji_container}
          style={{
            display: emojiOpen ? 'block' : 'none',
          }}
        >
          <Emoji
            setEmojiOpen={setEmojiOpen}
            updateInput={setInputMsg}
            currentInput={inputMsg}
          />
        </div>
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
