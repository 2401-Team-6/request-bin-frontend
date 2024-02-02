import { useState, useEffect } from 'react';

export default function useSocket(requests, setRequests) {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!socket) {
      return;
    }

    socket.onmessage = (message) =>
      setRequests([JSON.parse(message.data), ...requests]);
  }, [socket, requests, setRequests]);

  const connectSocket = (endpoint) => {
    if (socket) {
      clearInterval(socket.interval);
      socket.close(); // close our old websocket
    }

    let newSocket = new WebSocket(`wss:${location.host}/ws/${endpoint}`);
    newSocket.interval = setInterval(() => {
      newSocket.send('ping');
    }, 25000);

    newSocket.addEventListener('message', (message) => {
      newSocket.onmessage(message);
    });

    setSocket(newSocket);
  };

  return { connectSocket };
}
