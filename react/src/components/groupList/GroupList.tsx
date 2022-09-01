import style from './GroupList.module.scss';
import { useNavigate, useParams } from 'react-router-dom';
import { updateUserLogged } from '../../redux/appSlice';
import { useDispatch, useSelector } from 'react-redux';
import ListGroup from 'react-bootstrap/esm/ListGroup';
import { chatState } from '../../redux/store';

function GroupList() {
  const groupList = useSelector((state: chatState) => state.chat.groupList);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const openChat = (groupName: string) => {
    // dispatch(updateUserLogged(undefined));
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
