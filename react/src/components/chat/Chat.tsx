import style from './Chat.module.scss';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { chatState } from '../../redux/store';
import { useContext, useState } from 'react';
import { WsConnection } from '../../App';

function Chat() {
  const connection = useContext<WebSocket>(WsConnection);
  const messages = useSelector((state: chatState) => state.chat.groupMessages);
  let groupIdParam = useParams().groupId;

  return (
    <div className={style.container}>
      <div className={style.up}>up</div>
      <div className={style.main}>
        <div>main:</div>
        {groupIdParam}
        <br />
        <div>{messages}</div>
      </div>
      <div className={style.bottom}>bottom</div>
    </div>
  );
}

export default Chat;
