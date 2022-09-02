import style from './Chat.module.scss';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { chatState } from '../../redux/store';
import { useContext, useState } from 'react';
import { WsConnection } from '../../App';
import ListGroup from 'react-bootstrap/esm/ListGroup';

function Chat() {
  const connection = useContext<WebSocket>(WsConnection);
  const messages = useSelector((state: chatState) => state.chat.groupMessages);
  let groupIdParam = useParams().groupId;

  return (
    <div className={style.container}>
      <div className={style.up}>
        <div className={style.up_left}>
          {/* <img src="" alt="" /> */}
          <p>{groupIdParam}</p>
        </div>
      </div>
      <div className={style.main}>
        <div>main:</div>
        {groupIdParam}
        <br />
        <div>
          {messages &&
            messages.length != 0 &&
            messages.map((message, index) => {
              return (
                <ListGroup.Item key={index}>
                  <div>{message.group_name}</div>
                  <div>{message.sent_by}</div>
                  <div>{message.message_id}</div>
                  <div>{message.created_at}</div>
                  <div>{message.message_text}</div>
                </ListGroup.Item>
              );
            })}
        </div>
        <div className={style.message}>
          <div className={style.sent_by}>sent by</div>
          <div className={style.text}>message text</div>
          <div className={style.hour}>time</div>
        </div>
      </div>
      <div className={style.bottom}>bottom</div>
    </div>
  );
}

export default Chat;
