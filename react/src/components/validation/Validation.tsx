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
    <div>
      <div>validation</div>
      <button onClick={sendMessage}>validation message</button>
      <Link to="/register">register</Link>
      <Link to="/login">login</Link>
      <Outlet context={connection} />
    </div>
  );
}

export default Validation;
