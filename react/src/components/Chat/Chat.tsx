import style from './Chat.module.scss';
import { useSelector } from 'react-redux';
import { chatState, globalState } from '../../redux/store';
import { useContext, useEffect, useRef, useState } from 'react';
import { WsConnection } from '../../App';
import ListGroup from 'react-bootstrap/esm/ListGroup';
import { toStr } from '../../helpers/auxiliaryFunc';
import { GroupMessage } from '../../helpers/types';
import Emoji from '../Emoji/Emoji';
import Gif from '../Gif/Gif';

// TODO: 1. V Open a new branch.
// TODO: 2. V Try to send gif in image. create a container.
// TODO: 3. Create a component that create the container + URL.
// TODO: 4. Check the limit of requests...
// TODO: 5. Create a ui form to choose the gif.
// TODO: 6. Think about how to save the URL(the key, the search term...).
// TODO: 7. Checking all bugs.

// A component that contains the group messages and the option to send emojis:
function Chat() {
  const connection = useContext<WebSocket>(WsConnection);
  const messages = useSelector((state: chatState) => state.chat.groupMessages);
  const group = useSelector((state: chatState) => state.chat.currentGroup);
  const user = useSelector((state: globalState) => state.global.user);

  const [inputMsg, setInputMsg] = useState<string>('');
  const [emojiOpen, setEmojiOpen] = useState<boolean>(false);
  const [gifOpen, setGifOpen] = useState<boolean>(false);
  const mainContainer = useRef<null | HTMLDivElement>(null);

  const submitForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    sendMessage(false);
  };

  const sendMessage = (img: boolean, url: string = inputMsg) => {
    if (url === inputMsg && inputMsg === '') return;
    console.log('sendMessage');
    console.log(url);
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

  const convertTime = (str: string) => {
    // Displaying the current time to the user:
    let hour = Number(str.slice(0, 2)) + 3;
    if (hour > 24) return '0' + (hour -= 24) + str.slice(2, 5);
    if (10 > hour) return '0' + hour + str.slice(2, 5);
    else return hour + str.slice(2, 5);
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
          <Emoji updateInput={setInputMsg} currentInput={inputMsg} />
        </div>
        {/* <div className={style.gif_container}> */}
        {/* </div> */}
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
