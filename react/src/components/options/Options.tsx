import style from './Options.module.scss';
import { useNavigate } from 'react-router-dom';
import { updateUserLogged } from '../../redux/appSlice';
import { useDispatch } from 'react-redux';
import {
  updateCurrentGroup,
  updateGroupList,
  updateNewMessage,
} from '../../redux/mainSlice';

interface Props {
  addGroupBtn: Function;
}

function Options({ addGroupBtn }: Props) {
  // let params = useParams();
  // let groupIdParam = params.groupId;
  // console.log(groupIdParam);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const logOut = () => {
    dispatch(updateUserLogged(undefined));
    dispatch(updateGroupList(undefined));
    dispatch(updateCurrentGroup(undefined));
    document.cookie = 'token=; Path=/; Expires=Thu, 01 Jan 2000 00:00:01 GMT;';
    navigate('/', { replace: true });
  };

  return (
    <div className={style.options}>
      {/* 4. Option to search group by name. */}
      <button
        className={style.button}
        onClick={() => {
          addGroupBtn(true);
          console.log('click');
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
