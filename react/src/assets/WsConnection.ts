export function WsConnect() {
  let url: string = '';
  if (process.env.NODE_ENV === 'development') {
    url = 'ws://localhost:4000';
    console.log('development: ');
    console.log(url);
  } else {
    url = window.location.origin.replace(/^http/, 'ws');
    console.log('production:');
    console.log(url);
  }

  let ws = new WebSocket(url);
  console.log('WsConnect');

  ws.onopen = () => {
    console.log('WebSocket connected successfully');
    ws.send('Hello from client!');
  };

  return ws;
}
