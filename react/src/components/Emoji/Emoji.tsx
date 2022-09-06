import Picker from 'emoji-picker-react';

interface Props {
  updateInput: Function;
  currentInput: string;
}

//A component that creates the emoji template:
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
