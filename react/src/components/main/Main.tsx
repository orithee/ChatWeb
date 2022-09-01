import style from './Main.module.scss';
import { useSelector } from 'react-redux';
import { globalState } from '../../redux/store';
import { useEffect, useState } from 'react';
import CreateNewGroup from '../createNewGroup/CreateNewGroup';
import { Outlet, useNavigate } from 'react-router-dom';
import Options from '../options/Options';
import GroupList from '../groupList/GroupList';

function Main() {
  const userName = useSelector((state: globalState) => state.global.userName);
  const [addGroupBtn, setAddGroupBtn] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userName) navigate('/', { replace: true });
  });

  return (
    <div className={style.main_container}>
      {addGroupBtn && (
        <CreateNewGroup openNew={setAddGroupBtn} userName={userName} />
      )}

      <div className={style.bar_container}>
        <div>{userName}</div>
        <Options addGroupBtn={setAddGroupBtn} />
        <GroupList />
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
