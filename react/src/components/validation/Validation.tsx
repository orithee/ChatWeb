import style from './Validation.module.scss';
import { WsConnection, ReadMessage } from '../../App';
import { useContext } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

function Validation() {
  const connection = useContext<WebSocket>(WsConnection);
  const message = useContext<string>(ReadMessage);
  const userName = useSelector((state: any) => state.global.userName);

  console.log(message);
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
        <Outlet context={connection} />
      </div>
      <div className={style.sub_container}>validation</div>
    </div>
  );
}

export default Validation;
