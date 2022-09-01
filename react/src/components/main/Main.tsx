import style from './Main.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { globalState, chatState } from '../../redux/store';
import { useContext, useEffect, useState } from 'react';
import CreateNewGroup from '../createNewGroup/CreateNewGroup';
import { Outlet, useNavigate } from 'react-router-dom';
import { WsConnection } from '../../App';
import { updateUserLogged } from '../../redux/appSlice';
import ListGroup from 'react-bootstrap/ListGroup';

function Main() {
  const connection = useContext<WebSocket>(WsConnection);
  const userName = useSelector((state: globalState) => state.global.userName);
  const groupList = useSelector((state: chatState) => state.chat.groupList);
  const [addGroupBtn, setAddGroupBtn] = useState<boolean>(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!userName) navigate('/', { replace: true });
  });

  const logOut = () => {
    document.cookie = 'token=; Path=/; Expires=Thu, 01 Jan 2000 00:00:01 GMT;';
    dispatch(updateUserLogged(undefined));
    navigate('/', { replace: true });
  };

  const openChat = (groupName: string) => {
    // dispatch(updateUserLogged(undefined));
    navigate('/main/' + groupName);
  };

  return (
    <div className={style.main_container}>
      {addGroupBtn && (
        <CreateNewGroup openNew={setAddGroupBtn} userName={userName} />
      )}

      <div className={style.nav_bar}>
        <div>{userName}</div>
        <div className={style.options}>
          {/* 4. Option to search group by name. */}
          <button
            className={style.button}
            onClick={() => {
              setAddGroupBtn(true);
              console.log('click');
            }}
          >
            create new group
          </button>
          <button className={style.button} onClick={() => logOut()}>
            log out
          </button>
        </div>

        <div className={style.group_list_container}>
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
      </div>
      <div className={style.chat_container}>
        <Outlet />
        {/* 1. Reload the messages by the user and by a selected group. */}
        {/* 2. Option to send a message - send it to the database and return it to all members. */}
      </div>
    </div>
  );
}

export default Main;
