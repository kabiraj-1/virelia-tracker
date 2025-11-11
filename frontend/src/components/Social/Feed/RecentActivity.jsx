import React from 'react';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, Share2, MapPin, Award } from 'lucide-react';

const RecentActivity = () => {
  const activities = [
    {
      id: 1,
      user: { name: 'John Doe', avatar: 'JD' },
      action: 'earned 50 karma points',
      icon: Award,
      color: 'text-yellow-500',
      timestamp: '2 hours ago'
    },
    {
      id: 2,
      user: { name: 'Sarah Smith', avatar: 'SS' },
      action: 'shared a location',
      icon: MapPin,
      color: 'text-blue-500',
      timestamp: '4 hours ago'
    },
    {
      id: 3,
      user: { name: 'Mike Johnson', avatar: 'MJ' },
      action: 'reached level 5',
      icon: Award,
      color: 'text-green-500',
      timestamp: '1 day ago'
    }
  ];

  return (
    <motion.div 
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
        Recent Activity
      </h2>
      
      <div className="space-y-4">
        {activities.map((activity, index) => {
          const Icon = activity.icon;
          
          return (
            <motion.div
              key={activity.id}
              className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white font-semibold">
                {activity.user.avatar}
              </div>
              
              <div className="flex-1">
                <p className="text-gray-800 dark:text-white">
                  <span className="font-semibold">{activity.user.name}</span> {activity.action}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {activity.timestamp}
                </p>
              </div>
              
              <div className={`p-2 rounded-lg bg-gray-100 dark:bg-gray-700 ${activity.color}`}>
                <Icon className="w-4 h-4" />
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default RecentActivity;