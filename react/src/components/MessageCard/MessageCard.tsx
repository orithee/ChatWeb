import style from './MessageCard.module.scss';
import { useSelector } from 'react-redux';
import { chatState, globalState } from '../../redux/store';
import ListGroup from 'react-bootstrap/esm/ListGroup';
import { convertTime } from '../../helpers/auxiliaryFunc';
import { GroupMessage } from '../../helpers/types';
import DoneAllIcon from '@mui/icons-material/DoneAll';

interface Props {
  index: number;
  message: GroupMessage;
  maxNotRead: number;
}

// A message card component:
function MessageCard(props: Props) {
  const user = useSelector((state: globalState) => state.global.user);
  const messages = useSelector((state: chatState) => state.chat.groupMessages);

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
      if (messages.length - props.maxNotRead > index)
        return { color: '#4fc3f7' };
      else return { color: '#beb8ae' };
    }
    return { color: '#4fc3f7' };
  };
  return (
    <ListGroup.Item
      className={style.item}
      style={msgDirection(props.message)}
      key={props.index}
    >
      <div className={style.message} style={msgColor(props.message)}>
        <div className={style.sent_by} style={textDirection(props.message)}>
          {props.message.sent_by_name}
        </div>
        <div className={style.text} style={textDirection(props.message)}>
          {!props.message.is_image && props.message.message_text}
          {props.message.is_image && (
            <span>
              <img src={props.message.message_text} alt="img" />
            </span>
          )}
        </div>
        <div
          className={style.hour}
          style={{
            textAlign:
              props.message.sent_by_name === user?.user_name ? 'end' : 'start',
          }}
        >
          <span>
            <DoneAllIcon
              style={wasReadColor(props.index)}
              fontSize={'small'}
            ></DoneAllIcon>
            <span> </span>
          </span>
          {convertTime(props.message.created_at)}
        </div>
      </div>
    </ListGroup.Item>
  );
}

export default MessageCard;
