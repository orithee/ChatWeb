import style from './Main.module.scss';
import { useSelector } from 'react-redux';
import { globalState } from '../../app/store';
import { useEffect, useState } from 'react';
import CreateNewGroup from '../createNewGroup/CreateNewGroup';
import { useNavigate } from 'react-router-dom';

function Main() {
  const userName = useSelector((state: globalState) => state.global.userName);
  const [addGroup, setAddGroup] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userName) navigate('/', { replace: true });
  });

  const logOut = () => {
    document.cookie = 'token=; Path=/; Expires=Thu, 01 Jan 2000 00:00:01 GMT;';
    document.location.reload();
  };

  return (
    <div className={style.main_container}>
      {addGroup && (
        <div className={style.add_new_group}>
          {' '}
          <CreateNewGroup openNew={setAddGroup} userName={userName} />
        </div>
      )}
      <div className={style.group_list}>
        <div className={style.nav_bar}>
          <button onClick={() => setAddGroup(true)}>create new group</button>
        </div>
        {'group_list ' + userName}
        {/* 1. Option to create new group. */}
        {/* 2. Option to see group messages. */}
        {/* 3. Option to search group by name. */}
      </div>
      <div className={style.chat_container}>
        <button onClick={() => logOut()}>log out</button>
        chat_container
        {/* 1. Reload the messages by the user and by a selected group. */}
        {/* 2. Option to send a message - send it to the database and return it to all members. */}
      </div>
    </div>
  );
}

export default Main;
