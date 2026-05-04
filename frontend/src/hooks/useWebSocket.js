import { useState, useEffect, useRef, useCallback } from 'react';
import { WS_URL } from '../constants/fileTypes';

/**
 * WebSocket hook for live compression events
 */
export function useWebSocket(jobId) {
  const [events, setEvents] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [lastEvent, setLastEvent] = useState(null);
  const wsRef = useRef(null);
  const pingRef = useRef(null);

  const connect = useCallback(() => {
    if (!jobId) return;

    const ws = new WebSocket(`${WS_URL}/ws/${jobId}`);
    wsRef.current = ws;

    ws.onopen = () => {
      setIsConnected(true);
      // Ping every 25s to keep alive
      pingRef.current = setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send('ping');
        }
      }, 25000);
    };

    ws.onmessage = (e) => {
      try {
        const event = JSON.parse(e.data);
        if (event.type === 'pong') return;
        setEvents(prev => [...prev, event]);
        setLastEvent(event);
      } catch (err) {
        console.error('WS parse error:', err);
      }
    };

    ws.onclose = () => {
      setIsConnected(false);
      if (pingRef.current) clearInterval(pingRef.current);
    };

    ws.onerror = () => {
      setIsConnected(false);
    };
  }, [jobId]);

  const disconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    if (pingRef.current) {
      clearInterval(pingRef.current);
    }
  }, []);

  useEffect(() => {
    if (jobId) {
      connect();
    }
    return () => disconnect();
  }, [jobId, connect, disconnect]);

  return { events, isConnected, lastEvent, connect, disconnect };
}
