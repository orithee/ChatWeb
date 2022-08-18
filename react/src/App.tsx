import React from 'react';
import style from './App.module.scss';
import First from './components/first/First';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

interface State {}

class App extends React.Component<{}, State> {
  componentDidMount() {
    console.log('component "App" is mount');
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
