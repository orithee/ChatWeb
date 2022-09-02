import style from './Opening.module.scss';
import { useNavigate } from 'react-router-dom';

function Opening() {
  const navigate = useNavigate();

  return (
    <div>
      <h3>Welcome to Chat Web !</h3>
      <div className={style.bottom}>
        <button onClick={() => navigate('/login')}>login</button>
        <button onClick={() => navigate('/register')}>register</button>
        <div>
          <p>Continue as guest</p>
        </div>
      </div>
    </div>
  );
}

export default Opening;
