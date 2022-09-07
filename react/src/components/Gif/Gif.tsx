import style from './Gif.module.scss';
import { useState } from 'react';
import Form from 'react-bootstrap/esm/Form';
import CloseButton from 'react-bootstrap/CloseButton';

interface Props {
  sendMessage: Function;
  setGifOpen: Function;
}

function Gif({ sendMessage, setGifOpen }: Props) {
  const [term, setTerm] = useState<string>('');
  const [noGif, setNoGif] = useState<boolean>(false);
  const sendGifMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const key = 'i51BipA21Bvx8NDvHOJDEv53L4LiQDhp';
      let url = `https://api.giphy.com/v1/gifs/search?api_key=${key}&limit=3&q=`;
      url = url.concat(term.trim());
      const content = await (await fetch(url)).json();
      const gifUrl = content.data[0].images.downsized.url;
      sendMessage(true, gifUrl);
      setGifOpen(false);
    } catch (error) {
      setNoGif(true);
    }
  };

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
