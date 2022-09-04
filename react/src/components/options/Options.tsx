import style from './Options.module.scss';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import reset from '../../assets/reset';
interface Props {
  addGroupBtn: Function;
}

function Options({ addGroupBtn }: Props) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const logOut = () => {
    reset(dispatch, navigate);
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
      <button className={style.button} onClick={() => logOut()}>
        log out
      </button>
    </div>
  );
}

export default Options;
