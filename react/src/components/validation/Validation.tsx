import style from './Validation.module.scss';
import { WsConnection } from '../../App';
import { useContext } from 'react';

function Validation() {
  const connection = useContext(WsConnection);

  const sendMessage = () => {
    connection.send('validation');
  };

  connection.onmessage = (event) => {
    console.log(event.data);
  };

  return (
    <div style={{ display: 'flex' }}>
      <div>validation</div>
      <button onClick={sendMessage}>send message</button>
    </div>
  );
}

export default Validation;
