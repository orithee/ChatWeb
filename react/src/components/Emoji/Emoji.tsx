import style from './Emoji.module.scss';
import Picker from 'emoji-picker-react';
import { useState } from 'react';

// interface Props {
//   addGroupBtn: Function;
// }
// { addGroupBtn }: Props

function Emoji() {
  const [chosenEmoji, setChosenEmoji] = useState<any | null>(null);

  const onEmojiClickk = (
    event: React.MouseEvent<Element, MouseEvent>,
    data: any
  ) => {
    setChosenEmoji(data);
    console.log(data);
  };

  return (
    <div>
      <Picker onEmojiClick={(e, data) => onEmojiClickk(e, data)} />
    </div>
  );
}

export default Emoji;
