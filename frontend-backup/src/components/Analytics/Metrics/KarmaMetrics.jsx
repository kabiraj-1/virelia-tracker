import React from 'react';
import { motion } from 'framer-motion';

const KarmaMetrics = () => {
  const karmaData = [
    { label: 'Total Karma', value: '1,247', icon: '‚≠ê', change: '+125' },
    { label: 'Weekly Gain', value: '89', icon: 'Ì≥à', change: '+12%' },
    { label: 'Leaderboard Rank', value: '#42', icon: 'ÌøÜ', change: '+5' },
    { label: 'Active Streak', value: '14 days', icon: 'Ì¥•', change: '+2' }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {karmaData.map((metric, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white p-4 rounded-lg shadow-md border-l-4 border-blue-500"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl">{metric.icon}</span>
            <span className={`text-sm font-semibold ${
              metric.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
            }`}>
              {metric.change}
            </span>
          </div>
          <p className="text-sm text-gray-600">{metric.label}</p>
          <p className="text-xl font-bold text-gray-900">{metric.value}</p>
        </motion.div>
      ))}
    </div>
  );
};

export default KarmaMetrics;
