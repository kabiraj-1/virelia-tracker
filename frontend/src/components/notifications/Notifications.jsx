import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const Notifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  // Mock notifications data
  useEffect(() => {
    const mockNotifications = [
      {
        id: 1,
        type: 'friend_request',
        title: 'New Friend Request',
        message: 'Alex Johnson sent you a friend request',
        timestamp: '2 minutes ago',
        read: false,
        action: 'accept'
      },
      {
        id: 2,
        type: 'goal_like',
        title: 'Goal Liked',
        message: 'Sarah Chen liked your "Morning Meditation" goal',
        timestamp: '1 hour ago',
        read: false,
        action: 'view'
      },
      {
        id: 3,
        type: 'comment',
        title: 'New Comment',
        message: 'Mike commented on your progress post',
        timestamp: '3 hours ago',
        read: true,
        action: 'reply'
      },
      {
        id: 4,
        type: 'achievement',
        title: 'Achievement Unlocked!',
        message: 'You earned the "7-Day Streak" badge!',
        timestamp: '1 day ago',
        read: true,
        action: 'share'
      }
    ];

    setNotifications(mockNotifications);
    setUnreadCount(mockNotifications.filter(n => !n.read).length);
  }, []);

  const markAsRead = (notificationId) => {
    setNotifications(notifications.map(notification =>
      notification.id === notificationId 
        ? { ...notification, read: true }
        : notification
    ));
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({
      ...notification,
      read: true
    })));
    setUnreadCount(0);
  };

  const handleNotificationAction = (notification) => {
    markAsRead(notification.id);
    
    switch (notification.action) {
      case 'accept':
        alert(`Accepted friend request from ${notification.message.split(' ')[0]}`);
        break;
      case 'view':
        window.location.hash = 'goals';
        break;
      case 'reply':
        // Focus on comment input
        break;
      case 'share':
        alert('Shared your achievement!');
        break;
      default:
        break;
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'friend_request': return 'Ì±•';
      case 'goal_like': return '‚ù§Ô∏è';
      case 'comment': return 'Ì≤¨';
      case 'achievement': return 'ÌøÜ';
      default: return 'Ì¥î';
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      {/* Notification Bell */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          background: 'none',
          border: 'none',
          color: 'white',
          fontSize: '1.5rem',
          cursor: 'pointer',
          position: 'relative',
          padding: '0.5rem'
        }}
      >
        Ì¥î
        {unreadCount > 0 && (
          <span style={{
            position: 'absolute',
            top: '0',
            right: '0',
            background: '#e53e3e',
            color: 'white',
            borderRadius: '50%',
            width: '18px',
            height: '18px',
            fontSize: '0.75rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold'
          }}>
            {unreadCount}
          </span>
        )}
      </button>

      {/* Notifications Dropdown */}
      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          right: '0',
          width: '400px',
          maxHeight: '500px',
          background: '#2d3748',
          border: '1px solid #4a5568',
          borderRadius: '0.5rem',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)',
          zIndex: 1000,
          overflow: 'hidden'
        }}>
          {/* Header */}
          <div style={{
            padding: '1rem',
            background: '#1a202c',
            borderBottom: '1px solid #4a5568',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <h3 style={{ margin: 0, color: 'white' }}>Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#6366f1',
                  cursor: 'pointer',
                  fontSize: '0.875rem'
                }}
              >
                Mark all as read
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div style={{
            maxHeight: '400px',
            overflowY: 'auto'
          }}>
            {notifications.length === 0 ? (
              <div style={{
                padding: '2rem',
                textAlign: 'center',
                color: '#a0aec0'
              }}>
                No notifications
              </div>
            ) : (
              notifications.map(notification => (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationAction(notification)}
                  style={{
                    padding: '1rem',
                    borderBottom: '1px solid #4a5568',
                    background: notification.read ? 'transparent' : '#4a5568',
                    cursor: 'pointer',
                    transition: 'background 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = '#4a5568';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = notification.read ? 'transparent' : '#4a5568';
                  }}
                >
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      background: '#6366f1',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.2rem',
                      flexShrink: 0
                    }}>
                      {getNotificationIcon(notification.type)}
                    </div>
                    
                    <div style={{ flex: 1 }}>
                      <div style={{ 
                        fontWeight: 'bold', 
                        color: 'white',
                        marginBottom: '0.25rem'
                      }}>
                        {notification.title}
                      </div>
                      <div style={{ 
                        color: '#a0aec0', 
                        fontSize: '0.875rem',
                        marginBottom: '0.5rem'
                      }}>
                        {notification.message}
                      </div>
                      <div style={{ 
                        color: '#718096', 
                        fontSize: '0.75rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <span>{notification.timestamp}</span>
                        {!notification.read && (
                          <span style={{
                            width: '8px',
                            height: '8px',
                            background: '#6366f1',
                            borderRadius: '50%'
                          }}></span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div style={{
            padding: '1rem',
            background: '#1a202c',
            borderTop: '1px solid #4a5568',
            textAlign: 'center'
          }}>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: 'none',
                border: 'none',
                color: '#6366f1',
                cursor: 'pointer',
                fontSize: '0.875rem'
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notifications;
