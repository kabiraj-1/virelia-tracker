import React, { useState, useEffect } from 'react'
import { io } from 'socket.io-client'

const API_URL = import.meta.env.VITE_API_URL || 'https://virelia-tracker.onrender.com/api';

const Notifications = () => {
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [showDropdown, setShowDropdown] = useState(false)

  useEffect(() => {
    fetchNotifications()
    
    // Connect to WebSocket for real-time notifications
    const socket = io('https://virelia-tracker.onrender.com')
    
    // Listen for new notifications (you would need to implement this on backend)
    socket.on('new_notification', (notification) => {
      setNotifications(prev => [notification, ...prev])
      setUnreadCount(prev => prev + 1)
    })

    return () => socket.close()
  }, [])

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${API_URL}/notifications`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await response.json()
      
      if (data.success) {
        setNotifications(data.notifications)
        setUnreadCount(data.notifications.filter(n => !n.read).length)
      }
    } catch (error) {
      console.error('Error fetching notifications:', error)
    }
  }

  const markAsRead = async (notificationId) => {
    try {
      const token = localStorage.getItem('token')
      await fetch(`${API_URL}/notifications/${notificationId}/read`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      // Update local state
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId || notif._id === notificationId
            ? { ...notif, read: true }
            : notif
        )
      )
      setUnreadCount(prev => Math.max(0, prev - 1))
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }

  const markAllAsRead = async () => {
    try {
      const unreadNotifications = notifications.filter(n => !n.read)
      await Promise.all(
        unreadNotifications.map(notif => 
          markAsRead(notif.id || notif._id)
        )
      )
    } catch (error) {
      console.error('Error marking all as read:', error)
    }
  }

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'friend_request':
        return 'í±¥'
      case 'friend_accepted':
        return 'âœ…'
      case 'post_like':
        return 'â¤ï¸'
      case 'post_comment':
        return 'í²¬'
      case 'message':
        return 'í²Œ'
      default:
        return 'í´”'
    }
  }

  const getNotificationMessage = (notification) => {
    if (notification.message) return notification.message
    
    switch (notification.type) {
      case 'friend_request':
        return `${notification.fromUser?.name || 'Someone'} sent you a friend request`
      case 'friend_accepted':
        return `${notification.fromUser?.name || 'Someone'} accepted your friend request`
      case 'post_like':
        return `${notification.fromUser?.name || 'Someone'} liked your post`
      case 'post_comment':
        return `${notification.fromUser?.name || 'Someone'} commented on your post`
      case 'message':
        return `${notification.fromUser?.name || 'Someone'} sent you a message`
      default:
        return 'New notification'
    }
  }

  return (
    <div style={{ position: 'relative' }}>
      {/* Notification Bell */}
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        style={{
          background: 'none',
          border: 'none',
          fontSize: '1.5rem',
          cursor: 'pointer',
          position: 'relative',
          padding: '0.5rem'
        }}
      >
        í´”
        {unreadCount > 0 && (
          <span style={{
            position: 'absolute',
            top: '0',
            right: '0',
            background: '#ef4444',
            color: 'white',
            borderRadius: '50%',
            width: '18px',
            height: '18px',
            fontSize: '0.75rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notifications Dropdown */}
      {showDropdown && (
        <div style={{
          position: 'absolute',
          top: '100%',
          right: 0,
          width: '350px',
          background: 'white',
          border: '1px solid #e2e8f0',
          borderRadius: '0.5rem',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
          zIndex: 1000,
          maxHeight: '400px',
          overflowY: 'auto'
        }}>
          {/* Header */}
          <div style={{
            padding: '1rem',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <h4 style={{ margin: 0 }}>Notifications</h4>
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
          <div>
            {notifications.length === 0 ? (
              <div style={{ 
                padding: '2rem 1rem', 
                textAlign: 'center', 
                color: '#64748b' 
              }}>
                No notifications yet
              </div>
            ) : (
              notifications.map(notification => (
                <div
                  key={notification.id || notification._id}
                  style={{
                    padding: '1rem',
                    borderBottom: '1px solid #f1f5f9',
                    background: notification.read ? 'transparent' : '#f8fafc',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.75rem'
                  }}
                  onClick={() => markAsRead(notification.id || notification._id)}
                >
                  <div style={{ fontSize: '1.25rem' }}>
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ 
                      fontSize: '0.875rem',
                      fontWeight: notification.read ? 'normal' : '600'
                    }}>
                      {getNotificationMessage(notification)}
                    </div>
                    <div style={{ 
                      fontSize: '0.75rem', 
                      color: '#64748b',
                      marginTop: '0.25rem'
                    }}>
                      {new Date(notification.createdAt).toLocaleString()}
                    </div>
                  </div>
                  {!notification.read && (
                    <div style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: '#6366f1'
                    }} />
                  )}
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div style={{
              padding: '0.75rem 1rem',
              borderTop: '1px solid #e2e8f0',
              textAlign: 'center'
            }}>
              <button
                onClick={() => setShowDropdown(false)}
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
          )}
        </div>
      )}
    </div>
  )
}

export default Notifications
