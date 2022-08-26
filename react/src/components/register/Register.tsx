import style from './Register.module.scss';
import { useOutletContext } from 'react-router-dom';
import { toStr } from '../../assets/jsonConvert';
import Form from 'react-bootstrap/Form';
import { useState } from 'react';

const registerMsg = {
  type: 'register',
  username: 'ori',
  password: '12345',
  mail: 'mail@mm',
};

function Register() {
  const connection = useOutletContext<WebSocket>();

  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [email, setEmail] = useState<string>('');

  const sendMessage = () => {
    connection.send(toStr(registerMsg));
  };

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
        </Form.Group>
        <button type="submit">Submit</button>
        <button onClick={sendMessage}>default message</button>
      </Form>
    </div>
  );
}

export default Register;
