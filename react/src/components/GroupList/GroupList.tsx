import style from './GroupList.module.scss';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import ListGroup from 'react-bootstrap/esm/ListGroup';
import { chatState } from '../../redux/store';
import { updateCurrentGroup } from '../../redux/chatSlice';
import { useContext, useEffect } from 'react';
import { WsConnection } from '../../App';
import { toStr } from '../../helpers/auxiliaryFunc';
import { Group } from '../../helpers/types';

function GroupList() {
  const connection = useContext<WebSocket>(WsConnection);
  const groupList = useSelector((state: chatState) => state.chat.groupList);
  const currentGroup = useSelector(
    (state: chatState) => state.chat.currentGroup
  );

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const openChat = (group: Group) => {
    dispatch(updateCurrentGroup(group));
    connection.send(
      toStr({ type: 'getGroupMessages', groupId: group.group_id })
    );
    navigate('/main/' + group.group_id);
  };

  useEffect(() => {
    if (groupList !== undefined && groupList.length > 0) openChat(groupList[0]);
  }, [groupList]);

  const backgroundColor = (group: Group): React.CSSProperties => {
    const condition = group.group_id === currentGroup?.group_id;
    return { backgroundColor: condition ? '#2a3942' : '#202c33' };
  };

  return (
    <div className={style.container}>
      <ListGroup className={style.list}>
        {/* TODO:
          1. If this group does not opening now - add green indication about the message on the group list.
          2. Marking the current group.
      */}
        {groupList &&
          groupList.map((group, index) => {
            return (
              <ListGroup.Item
                onClick={() => openChat(group)}
                className={style.item}
                style={backgroundColor(group)}
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
