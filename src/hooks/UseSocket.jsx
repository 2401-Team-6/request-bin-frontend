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
      socket.close(); // close our old websocket
    }

    let newSocket = new WebSocket(`ws:${location.host}/ws/${endpoint}`);
    newSocket.addEventListener('message', (message) => {
      newSocket.onmessage(message);
    });

    setSocket(newSocket);
  };

  return { connectSocket };
}
