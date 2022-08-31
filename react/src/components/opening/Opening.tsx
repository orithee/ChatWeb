import style from './Opening.module.scss';
import { useNavigate } from 'react-router-dom';

function Opening() {
  const navigate = useNavigate();
  const navigateTo = (value: string) => {
    navigate(`/${value}`);
  };

  return (
    <div className={style.container}>
      <p>Welcome to Chat Web !</p>
      <div>
        <button onClick={() => navigateTo('register')}>register</button>
        <button onClick={() => navigateTo('login')}>login</button>
      </div>
    </div>
  );
}

export default Opening;
