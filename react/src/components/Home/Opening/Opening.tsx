import style from './Opening.module.scss';
import { useNavigate, useOutletContext } from 'react-router-dom';

function Opening() {
  const navigate = useNavigate();
  const signAsGuest = useOutletContext<Function>();

  return (
    <div className={style.container}>
      <h3>Welcome to Chat Web !</h3>
      <div className={style.sentences}>
        <div> Always stay connected.</div>
        <div>Keep your social circles close to you.</div>
        <div>Enjoy a unique user experience. </div>
        <div>Choose only Chat Web ! </div>
        <div className={style.call_for_action}>
          👇 Log in / register now 👇{' '}
        </div>
      </div>
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
