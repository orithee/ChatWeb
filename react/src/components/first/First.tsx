import React from 'react';
import style from './First.module.scss';
import axios from 'axios';

interface State {}

class First extends React.Component<{}, State> {
  componentDidUpdate() {
    console.log('component is update');
  }

  componentDidMount() {
    console.log('component is mount');
    axios
      .get('/get')
      .then(console.log)
      .catch((res) => console.log('error: ' + res));
  }
  render() {
    return (
      <div>
        <button className={style.button}>init</button>
      </div>
    );
  }
}

export default First;
