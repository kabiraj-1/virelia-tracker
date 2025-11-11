import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Paperclip, Smile, MoreVertical } from 'lucide-react';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      const message = {
        id: Date.now(),
        text: newMessage,
        sender: 'You',
        timestamp: new Date(),
        isOwn: true
      };
      
      setMessages(prev => [...prev, message]);
      setNewMessage('');
      
      // Simulate reply
      setTimeout(() => {
        const reply = {
          id: Date.now() + 1,
          text: 'Thanks for your message!',
          sender: 'Support',
          timestamp: new Date(),
          isOwn: false
        };
        setMessages(prev => [...prev, reply]);
      }, 1000);
    }
  };

  const sampleMessages = [
    {
      id: 1,
      text: 'Hello! How can I help you today?',
      sender: 'Support',
      timestamp: new Date(Date.now() - 300000),
      isOwn: false
    }
  ];

  useEffect(() => {
    setMessages(sampleMessages);
  }, []);

  return (
    <motion.div 
      className="h-[calc(100vh-12rem)] bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Chat Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white font-semibold">
            S
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 dark:text-white">Support Team</h3>
            <p className="text-sm text-green-500">Online</p>
          </div>
        </div>
        <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <motion.div
            key={message.id}
            className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div
              className={`max-w-[70%] rounded-2xl p-4 ${
                message.isOwn
                  ? 'bg-primary-500 text-white rounded-br-none'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white rounded-bl-none'
              }`}
            >
              {!message.isOwn && (
                <div className="font-semibold text-sm mb-1">{message.sender}</div>
              )}
              <div className="text-sm">{message.text}</div>
              <div className={`text-xs mt-2 ${message.isOwn ? 'text-primary-100' : 'text-gray-500'}`}>
                {message.timestamp.toLocaleTimeString()}
              </div>
            </div>
          </motion.div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <form onSubmit={sendMessage} className="flex space-x-4">
          <div className="flex space-x-2">
            <button
              type="button"
              className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
            >
              <Paperclip className="w-5 h-5" />
            </button>
            <button
              type="button"
              className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
            >
              <Smile className="w-5 h-5" />
            </button>
          </div>
          
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="bg-primary-500 hover:bg-primary-600 disabled:bg-gray-400 text-white rounded-lg px-4 py-2 transition-colors flex items-center space-x-2"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </motion.div>
  );
};

export default Chat;