import React from 'react';
import { motion } from 'framer-motion';
import TrafficChart from '../components/Analytics/Charts/TrafficChart';
import EngagementChart from '../components/Analytics/Charts/EngagementChart';
import KarmaMetrics from '../components/Analytics/Metrics/KarmaMetrics';

const Analytics = () => {
  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            Analytics
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Track your performance and insights
          </p>
        </div>
      </div>

      {/* Karma Metrics */}
      <KarmaMetrics />

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TrafficChart />
        <EngagementChart />
      </div>
    </motion.div>
  );
};

export default Analytics;