import { useOutletContext } from 'react-router-dom';
import { toStr } from '../../assets/jsonConvert';
import style from './Validation.module.scss';
const loginMsg = {
  type: 'login',
  username: 'ori',
  password: '12345',
};
function Login() {
  const connection = useOutletContext<WebSocket>();

  const sendMessage = () => {
    connection.send(toStr(loginMsg));
  };

  return (
    <div>
      <div>login</div>
      <button onClick={sendMessage}>login message</button>
    </div>
  );
}

export default Login;
