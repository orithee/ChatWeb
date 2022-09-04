import style from './GroupList.module.scss';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import ListGroup from 'react-bootstrap/esm/ListGroup';
import { chatState } from '../../redux/store';
import { updateCurrentGroup } from '../../redux/mainSlice';
import { useContext, useEffect } from 'react';
import { WsConnection } from '../../App';
import { toStr } from '../../assets/auxiliaryFunc';
import { Group } from '../../assets/types';

function GroupList() {
  const connection = useContext<WebSocket>(WsConnection);
  const groupList = useSelector((state: chatState) => state.chat.groupList);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const openChat = (group: Group) => {
    dispatch(updateCurrentGroup(group));
    connection.send(
      toStr({
        type: 'getGroupMessages',
        groupId: group.group_id,
      })
    );
    navigate('/main/' + group.group_id);
  };

  useEffect(() => {
    if (groupList !== undefined && groupList.length > 0) openChat(groupList[0]);
  }, [groupList]);

  return (
    <div className={style.container}>
      <ListGroup className={style.list}>
        {groupList &&
          groupList.map((group, index) => {
            return (
              <ListGroup.Item
                onClick={() => openChat(group)}
                className={style.item}
                key={index}
              >
                {group.group_name}
              </ListGroup.Item>
            );
          })}
      </ListGroup>
    </div>
  );
}

export default GroupList;
