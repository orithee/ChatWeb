import style from './Login.module.scss';
import { toStr } from '../../assets/auxiliaryFunc';
import Form from 'react-bootstrap/Form';
import { useContext, useState } from 'react';
import { WsConnection } from '../../App';
import { globalState } from '../../redux/store';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function Login() {
  const connection = useContext<WebSocket>(WsConnection);
  const message = useSelector((state: globalState) => state.global.message);
  const navigate = useNavigate();

  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const submitForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    connection.send(
      toStr({
        type: 'login',
        username: username,
        password: password,
      })
    );
  };

  return (
    <div>
      <h2>Login</h2>
      <Form onSubmit={(e) => submitForm(e)}>
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
            <p>Continue as guest</p>
          </div>
        </div>
      </Form>
    </div>
  );
}

export default Login;
