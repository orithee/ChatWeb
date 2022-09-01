import style from './GroupList.module.scss';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import ListGroup from 'react-bootstrap/esm/ListGroup';
import { chatState } from '../../redux/store';
import { updateCurrentGroup, updateGroupMessages } from '../../redux/mainSlice';
import { useContext, useState } from 'react';
import { WsConnection } from '../../App';
import { toStr } from '../../assets/auxiliaryFunc';

function GroupList() {
  const groupList = useSelector((state: chatState) => state.chat.groupList);
  const connection = useContext<WebSocket>(WsConnection);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const openChat = (groupName: string) => {
    dispatch(updateCurrentGroup(groupName));
    connection.send(
      toStr({
        type: 'getGroupMessages',
        groupName: groupName,
      })
    );
    navigate('/main/' + groupName);
  };

  return (
    <div className={style.container}>
      <ListGroup className={style.list}>
        {groupList &&
          groupList.map((groupName, index) => {
            return (
              <ListGroup.Item
                onClick={() => openChat(groupName)}
                className={style.item}
                key={index}
              >
                {groupName}
              </ListGroup.Item>
            );
          })}
        {/* 3. Option to see specific group messages by click the group. */}
      </ListGroup>
    </div>
  );
}

export default GroupList;
