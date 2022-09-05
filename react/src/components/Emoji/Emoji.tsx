import style from './Emoji.module.scss';
import Picker from 'emoji-picker-react';
import { useState } from 'react';

interface Props {
  updateInput: Function;
  currentInput: string;
}

function Emoji({ updateInput, currentInput }: Props) {
  const onEmojiClickk = (data: any) => {
    updateInput(currentInput + data.emoji);
  };

  return (
    <div>
      <Picker onEmojiClick={(e, data) => onEmojiClickk(data)} />
    </div>
  );
}

export default Emoji;
