import { useEffect, useState } from 'react';
import style from './App.module.scss';
import Validation from './components/validation/Validation';
import Main from './components/main/Main';
import Login from './components/login/Login';
import Register from './components/register/Register';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { WsConnect } from './assets/WsConnection';

function App() {
  const [connection] = useState<WebSocket>(WsConnect());
  useEffect(() => {
    console.log('the first render');
    connection.onmessage = (event) => {
      console.log(event.data);
    };

    connection.onclose = () => {
      console.log('WebSocket closed');
    };
    connection.onerror = () => {
      console.error('WebSocket connection failed');
    };
  }, []);

  return (
    <div className={style}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Validation />}>
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
          </Route>
          <Route path="/main" element={<Main />}></Route>
        </Routes>
      </BrowserRouter>
      {/* TODO: If the user after authentication: changes location to "/main"
                Else: changes location to "/login || /register..."
      */}
    </div>
  );
}

export default App;
