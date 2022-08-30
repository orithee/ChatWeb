import { toStr } from './auxiliaryFunc';

export function WsConnect() {
  let url: string = '';
  if (process.env.NODE_ENV === 'development') {
    url = 'ws://localhost:4000';
    console.log('development:', url);
  } else {
    url = window.location.origin.replace(/^http/, 'ws');
    console.log('production:', url);
  }

  let ws = new WebSocket(url);
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
