import style from './Main.module.scss';
import { useSelector } from 'react-redux';
import { globalState } from '../../redux/store';
import { useEffect, useState } from 'react';
import CreateNewGroup from '../CreateNewGroup/CreateNewGroup';
import { Outlet, useNavigate } from 'react-router-dom';
import Options from '../Options/Options';
import GroupList from '../GroupList/GroupList';

// The main component of the chat page:
function Main() {
  const user = useSelector((state: globalState) => state.global.user);
  const message = useSelector(
    (state: globalState) => state.global.globalMessage
  );

  const [addGroupBtn, setAddGroupBtn] = useState<boolean>(false);
  const [windowSize, setWindowSize] = useState(getWindowSize());
  const [isDesktop, setIsDesktop] = useState(true);
  const [barOpen, setBarOpen] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (user === undefined) navigate('/', { replace: true });
  });

  useEffect(() => {
    if (message.type === 'newGroupFromServer' && user) {
      if (message.userName === user.user_name) setAddGroupBtn(false);
    }
  }, [message]);

  useEffect(() => {
    if (windowSize.innerWidth <= 700) setIsDesktop(false);
  }, []);

  if (!isDesktop)
    return (
      <div className={style.main_container}>
        {barOpen ? (
          <div className={style.bar_container}>
            {addGroupBtn && user && (
              <CreateNewGroup openNew={setAddGroupBtn} user={user} />
            )}
            <div>
              {user && <div style={{ color: 'white' }}>{user.user_name}</div>}
              <Options addGroupBtn={setAddGroupBtn} />
            </div>
            <div style={{ height: '80vh' }}>
              <GroupList setBarOpen={setBarOpen} />
            </div>
          </div>
        ) : (
          <div className={style.chat_container}>
            <Outlet context={setBarOpen} />
          </div>
        )}
      </div>
    );

  return (
    <div className={style.main_container}>
      <div className={style.bar_container}>
        {addGroupBtn && user && (
          <CreateNewGroup openNew={setAddGroupBtn} user={user} />
        )}
        <div>
          {user && (
            <div style={{ color: 'white', fontSize: 'large' }}>
              {user.user_name}
            </div>
          )}
          <Options addGroupBtn={setAddGroupBtn} />
        </div>
        <div style={{ height: '80vh', width: '95%' }}>
          <GroupList setBarOpen={setBarOpen} />
        </div>
      </div>
      <div className={style.chat_container}>
        <Outlet context={setBarOpen} />
      </div>
    </div>
  );
}

export default Main;

function getWindowSize() {
  const { innerWidth, innerHeight } = window;
  return { innerWidth, innerHeight };
}
