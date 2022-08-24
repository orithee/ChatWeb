import style from './Validation.module.scss';
import { WsConnection, ReadMessage } from '../../App';
import { useContext } from 'react';
import { Link, Outlet } from 'react-router-dom';

function Validation() {
  const connection = useContext<WebSocket>(WsConnection);
  const message = useContext<string>(ReadMessage);
  console.log(message);

  const sendMessage = () => {
    connection.send('validation');
  };

  return (
    <div>
      <div>validation</div>
      <button onClick={sendMessage}>send message</button>
      <Link to="/register">register</Link>
      <Outlet />
    </div>
  );
}

export default Validation;
