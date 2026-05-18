import { createContext, useContext, useState, useCallback } from "react";

export interface AppNotification {
  id: string;
  type: "booking" | "enquiry" | "status" | "review" | "info";
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
}

interface NotificationContextValue {
  notifications: AppNotification[];
  unreadCount: number;
  addNotification: (n: Omit<AppNotification, "id" | "read" | "createdAt">) => void;
  markAllRead: () => void;
  markRead: (id: string) => void;
  dismiss: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextValue | null>(null);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<AppNotification[]>([
    {
      id: "welcome",
      type: "info",
      title: "Welcome to Book My Squad!",
      message: "Discover India's finest wedding vendors and venues. Start exploring.",
      read: false,
      createdAt: new Date(),
    },
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const addNotification = useCallback((n: Omit<AppNotification, "id" | "read" | "createdAt">) => {
    setNotifications(prev => [
      { ...n, id: Date.now().toString(), read: false, createdAt: new Date() },
      ...prev,
    ].slice(0, 20));
  }, []);

  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  const markRead   = (id: string) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  const dismiss    = (id: string) => setNotifications(prev => prev.filter(n => n.id !== id));

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, addNotification, markAllRead, markRead, dismiss }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error("useNotifications must be used within NotificationProvider");
  return ctx;
}
