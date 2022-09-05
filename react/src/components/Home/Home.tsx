import style from './Home.module.scss';
import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { globalState } from '../../redux/store';
import { useContext } from 'react';
import { WsConnection } from '../../App';
import { toStr } from '../../helpers/auxiliaryFunc';

function Home() {
  const user = useSelector((state: globalState) => state.global.user);
  const connection = useContext<WebSocket>(WsConnection);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate('/main', { replace: true });
  });

  const signAsGuest = () => {
    connection.send(
      toStr({
        type: 'login',
        userName: 'guest',
        password: 123456789,
      })
    );
  };

  return (
    <>
      <div className={style.up}>
        <div className={style.title}>
          <h1>Chat Web </h1>
        </div>
      </div>
      <div className={style.bottom}></div>
      <div className={style.container}>
        <Outlet context={signAsGuest} />
      </div>
    </>
  );
}

export default Home;
