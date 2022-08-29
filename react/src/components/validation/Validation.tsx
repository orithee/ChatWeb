import style from './Validation.module.scss';
import { useEffect } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { globalState } from '../../app/store';

function Validation() {
  const userName = useSelector((state: globalState) => state.global.userName);
  const navigate = useNavigate();

  useEffect(() => {
    if (userName) navigate('/main', { replace: true });
  });

  return (
    <div className={style.container}>
      <div className={style.sub_container}>
        <p>userName: {userName}</p>
      </div>
      <div className={style.sub_container}>
        <button>
          <Link className={style.link} to="/register">
            register
          </Link>
        </button>
        <button>
          <Link className={style.link} to="/login">
            login
          </Link>
        </button>
        <Outlet />
      </div>
      <div className={style.sub_container}>validation</div>
    </div>
  );
}

export default Validation;
