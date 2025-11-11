import React, { useState, useEffect, useRef } from 'react';
import { useSocket } from '../../../../hooks/useSocket';
import { useAuth } from '../../../../contexts/AuthContext';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import MediaUpload from './MediaUpload';
import { Users, Video, Phone, MoreVertical } from 'lucide-react';

const ChatRoom = ({ roomId, roomName = 'General Chat', participants = [] }) => {
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [typingUsers, setTypingUsers] = useState([]);
  const [showMediaUpload, setShowMediaUpload] = useState(false);
  
  const { socket } = useSocket();
  const { user } = useAuth();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!socket || !roomId) return;

    // Join room
    socket.emit('join_room', { roomId });

    // Load message history
    loadMessageHistory();

    // Socket event listeners
    socket.on('message_received', handleNewMessage);
    socket.on('user_typing', handleUserTyping);
    socket.on('user_stop_typing', handleUserStopTyping);
    socket.on('user_joined', handleUserJoined);
    socket.on('user_left', handleUserLeft);
    socket.on('connect', () => setIsConnected(true));
    socket.on('disconnect', () => setIsConnected(false));

    return () => {
      socket.off('message_received', handleNewMessage);
      socket.off('user_typing', handleUserTyping);
      socket.off('user_stop_typing', handleUserStopTyping);
      socket.off('user_joined', handleUserJoined);
      socket.off('user_left', handleUserLeft);
      socket.emit('leave_room', { roomId });
    };
  }, [socket, roomId]);

  const loadMessageHistory = async () => {
    try {
      const response = await fetch(`/api/chat/messages/${roomId}?limit=50`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      const data = await response.json();
      
      if (data.success) {
        setMessages(data.messages);
      }
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  };

  const handleNewMessage = (message) => {
    setMessages(prev => [...prev, message]);
    scrollToBottom();
  };

  const handleUserTyping = (data) => {
    if (data.userId !== user.id) {
      setTypingUsers(prev => {
        if (!prev.includes(data.username)) {
          return [...prev, data.username];
        }
        return prev;
      });
    }
  };

  const handleUserStopTyping = (data) => {
    setTypingUsers(prev => prev.filter(username => username !== data.username));
  };

  const handleUserJoined = (data) => {
    // Add system message for user join
    const systemMessage = {
      _id: `system-${Date.now()}`,
      type: 'system',
      content: `${data.username} joined the chat`,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, systemMessage]);
  };

  const handleUserLeft = (data) => {
    // Add system message for user leave
    const systemMessage = {
      _id: `system-${Date.now()}`,
      type: 'system',
      content: `${data.username} left the chat`,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, systemMessage]);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = (content, type = 'text') => {
    if (!socket || !content.trim()) return;

    const message = {
      roomId,
      content: content.trim(),
      type,
      timestamp: new Date()
    };

    socket.emit('send_message', message);
  };

  const startVideoCall = () => {
    // Emit event to start video call
    socket.emit('start_video_call', { roomId });
  };

  const startVoiceCall = () => {
    // Emit event to start voice call
    socket.emit('start_voice_call', { roomId });
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-sm">
                {roomName.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {roomName}
            </h3>
            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
              <Users className="h-4 w-4" />
              <span>{participants.length} participants</span>
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span>{isConnected ? 'Connected' : 'Disconnected'}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Voice Call Button */}
          <button
            onClick={startVoiceCall}
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title="Start Voice Call"
          >
            <Phone className="h-5 w-5" />
          </button>

          {/* Video Call Button */}
          <button
            onClick={startVideoCall}
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title="Start Video Call"
          >
            <Video className="h-5 w-5" />
          </button>

          {/* More Options */}
          <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
            <MoreVertical className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-hidden">
        <MessageList 
          messages={messages} 
          typingUsers={typingUsers}
        />
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <MessageInput 
        onSendMessage={sendMessage}
        onTypingStart={() => socket?.emit('typing_start', { roomId })}
        onTypingStop={() => socket?.emit('typing_stop', { roomId })}
        onMediaUpload={() => setShowMediaUpload(true)}
      />

      {/* Media Upload Modal */}
      {showMediaUpload && (
        <MediaUpload
          onClose={() => setShowMediaUpload(false)}
          onUpload={(fileUrl, fileType) => {
            sendMessage(fileUrl, fileType);
            setShowMediaUpload(false);
          }}
        />
      )}
    </div>
  );
};

export default ChatRoom;