import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { SocketContext } from "./SocketContext.jsx";

export const NotificationContext = createContext(null);

let idCounter = 0;
function nextId() {
  idCounter += 1;
  return `notif_${Date.now()}_${idCounter}`;
}

export function NotificationProvider({ children }) {
  const { socket } = useContext(SocketContext);
  const [notifications, setNotifications] = useState([]);
  const [toasts, setToasts] = useState([]);
  const timersRef = useRef(new Map());

  const pushNotification = useCallback((type, message, data) => {
    const notification = { id: nextId(), type, message, data, read: false, createdAt: new Date().toISOString() };
    setNotifications((prev) => [notification, ...prev].slice(0, 100));
    return notification.id;
  }, []);

  const pushToast = useCallback((message, variant = "info") => {
    const id = nextId();
    setToasts((prev) => [...prev, { id, message, variant }]);
    const timer = setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
      timersRef.current.delete(id);
    }, 5000);
    timersRef.current.set(id, timer);
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    const timer = timersRef.current.get(id);
    if (timer) clearTimeout(timer);
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const markRead = useCallback((id) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }, []);

  useEffect(() => {
    return () => {
      timersRef.current.forEach((timer) => clearTimeout(timer));
      timersRef.current.clear();
    };
  }, []);

  // Global, connection-level notifications that aren't tied to a specific
  // game screen (per-game events are handled by useGameSocket instead).
  useEffect(() => {
    if (!socket) return undefined;

    const handleMatched = () => {
      pushNotification("MATCH_FOUND", "A match has been found! Head to the lobby.");
      pushToast("Match found — teams are forming!", "success");
    };

    socket.on("matchmaking:matched", handleMatched);
    return () => {
      socket.off("matchmaking:matched", handleMatched);
    };
  }, [socket, pushNotification, pushToast]);

  const unreadCount = useMemo(() => notifications.filter((n) => !n.read).length, [notifications]);

  const value = useMemo(
    () => ({ notifications, unreadCount, toasts, pushNotification, pushToast, dismissToast, markAllRead, markRead }),
    [notifications, unreadCount, toasts, pushNotification, pushToast, dismissToast, markAllRead, markRead]
  );

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
}
