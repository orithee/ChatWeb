import style from './Main.module.scss';

function Main() {
  return (
    <div className={style.main_container}>
      <div className={style.group_list}>
        group_list
        {/* 1. Option to create new group. */}
        {/* 2. Option to see group messages. */}
        {/* 3. Option to search group by name. */}
      </div>
      <div className={style.chat_container}>
        chat_container
        {/* 1. Reload the messages by the user and by a selected group. */}
        {/* 2. Option to send a message - send it to the database and return it to all members. */}
      </div>
    </div>
  );
}

export default Main;
