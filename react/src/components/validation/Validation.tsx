import style from './Validation.module.scss';
import { useContext } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { WsConnection } from '../../App';

function Validation() {
  const connection = useContext<WebSocket>(WsConnection);
  const userName = useSelector((state: any) => state.global.userName);
  // TODO: Check if the user is authenticated - if true - go to '/main'...

  const sendMessage = () => {
    connection.send('validation');
  };

  return (
    <div className={style.container}>
      <div className={style.sub_container}>
        <button onClick={sendMessage}>validation message</button>
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
