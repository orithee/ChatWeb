import style from './App.module.scss';
import Validation from './components/validation/Validation';
import Main from './components/main/Main';
import Login from './components/login/Login';
import Register from './components/register/Register';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { WsConnect } from './assets/WsConnect';
import React, { useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useSelector, useDispatch } from 'react-redux';
import { messageFilter } from './app/messageFilter';
import { globalState } from './app/store';
import Opening from './components/opening/Opening';

// TODO: Merge the default with the value in the provider.
// TODO: Improve the message - reduce the times the components renders -
//       Need to separate the CreateContext to useStates in App component -
//       That all children under app will change only when the message is relevant to them..
// TODO: Understand all code in wsConnect. especially the RegExp...

const WebSocketConnection = WsConnect();
export const WsConnection = React.createContext<WebSocket>(WebSocketConnection);

function App() {
  const dispatch = useDispatch();

  const userName = useSelector((state: globalState) => state.global.userName);
  const message = useSelector((state: globalState) => state.global.message);

  useEffect(() => {
    console.log('user connected: ', userName);
  }, [userName]);

  useEffect(() => {
    console.log('current message: ', message);
  }, [message]);

  WebSocketConnection.onmessage = (event) => {
    messageFilter(event, dispatch);
  };

  return (
    <div className={style}>
      <WsConnection.Provider value={WebSocketConnection}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Validation />}>
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route index element={<Opening />} />
            </Route>
            <Route path="/main" element={<Main />}>
              <Route path=":groupId" element={<Login />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </WsConnection.Provider>
    </div>
  );
}

export default App;
