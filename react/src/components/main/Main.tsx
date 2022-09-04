import style from './Main.module.scss';
import { useSelector } from 'react-redux';
import { globalState } from '../../redux/store';
import { useEffect, useState } from 'react';
import CreateNewGroup from '../createNewGroup/CreateNewGroup';
import { Outlet, useNavigate } from 'react-router-dom';
import Options from '../options/Options';
import GroupList from '../groupList/GroupList';

function Main() {
  const user = useSelector((state: globalState) => state.global.user);
  const [addGroupBtn, setAddGroupBtn] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user === undefined) navigate('/', { replace: true });
  });

  return (
    <div className={style.main_container}>
      {addGroupBtn && user && (
        <CreateNewGroup openNew={setAddGroupBtn} user={user} />
      )}
      <div className={style.bar_container}>
        <div>{user?.user_name}</div>
        <Options addGroupBtn={setAddGroupBtn} />
        <GroupList />
      </div>
      <div className={style.chat_container}>
        <Outlet />
      </div>
    </div>
  );
}

export default Main;
