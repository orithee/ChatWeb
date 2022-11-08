import style from './Login.module.scss';
import { deleteToken, toStr } from '../../../helpers/auxiliaryFunc';
import Form from 'react-bootstrap/Form';
import { useContext, useState } from 'react';
import { WsConnection } from '../../../App';
import { globalState } from '../../../redux/store';
import { useSelector } from 'react-redux';
import { useNavigate, useOutletContext } from 'react-router-dom';

// Login component:
function Login() {
  const connection = useContext<WebSocket>(WsConnection);
  const signAsGuest = useOutletContext<Function>();
  const message = useSelector(
    (state: globalState) => state.global.globalMessage
  );
  const navigate = useNavigate();

  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const submitLoginForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    deleteToken();
    connection.send(
      toStr({
        type: 'login',
        userName: username,
        password: password,
      })
    );
  };

  return (
    <div>
      <h2>Login</h2>
      <Form onSubmit={(e) => submitLoginForm(e)}>
        <Form.Group className="mb-3">
          <Form.Label>Username</Form.Label>
          <Form.Control
            onChange={(e) => setUsername(e.target.value)}
            value={username}
            type="text"
            placeholder="your name"
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            type="password"
            placeholder="your Password"
            required
          />
          {message.type === 'error' && message.problem === 'login' && (
            <Form.Text className="text-muted">
              Login failed. Try again...
            </Form.Text>
          )}
        </Form.Group>
        <div className={style.bottom}>
          <button type="submit">Login</button>
          <button className={style.back} onClick={() => navigate('/')}>
            Back
          </button>
          <div>
            <p className={style.normal_size} onClick={() => signAsGuest()}>
              Continue as guest
            </p>
            <p className={style.short_size} onClick={() => signAsGuest()}>
              guest &#8658;
            </p>
          </div>
        </div>
      </Form>
    </div>
  );
}

export default Login;
