import style from './Register.module.scss';
import { Link } from 'react-router-dom';
import { toStr } from '../../assets/auxiliaryFunc';
import Form from 'react-bootstrap/Form';
import { useContext, useState } from 'react';
import { WsConnection } from '../../App';
import { globalState } from '../../app/store';
import { useSelector } from 'react-redux';

function Register() {
  const connection = useContext<WebSocket>(WsConnection);
  const message = useSelector((state: globalState) => state.global.message);

  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [email, setEmail] = useState<string>('');

  const submitForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    connection.send(
      toStr({
        type: 'register',
        username: username,
        password: password,
        email: email,
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

          {message.type === 'error' &&
            message.problem === 'register' &&
            message.title === 'username' && (
              <Form.Text className="text-muted">
                This username already exists in the system! try another name.
              </Form.Text>
            )}
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
        <Form.Group className="mb-3">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            type="email"
            placeholder="your email"
            required
          />
          {message.type === 'error' &&
            message.problem === 'register' &&
            message.title === 'failed' && (
              <Form.Text className="text-muted">
                Registration failed, try again....
              </Form.Text>
            )}
        </Form.Group>
        <button type="submit">Submit</button>
        <button>
          <Link to="/">back</Link>
        </button>
      </Form>
    </div>
  );
}

export default Register;
