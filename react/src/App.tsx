import style from './App.module.scss';
import Validation from './components/validation/Validation';
import Main from './components/main/Main';
import Login from './components/login/Login';
import Register from './components/register/Register';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { WsConnect } from './assets/WsConnect';
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useSelector, useDispatch } from 'react-redux';
import { messageFilter } from './app/messageFilter';
import { globalState } from './app/store';

// TODO: Merge the default with the value in the provider.
// TODO: Improve the message - reduce the times the components renders -
//       Need to separate the CreateContext to useStates in App component -
//       That all children under app will change only when the message is relevant to them..
// TODO: Understand all code in wsConnect. especially the RegExp...

const WebSocketConnection = WsConnect();
export const WsConnection = React.createContext<WebSocket>(WebSocketConnection);

function App() {
  const [userName, currentMessage] = useSelector((state: globalState) => [
    state.global.userName,
    state.global.message,
  ]);

  const dispatch = useDispatch();
  console.log('userName: ', userName);
  console.log('currentMessage: ', currentMessage);

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
            </Route>
            <Route path="/main" element={<Main />}></Route>
          </Routes>
        </BrowserRouter>
        {/* TODO: If the user after authentication: changes location to "/main"
                Else: changes location to "/login || /register..."
      */}
      </WsConnection.Provider>
    </div>
  );
}

export default App;
