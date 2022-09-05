import style from './App.module.scss';
import Home from './components/Home/Home';
import Main from './components/Main/Main';
import Login from './components/Home/Login/Login';
import Register from './components/Home/Register/Register';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { WsConnect } from './helpers/WsConnect';
import React, { useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useSelector, useDispatch } from 'react-redux';
import messageFilter from './helpers/messageFilter';
import { globalState } from './redux/store';
import Opening from './components/Home/Opening/Opening';
import Chat from './components/Chat/Chat';

// TODO: Improve the message - reduce the times the components renders -
//       Need to separate the CreateContext to useStates in App component -
//       That all children under app will change only when the message is relevant to them..

const WebSocketConnection = WsConnect();
export const WsConnection = React.createContext<WebSocket>(WebSocketConnection);

function App() {
  const dispatch = useDispatch();

  const user = useSelector((state: globalState) => state.global.user);
  const message = useSelector((state: globalState) => state.global.message);

  useEffect(() => {
    console.log('user connected: ', user?.user_name || undefined);
  }, [user]);

  useEffect(() => {
    console.log('current message: ', message);
  }, [message]);

  WebSocketConnection.onmessage = (event) => {
    messageFilter(event, dispatch, user);
  };

  return (
    <div className={style}>
      <WsConnection.Provider value={WebSocketConnection}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />}>
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route index element={<Opening />} />
            </Route>
            <Route path="/main" element={<Main />}>
              <Route path=":groupId" element={<Chat />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </WsConnection.Provider>
    </div>
  );
}

export default App;
