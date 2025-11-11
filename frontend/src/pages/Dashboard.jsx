import React from 'react';
import { motion } from 'framer-motion';
import StatsOverview from '../components/Analytics/Dashboard/StatsOverview';
import QuickActions from '../components/Analytics/Dashboard/QuickActions';
import RecentActivity from '../components/Social/Feed/RecentActivity';

const Dashboard = () => {
  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Welcome to your Virelia Tracker dashboard
          </p>
        </div>
      </div>

      {/* Stats Overview */}
      <StatsOverview />

      {/* Quick Actions */}
      <QuickActions />

      {/* Recent Activity */}
      <RecentActivity />
    </motion.div>
  );
};

export default Dashboard;