import { useState, useEffect, useCallback } from 'react';
import { useSocket } from './useSocket';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const { socket } = useSocket();

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    loadNotifications();
    setupSocketListeners();
  }, [socket]);

  const loadNotifications = async () => {
    try {
      const response = await fetch('/api/notifications?limit=50', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      const data = await response.json();
      
      if (data.success) {
        setNotifications(data.notifications);
      }
    } catch (error) {
      console.error('Failed to load notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const setupSocketListeners = () => {
    if (!socket) return;

    socket.on('new_notification', (notification) => {
      setNotifications(prev => [notification, ...prev]);
    });

    socket.on('notification_read', (data) => {
      setNotifications(prev => 
        prev.map(notif => 
          notif._id === data.notificationId 
            ? { ...notif, read: true }
            : notif
        )
      );
    });

    return () => {
      socket.off('new_notification');
      socket.off('notification_read');
    };
  };

  const markAsRead = async (notificationId) => {
    try {
      await fetch(`/api/notifications/${notificationId}/read`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });

      setNotifications(prev =>
        prev.map(notif =>
          notif._id === notificationId ? { ...notif, read: true } : notif
        )
      );
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await fetch('/api/notifications/read-all', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });

      setNotifications(prev =>
        prev.map(notif => ({ ...notif, read: true }))
      );
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      await fetch(`/api/notifications/${notificationId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });

      setNotifications(prev => prev.filter(notif => notif._id !== notificationId));
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

  return {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refreshNotifications: loadNotifications
  };
};