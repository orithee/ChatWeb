import style from './MessageCard.module.scss';
import { useSelector } from 'react-redux';
import { chatState, globalState } from '../../redux/store';
import ListGroup from 'react-bootstrap/esm/ListGroup';
import { convertTime } from '../../helpers/auxiliaryFunc';
import { GroupMessage } from '../../helpers/types';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import { useMemo } from 'react';

interface Props {
  index: number;
  message: GroupMessage;
  maxNotRead: number;
}

// A message card component:
function MessageCard(props: Props) {
  const user = useSelector((state: globalState) => state.global.user);
  const messages = useSelector((state: chatState) => state.chat.groupMessages);

  const textDirection = useMemo((): React.CSSProperties => {
    const condition = props.message.sent_by_name === user?.user_name;
    return { textAlign: condition ? 'start' : 'end' };
  }, [props.message]);

  const msgDirection = useMemo((): React.CSSProperties => {
    const condition = props.message.sent_by_name === user?.user_name;
    return {
      justifyContent: condition ? 'flex-start' : 'flex-end',
    };
  }, [props.message]);

  const msgColor = useMemo((): React.CSSProperties => {
    const condition = props.message.sent_by_name === user?.user_name;
    return {
      backgroundColor: condition ? '#005c4b' : '#202c33',
    };
  }, [props.message]);

  const timeFormat = useMemo(() => {
    return convertTime(props.message.created_at);
  }, [props.message]);

  const wasReadColor = useMemo((): React.CSSProperties => {
    console.log('dd');
    if (messages !== undefined) {
      if (messages.length - props.maxNotRead > props.index)
        return { color: '#4fc3f7' };
      else return { color: '#beb8ae' };
    }
    return { color: '#4fc3f7' };
  }, [props.message, props.maxNotRead]);

  return (
    <ListGroup.Item className={style.item} style={msgDirection}>
      <div className={style.message} style={msgColor}>
        <div className={style.sent_by} style={textDirection}>
          {props.message.sent_by_name}
        </div>
        <div className={style.text} style={textDirection}>
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
            <DoneAllIcon style={wasReadColor} fontSize={'small'}></DoneAllIcon>
            <span> </span>
          </span>
          {timeFormat}
        </div>
      </div>
    </ListGroup.Item>
  );
}

export default MessageCard;
