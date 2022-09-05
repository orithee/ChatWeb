import style from './Options.module.scss';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import logOut from '../../assets/logOut';
interface Props {
  addGroupBtn: Function;
}

function Options({ addGroupBtn }: Props) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const logOutFunc = () => {
    logOut(dispatch, navigate);
  };

  return (
    <div className={style.options}>
      {/* 4. Option to search group by name. */}
      <button
        className={style.button}
        onClick={() => {
          addGroupBtn(true);
        }}
      >
        create new group
      </button>
      <button className={style.button} onClick={() => logOutFunc()}>
        log out
      </button>
    </div>
  );
}

export default Options;
