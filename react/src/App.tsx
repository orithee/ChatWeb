import React from 'react';
import style from './App.module.scss';
import First from './components/first/First';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { WsConnect } from './assets/WsConnection';

interface State {}
class App extends React.Component<{}, State> {
  connection: WebSocket;
  constructor(props: {}) {
    super(props);
    this.connection = WsConnect();
  }

  componentDidMount() {
    console.log('component "App" is mount');
    this.connection.onmessage = (event) => {
      console.log(event.data);
    };

    this.connection.onclose = () => {
      console.log('WebSocket closed');
    };
    this.connection.onerror = () => {
      console.error('WebSocket connection failed');
    };
  }

  render() {
    return (
      <div className={style}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<First />} />
          </Routes>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
