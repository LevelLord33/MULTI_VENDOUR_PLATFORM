import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { useSocket } from './SocketContext';
import { useToast } from './ToastContext';
import { api } from '../services/api';

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const { user } = useAuth();
  const { socket } = useSocket();
  const { addToast } = useToast();

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [pushPermission, setPushPermission] = useState(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      return Notification.permission;
    }
    return 'default';
  });
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);

  // 1. Service Worker & PWA Installability Registration
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
          navigator.serviceWorker
            .register('/sw.js')
            .then((reg) => {
              console.log('✅ [PWA] Service Worker registered with scope:', reg.scope);
            })
            .catch((err) => {
              console.warn('⚠️ [PWA] Service Worker registration failed:', err);
            });
        });
      }

      const handleBeforeInstall = (e) => {
        e.preventDefault();
        setDeferredPrompt(e);
        setIsInstallable(true);
      };

      window.addEventListener('beforeinstallprompt', handleBeforeInstall);

      return () => {
        window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      };
    }
  }, []);

  // 2. Fetch Notifications on User Change
  const fetchNotifications = useCallback(async () => {
    if (!user?.id) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    try {
      const res = await api.getNotifications();
      if (res?.success && Array.isArray(res.notifications)) {
        setNotifications(res.notifications);
        setUnreadCount(res.unreadCount || res.notifications.filter((n) => !n.isRead).length);
      }
    } catch (err) {
      console.warn('Error fetching notifications:', err.message);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // 3. Socket.IO Real-time Notification Listener
  useEffect(() => {
    if (!socket || !user) return;

    const handleNewNotification = (notif) => {
      setNotifications((prev) => [notif, ...prev]);
      setUnreadCount((prev) => prev + 1);

      // In-app toast alert
      addToast(notif.title + ' — ' + notif.message, 'info');

      // Native Web Push Notification (Desktop / Mobile)
      if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
        try {
          if (navigator.serviceWorker && navigator.serviceWorker.controller) {
            navigator.serviceWorker.controller.postMessage({
              type: 'SHOW_NOTIFICATION',
              payload: notif
            });
          } else {
            new Notification(notif.title, {
              body: notif.message,
              icon: '/favicon.svg',
              tag: notif.id
            });
          }
        } catch (e) {
          console.warn('Desktop notification error:', e);
        }
      }
    };

    socket.on('new_notification', handleNewNotification);

    return () => {
      socket.off('new_notification', handleNewNotification);
    };
  }, [socket, user, addToast]);

  // 4. Request Push Notification Permission
  const requestPushPermission = async () => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      addToast('Push notifications are not supported in this browser.', 'warning');
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      setPushPermission(permission);
      if (permission === 'granted') {
        addToast('Push notifications enabled successfully! 🔔', 'success');
        return true;
      } else {
        addToast('Notification permission was not granted.', 'info');
        return false;
      }
    } catch (e) {
      return false;
    }
  };

  // 5. Trigger PWA App Installation
  const promptInstallPwa = async () => {
    if (!deferredPrompt) return false;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstallable(false);
      setDeferredPrompt(null);
      addToast('Vendor Hub installed to home screen! 🚀', 'success');
      return true;
    }
    return false;
  };

  // 6. Mark Notification Read
  const markAsRead = async (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
    await api.markNotificationRead(id);
  };

  // 7. Mark All Read
  const markAllAsRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setUnreadCount(0);
    await api.markAllNotificationsRead();
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        pushPermission,
        requestPushPermission,
        isInstallable,
        promptInstallPwa,
        markAsRead,
        markAllAsRead,
        refreshNotifications: fetchNotifications
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}
