import React, { useState, useEffect, useRef } from 'react'
import { io } from 'socket.io-client'

const API_URL = import.meta.env.VITE_API_URL || 'https://virelia-tracker.onrender.com/api';

const ChatInterface = () => {
  const [selectedUser, setSelectedUser] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [users, setUsers] = useState([])
  const [socket, setSocket] = useState(null)
  const [typing, setTyping] = useState(false)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    // Connect to WebSocket
    const newSocket = io('https://virelia-tracker.onrender.com')
    setSocket(newSocket)

    const userData = JSON.parse(localStorage.getItem('user') || '{}')
    if (userData.id) {
      newSocket.emit('user_online', userData.id)
    }

    // Listen for new messages
    newSocket.on('new_message', (message) => {
      if (selectedUser && (
        message.from.id === selectedUser.id || 
        message.from._id === selectedUser.id ||
        message.to === userData.id
      )) {
        setMessages(prev => [...prev, message])
      }
    })

    // Listen for typing indicators
    newSocket.on('user_typing', (data) => {
      if (data.from === selectedUser?.id) {
        setTyping(data.typing)
      }
    })

    fetchUsers()

    return () => newSocket.close()
  }, [selectedUser])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${API_URL}/users`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await response.json()
      
      if (data.success) {
        setUsers(data.users)
      }
    } catch (error) {
      console.error('Error fetching users:', error)
    }
  }

  const fetchMessages = async (userId) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${API_URL}/messages/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await response.json()
      
      if (data.success) {
        setMessages(data.messages)
      }
    } catch (error) {
      console.error('Error fetching messages:', error)
    }
  }

  const handleUserSelect = (user) => {
    setSelectedUser(user)
    fetchMessages(user.id || user._id)
  }

  const sendMessage = async (e) => {
    e.preventDefault()
    
    if (!newMessage.trim() || !selectedUser) return

    const messageData = {
      from: JSON.parse(localStorage.getItem('user')).id,
      to: selectedUser.id || selectedUser._id,
      content: newMessage.trim()
    }

    if (socket) {
      socket.emit('send_message', messageData)
    }

    // Add message to local state immediately
    const tempMessage = {
      ...messageData,
      id: Date.now(),
      from: JSON.parse(localStorage.getItem('user')),
      createdAt: new Date()
    }
    setMessages(prev => [...prev, tempMessage])
    setNewMessage('')

    // Stop typing indicator
    if (socket) {
      socket.emit('typing', {
        from: messageData.from,
        to: messageData.to,
        typing: false
      })
    }
  }

  const handleTyping = (isTyping) => {
    if (socket && selectedUser) {
      socket.emit('typing', {
        from: JSON.parse(localStorage.getItem('user')).id,
        to: selectedUser.id || selectedUser._id,
        typing: isTyping
      })
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div style={{ 
      display: 'flex', 
      height: '600px',
      background: 'white',
      borderRadius: '0.75rem',
      overflow: 'hidden',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
      border: '1px solid #e2e8f0'
    }}>
      {/* Users List */}
      <div style={{ 
        width: '300px', 
        borderRight: '1px solid #e2e8f0',
        overflowY: 'auto'
      }}>
        <div style={{ padding: '1rem', borderBottom: '1px solid #e2e8f0' }}>
          <h3 style={{ margin: 0 }}>Messages</h3>
        </div>
        <div>
          {users.filter(user => {
            const currentUser = JSON.parse(localStorage.getItem('user') || '{}')
            return user.id !== currentUser.id && user._id !== currentUser.id
          }).map(user => (
            <div
              key={user.id || user._id}
              onClick={() => handleUserSelect(user)}
              style={{
                padding: '1rem',
                cursor: 'pointer',
                borderBottom: '1px solid #f1f5f9',
                background: selectedUser?.id === user.id || selectedUser?._id === user._id ? '#f8fafc' : 'transparent',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem'
              }}
            >
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: '#6366f1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 'bold'
              }}>
                {user.name?.charAt(0) || user.email?.charAt(0).toUpperCase()}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: '600' }}>{user.name || 'Unknown User'}</div>
                <div style={{ fontSize: '0.875rem', color: '#64748b' }}>
                  {user.online ? 'Online' : 'Offline'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {selectedUser ? (
          <>
            {/* Chat Header */}
            <div style={{ 
              padding: '1rem', 
              borderBottom: '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem'
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: '#6366f1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 'bold'
              }}>
                {selectedUser.name?.charAt(0) || selectedUser.email?.charAt(0).toUpperCase()}
              </div>
              <div>
                <div style={{ fontWeight: '600' }}>{selectedUser.name || 'Unknown User'}</div>
                <div style={{ fontSize: '0.875rem', color: '#64748b' }}>
                  {selectedUser.online ? 'Online' : 'Offline'}
                </div>
              </div>
            </div>

            {/* Messages */}
            <div style={{ 
              flex: 1, 
              padding: '1rem', 
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem'
            }}>
              {messages.map((message, index) => {
                const currentUser = JSON.parse(localStorage.getItem('user') || '{}')
                const isOwnMessage = message.from?.id === currentUser.id || message.from?._id === currentUser.id
                
                return (
                  <div
                    key={message.id || message._id || index}
                    style={{
                      alignSelf: isOwnMessage ? 'flex-end' : 'flex-start',
                      maxWidth: '70%',
                      padding: '0.75rem 1rem',
                      background: isOwnMessage ? '#6366f1' : '#f1f5f9',
                      color: isOwnMessage ? 'white' : '#1f2937',
                      borderRadius: '1rem',
                      borderBottomRightRadius: isOwnMessage ? '0.25rem' : '1rem',
                      borderBottomLeftRadius: isOwnMessage ? '1rem' : '0.25rem'
                    }}
                  >
                    <div>{message.content}</div>
                    <div style={{ 
                      fontSize: '0.75rem', 
                      opacity: 0.8,
                      marginTop: '0.25rem',
                      textAlign: isOwnMessage ? 'right' : 'left'
                    }}>
                      {new Date(message.createdAt).toLocaleTimeString()}
                    </div>
                  </div>
                )
              })}
              
              {typing && (
                <div style={{ alignSelf: 'flex-start' }}>
                  <div style={{
                    padding: '0.75rem 1rem',
                    background: '#f1f5f9',
                    borderRadius: '1rem',
                    borderBottomLeftRadius: '0.25rem',
                    fontStyle: 'italic',
                    color: '#64748b'
                  }}>
                    typing...
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <form onSubmit={sendMessage} style={{ padding: '1rem', borderTop: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => {
                    setNewMessage(e.target.value)
                    handleTyping(e.target.value.length > 0)
                  }}
                  placeholder="Type a message..."
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    fontSize: '1rem'
                  }}
                />
                <button 
                  type="submit" 
                  disabled={!newMessage.trim()}
                  className="btn btn-primary"
                >
                  Send
                </button>
              </div>
            </form>
          </>
        ) : (
          <div style={{ 
            flex: 1, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            color: '#64748b'
          }}>
            Select a user to start chatting
          </div>
        )}
      </div>
    </div>
  )
}

export default ChatInterface
