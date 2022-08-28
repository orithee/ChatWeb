import style from './Validation.module.scss';
import { WsConnection, ReadMessage } from '../../App';
import { useContext } from 'react';
import { Link, Outlet } from 'react-router-dom';

function Validation() {
  const connection = useContext<WebSocket>(WsConnection);
  const message = useContext<string>(ReadMessage);
  console.log(message);
  // TODO: Check if the user is authenticated - if true - go to '/main'...

  const sendMessage = () => {
    connection.send('validation');
  };

  return (
    <div className={style.container}>
      <div className={style.sub_container}>
        <button onClick={sendMessage}>validation message</button>
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
