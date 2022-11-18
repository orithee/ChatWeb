import Picker from 'emoji-picker-react';
import CloseButton from 'react-bootstrap/esm/CloseButton';
import style from './Emoji.module.scss';

interface Props {
  updateInput: Function;
  setEmojiOpen: Function;
  currentInput: string;
}

//A component that creates the emoji template:
function Emoji({ updateInput, currentInput, setEmojiOpen }: Props) {
  const onEmojiClickk = (data: any) => {
    updateInput(currentInput + data.emoji);
  };

  return (
    <div className={style.main_container}>
      <Picker onEmojiClick={(e, data) => onEmojiClickk(data)} />
      <CloseButton
        className={style.close}
        onClick={() => setEmojiOpen(false)}
      />
    </div>
  );
}

export default Emoji;
