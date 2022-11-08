import style from './Main.module.scss';
import { useSelector } from 'react-redux';
import { chatState, globalState } from '../../redux/store';
import { useEffect, useState } from 'react';
import CreateNewGroup from '../CreateNewGroup/CreateNewGroup';
import { Outlet, useNavigate } from 'react-router-dom';
import Options from '../Options/Options';
import GroupList from '../GroupList/GroupList';
import DehazeIcon from '@mui/icons-material/Dehaze';

// The main component of the chat page:
function Main() {
  const user = useSelector((state: globalState) => state.global.user);
  const group = useSelector((state: chatState) => state.chat.currentGroup);
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
    if (windowSize.innerWidth <= 700) {
      console.log('no desktop');
      setIsDesktop(false);
    } else console.log('is desktop');
  }, []);

  if (!isDesktop)
    return (
      <div className={style.main_container}>
        {barOpen ? (
          <div className={style.bar_container}>
            {group && (
              <div
                className={style.change_side}
                onClick={() => {
                  setBarOpen(false);
                }}
              >
                <DehazeIcon style={{ color: 'white', cursor: 'pointer' }} />
              </div>
            )}
            {addGroupBtn && user && (
              <CreateNewGroup openNew={setAddGroupBtn} user={user} />
            )}
            <div style={{ height: 'auto', margin: '2%' }}>
              {user && <div style={{ color: 'white' }}>{user.user_name}</div>}
              <Options addGroupBtn={setAddGroupBtn} />
            </div>
            <div style={{ height: '100%' }}>
              <GroupList setBarOpen={setBarOpen} />
            </div>
          </div>
        ) : (
          <div className={style.chat_container}>
            <div className={style.change_side} onClick={() => setBarOpen(true)}>
              <DehazeIcon style={{ color: 'white', cursor: 'pointer' }} />
            </div>
            <Outlet />
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
        <div style={{ height: 'auto', margin: '2%' }}>
          {user && (
            <div style={{ color: 'white', fontSize: 'large' }}>
              {user.user_name}
            </div>
          )}
          <Options addGroupBtn={setAddGroupBtn} />
        </div>
        <div style={{ height: '100%', width: '95%' }}>
          <GroupList setBarOpen={setBarOpen} />
        </div>
      </div>
      <div className={style.chat_container}>
        <Outlet />
      </div>
    </div>
  );
}

export default Main;

function getWindowSize() {
  const { innerWidth, innerHeight } = window;
  return { innerWidth, innerHeight };
}
