import style from './Main.module.scss';
import { useSelector } from 'react-redux';
import { globalState } from '../../redux/store';
import { useEffect, useState } from 'react';
import CreateNewGroup from '../CreateNewGroup/CreateNewGroup';
import { Outlet, useNavigate } from 'react-router-dom';
import Options from '../Options/Options';
import GroupList from '../GroupList/GroupList';

function Main() {
  const user = useSelector((state: globalState) => state.global.user);
  const message = useSelector(
    (state: globalState) => state.global.globalMessage
  );

  const [addGroupBtn, setAddGroupBtn] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user === undefined) navigate('/', { replace: true });
  });

  useEffect(() => {
    if (message.type === 'newGroupFromServer' && user) {
      if (message.userName === user.user_name) setAddGroupBtn(false);
    }
  }, [message]);

  return (
    <div className={style.main_container}>
      {addGroupBtn && user && (
        <CreateNewGroup openNew={setAddGroupBtn} user={user} />
      )}
      <div className={style.bar_container}>
        {user && <div style={{ color: 'white' }}>{user.user_name}</div>}
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
