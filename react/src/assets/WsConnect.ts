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
    ws.send(JSON.stringify({ type: 'initial', token: getCookie('token') }));
  };

  return ws;
}

function getCookie(name: string): string | undefined {
  // A function that gets the cookie name and returns its value if exists:
  const re = new RegExp(name + '=([^;]+)');
  const value = re.exec(document.cookie);
  return value != null ? unescape(value[1]) : undefined;
}
