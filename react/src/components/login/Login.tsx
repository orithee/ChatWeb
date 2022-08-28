import style from './Login.module.scss';
import { Link, useOutletContext } from 'react-router-dom';
import { toStr } from '../../assets/jsonConvert';
import Form from 'react-bootstrap/Form';
import { useState } from 'react';

const loginMsg = {
  type: 'login',
  username: 'ori',
  password: '12345',
};

function Login() {
  const connection = useOutletContext<WebSocket>();

  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const sendMessage = () => {
    connection.send(toStr(loginMsg));
  };

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
    <div className={style.container}>
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
        </Form.Group>
        <button type="submit">Submit</button>
        <button>
          <Link to="/">back</Link>
        </button>
        <button onClick={sendMessage}>default message</button>
      </Form>
    </div>
  );
}

export default Login;
