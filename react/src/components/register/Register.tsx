import style from './Validation.module.scss';
import { useOutletContext } from 'react-router-dom';
import { toStr } from '../../assets/jsonConvert';

const registerMsg = {
  type: 'register',
  username: 'ori',
  password: '12345',
  mail: 'mail@mm',
};
function Register() {
  const connection = useOutletContext<WebSocket>();

  const sendMessage = () => {
    connection.send(toStr(registerMsg));
  };

  return (
    <div>
      <div>register</div>
      <button onClick={sendMessage}>register message</button>
    </div>
  );
}

export default Register;
