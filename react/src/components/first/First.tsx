import React from 'react';
import style from './First.module.scss';
import axios from 'axios';

interface State {}

class First extends React.Component<{}, State> {
  componentDidUpdate() {
    console.log('component "First" is update');
  }

  componentDidMount() {
    console.log('component "First" is mount');
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
