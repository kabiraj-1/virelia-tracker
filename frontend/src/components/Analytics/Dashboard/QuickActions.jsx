import React from 'react';
import { motion } from 'framer-motion';
import { Share2, Map, MessageSquare, Users, Settings, Bell } from 'lucide-react';

const QuickActions = () => {
  const actions = [
    { 
      icon: Share2, 
      label: 'Share Location', 
      description: 'Start sharing your location with friends',
      color: 'bg-blue-500',
      path: '/location'
    },
    { 
      icon: MessageSquare, 
      label: 'Start Chat', 
      description: 'Send messages to your contacts',
      color: 'bg-green-500',
      path: '/chat'
    },
    { 
      icon: Users, 
      label: 'View Analytics', 
      description: 'Check your activity insights',
      color: 'bg-purple-500',
      path: '/analytics'
    },
    { 
      icon: Settings, 
      label: 'Settings', 
      description: 'Configure your preferences',
      color: 'bg-gray-500',
      path: '/profile'
    }
  ];

  return (
    <motion.div 
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
        Quick Actions
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {actions.map((action, index) => {
          const Icon = action.icon;
          
          return (
            <motion.button
              key={action.label}
              className="flex items-center space-x-4 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-primary-500 dark:hover:border-primary-500 transition-colors text-left"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => window.location.href = action.path}
            >
              <div className={`p-3 rounded-lg ${action.color} text-white`}>
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 dark:text-white">
                  {action.label}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {action.description}
                </p>
              </div>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
};

export default QuickActions;