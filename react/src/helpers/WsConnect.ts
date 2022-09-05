import { toStr } from './auxiliaryFunc';

export function WsConnect() {
  // A function that starts the connection with the WebSocket:
  const URL = getUrlString();
  let ws = new WebSocket(URL);

  ws.onopen = () => {
    console.log('WebSocket connected successfully');
    ws.send(toStr({ type: 'initial', token: getToken() }));
  };

  ws.onclose = () => {
    console.log('WebSocket is closed!');
    if (process.env.NODE_ENV === 'development') {
      setTimeout(() => {
        document.location.reload();
      }, 2000);
    }
  };

  return ws;
}

function getToken(): string | undefined {
  // A function returns the token value if exists:
  const re = new RegExp('token=([^;]+)');
  const value = re.exec(document.cookie);
  return value != null ? unescape(value[1]) : undefined;
}

function getUrlString() {
  let URL: string = '';
  if (process.env.NODE_ENV === 'development') URL = 'ws://localhost:4000';
  else URL = window.location.origin.replace(/^http/, 'ws');
  return URL;
}
