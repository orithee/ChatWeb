import style from './Options.module.scss';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import logOut from '../../../helpers/logOut';
interface Props {
  addGroupBtn: Function;
}

// A component that creates the options to log out, create a group, etc...
function Options({ addGroupBtn }: Props) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const logOutFunc = () => {
    logOut(dispatch, navigate);
  };

  return (
    <div className={style.options}>
      {/* // TODO: Option to search group by name. */}
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
