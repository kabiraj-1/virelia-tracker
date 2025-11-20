import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useNotifications } from '../../../contexts/NotificationContext';

const NotificationList = ({ onClose }) => {
  const { notifications, markAsRead } = useNotifications();

  return (
    <motion.div
      className="absolute top-full right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
    >
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <h3 className="font-semibold text-gray-800 dark:text-white">Notifications</h3>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      
      <div className="max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-4 text-center text-gray-500 dark:text-gray-400">
            No notifications
          </div>
        ) : (
          notifications.map((notification, index) => (
            <motion.div
              key={notification.id}
              className={`p-4 border-b border-gray-100 dark:border-gray-700 cursor-pointer ${
                !notification.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''
              }`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => markAsRead(notification.id)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium text-gray-800 dark:text-white">
                    {notification.title}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                    {notification.message}
                  </p>
                </div>
                {!notification.read && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                )}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                {new Date(notification.timestamp).toLocaleTimeString()}
              </div>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
};

export default NotificationList;