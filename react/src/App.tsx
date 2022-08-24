import { useEffect, useState } from 'react';
import style from './App.module.scss';
import Validation from './components/validation/Validation';
import Main from './components/main/Main';
import Login from './components/login/Login';
import Register from './components/register/Register';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { WsConnect } from './assets/WsConnect';
import React from 'react';

// TODO: Merge the default with the value in the provider.
const WebSocketConnection = WsConnect();
export const WsConnection = React.createContext<WebSocket>(WebSocketConnection);

function App() {
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
