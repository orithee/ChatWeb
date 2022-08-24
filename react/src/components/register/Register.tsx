import style from './Validation.module.scss';
import { WsConnection } from '../../App';
import { useContext } from 'react';

function Register() {
  const connection = useContext(WsConnection);

  const sendMessage = () => {
    connection.send('validation');
  };

  return (
    <div>
      <div>register</div>
      <button onClick={sendMessage}>send message</button>
    </div>
  );
}

export default Register;
