import style from './Opening.module.scss';
import { useNavigate, useOutletContext } from 'react-router-dom';

function Opening() {
  const navigate = useNavigate();
  const signAsGuest = useOutletContext<Function>();

  return (
    <div>
      <h3>Welcome to Chat Web !</h3>
      <div className={style.bottom}>
        <button onClick={() => navigate('/login')}>login</button>
        <button onClick={() => navigate('/register')}>register</button>
        <div>
          <p onClick={() => signAsGuest()}>Continue as guest</p>
        </div>
      </div>
    </div>
  );
}

export default Opening;
