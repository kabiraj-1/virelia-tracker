import React from 'react';
import { motion } from 'framer-motion';
import { Users, MapPin, MessageCircle, TrendingUp } from 'lucide-react';

const StatsOverview = () => {
  const stats = [
    { 
      label: 'Total Users', 
      value: '1,250', 
      change: '+12%', 
      icon: Users,
      color: 'bg-blue-500'
    },
    { 
      label: 'Active Locations', 
      value: '89', 
      change: '+8%', 
      icon: MapPin,
      color: 'bg-green-500'
    },
    { 
      label: 'Messages Today', 
      value: '324', 
      change: '+15%', 
      icon: MessageCircle,
      color: 'bg-purple-500'
    },
    { 
      label: 'Karma Points', 
      value: '45,678', 
      change: '+22%', 
      icon: TrendingUp,
      color: 'bg-orange-500'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {stat.label}
              </p>
              <p className="text-2xl font-bold text-gray-800 dark:text-white mt-2">
                {stat.value}
              </p>
              <p className="text-sm text-green-500 dark:text-green-400 mt-1">
                {stat.change}
              </p>
            </div>
            <div className={`p-3 rounded-lg ${stat.color} text-white`}>
              <stat.icon className="w-6 h-6" />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default StatsOverview;