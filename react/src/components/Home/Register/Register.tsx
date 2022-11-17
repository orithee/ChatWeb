import style from './Register.module.scss';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { deleteToken, toStr } from '../../../helpers/auxiliaryFunc';
import Form from 'react-bootstrap/Form';
import { useContext, useState } from 'react';
import { WsConnection } from '../../../App';
import { globalState } from '../../../redux/store';
import { useSelector } from 'react-redux';

// Registration component:
function Register() {
  const connection = useContext<WebSocket>(WsConnection);
  const signAsGuest = useOutletContext<Function>();
  const message = useSelector(
    (state: globalState) => state.global.globalMessage
  );
  const navigate = useNavigate();

  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [email, setEmail] = useState<string>('');

  const submitRegisterForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    deleteToken();
    connection.send(
      toStr({
        type: 'register',
        userName: username,
        password: password,
        email: email,
      })
    );
  };

  const userNameError = () => {
    return (
      message.type === 'error' &&
      message.problem === 'register' &&
      message.title === 'username'
    );
  };

  const registerFailedError = () => {
    return (
      message.type === 'error' &&
      message.problem === 'register' &&
      message.title === 'failed'
    );
  };

  return (
    <div>
      <h2>Register</h2>
      <Form onSubmit={(e) => submitRegisterForm(e)}>
        <Form.Group className="mb-3">
          <Form.Label>Username</Form.Label>
          <Form.Control
            onChange={(e) => setUsername(e.target.value)}
            value={username}
            type="text"
            placeholder="your name"
            required
          />

          {userNameError() && (
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
            placeholder="your password"
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
          {registerFailedError() && (
            <Form.Text className="text-muted">
              Registration failed, try again....
            </Form.Text>
          )}
        </Form.Group>
        <div className={style.bottom}>
          <button type="submit">Register</button>
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

export default Register;
