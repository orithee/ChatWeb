import style from './Home.module.scss';
import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { globalState } from '../../redux/store';

function Home() {
  const userName = useSelector((state: globalState) => state.global.userName);
  const navigate = useNavigate();

  useEffect(() => {
    if (userName) navigate('/main', { replace: true });
  });

  return (
    <>
      <div className={style.up}>
        <div className={style.title}>
          <h1>Chat Web </h1>
        </div>
      </div>
      <div className={style.bottom}></div>
      <Outlet />
    </>
  );
}

export default Home;
