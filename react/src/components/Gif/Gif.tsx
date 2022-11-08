import style from './Gif.module.scss';
import { useContext, useEffect, useRef, useState } from 'react';
import Form from 'react-bootstrap/esm/Form';
import CloseButton from 'react-bootstrap/CloseButton';
import { WsConnection } from '../../App';
import { toStr } from '../../helpers/auxiliaryFunc';
import { useSelector } from 'react-redux';
import { globalState } from '../../redux/store';

interface Props {
  sendMessage: Function;
  setGifOpen: Function;
}

function Gif({ sendMessage, setGifOpen }: Props) {
  const connection = useContext<WebSocket>(WsConnection);
  const message = useSelector(
    (state: globalState) => state.global.globalMessage
  );
  const firstUpdate = useRef(true);

  const [term, setTerm] = useState<string>('');
  const [noGif, setNoGif] = useState<boolean>(false);
  const sendGifMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (term) {
      connection.send(
        toStr({
          type: 'tryGif',
          termStr: term,
        })
      );
    }
  };

  useEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }
    if (message.type === 'gifRes') {
      if (message.success === true) {
        sendMessage(true, message.url);
        setGifOpen(false);
      } else setNoGif(true);
    }
  }, [message]);

  return (
    <div className={style.main_container}>
      <Form onSubmit={(e) => sendGifMessage(e)}>
        <CloseButton
          className={style.close}
          onClick={() => setGifOpen(false)}
        />
        <Form.Group className="mb-3">
          <div className={style.gif_input}>
            <Form.Control
              onChange={(e) => setTerm(e.target.value)}
              value={term}
              type="text"
              placeholder="search gif"
            />
          </div>
          {noGif && (
            <Form.Text className="text-muted">
              There is no such gif, change the input...
            </Form.Text>
          )}
        </Form.Group>
        <div>
          <button className={style.btn_send} type="submit">
            send
          </button>
        </div>
      </Form>
    </div>
  );
}

export default Gif;
