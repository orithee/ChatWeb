import style from './Chat.module.scss';
import { useParams } from 'react-router-dom';

function Chat() {
  let params = useParams();
  let groupIdParam = params.groupId;
  console.log(groupIdParam);

  return (
    <div className={style.container}>
      <div className={style.up}>up</div>
      <div className={style.main}>
        <div>main:</div>
        {groupIdParam}
      </div>
      <div className={style.bottom}>bottom</div>
    </div>
  );
}

export default Chat;
