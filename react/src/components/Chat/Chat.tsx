import style from './Chat.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { chatState, globalState } from '../../redux/store';
import { useContext, useEffect, useRef, useState } from 'react';
import { WsConnection } from '../../App';
import { toStr } from '../../helpers/auxiliaryFunc';
import { GroupMessage } from '../../helpers/types';
import Emoji from '../Emoji/Emoji';
import Gif from '../Gif/Gif';
import GroupMembers from '../GroupMembers/GroupMembers';
import MicIcon from '@mui/icons-material/Mic';
import { useOutletContext } from 'react-router-dom';
import DehazeIcon from '@mui/icons-material/Dehaze';
import MessageCard from '../MessageCard/MessageCard';

// A component that contains the group messages and the option to send emojis:
function Chat() {
  const connection = useContext<WebSocket>(WsConnection);
  const setBarOpen = useOutletContext<Function>();

  const messages = useSelector((state: chatState) => state.chat.groupMessages);
  const members = useSelector((state: chatState) => state.chat.groupMembers);
  const group = useSelector((state: chatState) => state.chat.currentGroup);
  const user = useSelector((state: globalState) => state.global.user);

  const dispatch = useDispatch();

  const [inputMsg, setInputMsg] = useState<string>('');
  const [maxNotRead, setMaxNotRead] = useState<number>(0);
  const [emojiOpen, setEmojiOpen] = useState<boolean>(false);
  const [gifOpen, setGifOpen] = useState<boolean>(false);
  const mainContainer = useRef<HTMLDivElement>(null);

  const submitForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    sendMessage(false);
  };

  const sendWasRead = () => {
    connection.send(
      toStr({
        type: 'wasReadMsg',
        userName: user?.user_name,
        groupId: group?.group_id,
        lastMsgId: group?.last_message,
      })
    );
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
    if (group) {
      sendWasRead();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages]);

  useEffect(() => {
    const calculateMaxNotRead = () => {
      if (members) {
        let max = members[0].not_read;
        for (const member of members) {
          if (member.not_read > max) max = member.not_read;
        }
        setMaxNotRead(max);
      }
    };
    calculateMaxNotRead();
  }, [members]);

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
      backgroundColor: condition ? '#005c4b' : '#202c33',
    };
  };

  const wasReadColor = (index: number): React.CSSProperties => {
    if (messages !== undefined) {
      if (messages.length - maxNotRead > index) return { color: '#4fc3f7' };
      else return { color: '#beb8ae' };
    }
    return { color: '#4fc3f7' };
  };

  return (
    <div className={style.container}>
      <div className={style.up}>
        {/* setBarOpen */}
        <span className={style.bar_open} onClick={() => setBarOpen(true)}>
          <DehazeIcon />
        </span>
        <span className={style.group_name}>{group?.group_name}</span>
        <span className={style.margin}></span>
        {gifOpen && <Gif sendMessage={sendMessage} setGifOpen={setGifOpen} />}
        <span className={style.group_members}>
          <GroupMembers />
        </span>
      </div>
      <div ref={mainContainer} className={style.main}>
        {messages &&
          messages.length !== 0 &&
          messages.map((message, index) => {
            return (
              <MessageCard
                index={index}
                message={message}
                maxNotRead={maxNotRead}
              />
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
        <span className={style.message_form}>
          <form onSubmit={(e) => submitForm(e)}>
            <input
              type="text"
              onChange={(e) => setInputMsg(e.target.value)}
              value={inputMsg}
              placeholder="Type a message"
            />
          </form>
        </span>
        <span className={style.mic}>
          <MicIcon />
        </span>
      </div>
    </div>
  );
}

export default Chat;
