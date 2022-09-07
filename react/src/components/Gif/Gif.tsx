import style from './Gif.module.scss';
import { useContext, useState } from 'react';
import Form from 'react-bootstrap/esm/Form';
import { WsConnection } from '../../App';
import { toStr } from '../../helpers/auxiliaryFunc';
import { useSelector } from 'react-redux';
import { globalState } from '../../redux/store';
import { User } from '../../helpers/types';

interface Props {
  sendMessage: Function;
  setGifOpen: Function;
  // user: User;
}
// { openNew, user }: Props
// A component that creates the new group template:
function Gif({ sendMessage, setGifOpen }: Props) {
  const [term, setTerm] = useState<string>('');
  const sendGifMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    sendMessage(
      true,
      'https://media2.giphy.com/media/28GHfhGFWpFgsQB4wR/giphy-downsized.gif?cid=026825aa11hrenmjgr2gqa3g69c5imi70iq8o7g40q0qsckz&rid=giphy-downsized.gif&ct=g'
    );
    setGifOpen(false);
    // sendMessage
  };

  return (
    <div className={style.main_container}>
      <h3>Create Group</h3>
      <Form onSubmit={(e) => sendGifMessage(e)}>
        <Form.Group className="mb-3">
          <Form.Label className={style.label}>Member</Form.Label>
          <div className={style.member_input}>
            <Form.Control
              onChange={(e) => setTerm(e.target.value)}
              value={term}
              type="text"
              placeholder="member username"
            />
            <button type="button">Add</button>
          </div>
          <div className={style.label}>Members:</div>
          <div className={style.members_container}>your gif</div>
        </Form.Group>
        <div>
          <button type="submit">search gif</button>
          <button onClick={() => setGifOpen(false)}>close</button>
        </div>
      </Form>
    </div>
  );
}

export default Gif;
