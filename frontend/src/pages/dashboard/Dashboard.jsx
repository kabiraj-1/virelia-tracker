import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUpIcon, 
  UsersIcon, 
  TargetIcon, 
  MapIcon,
  CalendarIcon,
  ClockIcon,
  AwardIcon,
  ActivityIcon 
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';
import ActivityFeed from '../../components/dashboard/ActivityFeed';
import StatsCard from '../../components/dashboard/StatsCard';
import GoalProgress from '../../components/dashboard/GoalProgress';
import RecentActivity from '../../components/dashboard/RecentActivity';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalFriends: 0,
    activeGoals: 0,
    completedTasks: 0,
    distanceTraveled: 0
  });
  
  const [goals, setGoals] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);

  useEffect(() => {
    // Fetch dashboard data
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Mock data - replace with actual API calls
      setStats({
        totalFriends: 24,
        activeGoals: 5,
        completedTasks: 128,
        distanceTraveled: 245
      });

      setGoals([
        { id: 1, title: 'Daily Steps', target: 10000, current: 7542, color: '#10b981' },
        { id: 2, title: 'Weekly Workout', target: 5, current: 3, color: '#3b82f6' },
        { id: 3, title: 'Meditation Streak', target: 30, current: 15, color: '#f59e0b' },
      ]);

      setRecentActivities([
        { id: 1, user: 'Alex Johnson', action: 'completed a goal', time: '2 hours ago', type: 'goal' },
        { id: 2, user: 'Sarah Miller', action: 'shared their location', time: '4 hours ago', type: 'location' },
        { id: 3, user: 'Mike Wilson', action: 'sent you a friend request', time: '1 day ago', type: 'friend' },
        { id: 4, user: 'Emma Davis', action: 'commented on your post', time: '2 days ago', type: 'social' },
      ]);
    } catch (error) {
      toast.error('Failed to load dashboard data');
    }
  };

  return (
    <div className="dashboard">
      <motion.div 
        className="dashboard-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="welcome-section">
          <h1>Welcome back, {user?.name?.split(' ')[0] || 'User'}! 👋</h1>
          <p className="welcome-subtitle">Here's what's happening with your fitness journey today</p>
        </div>
        <div className="date-info">
          <CalendarIcon size={20} />
          <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>
      </motion.div>

      <div className="stats-grid">
        <StatsCard
          title="Total Friends"
          value={stats.totalFriends}
          icon={<UsersIcon size={24} />}
          color="#667eea"
          change="+12%"
        />
        <StatsCard
          title="Active Goals"
          value={stats.activeGoals}
          icon={<TargetIcon size={24} />}
          color="#10b981"
          change="+3"
        />
        <StatsCard
          title="Completed Tasks"
          value={stats.completedTasks}
          icon={<AwardIcon size={24} />}
          color="#f59e0b"
          change="+24"
        />
        <StatsCard
          title="Distance (km)"
          value={stats.distanceTraveled}
          icon={<MapIcon size={24} />}
          color="#f687b3"
          change="+5.2km"
        />
      </div>

      <div className="dashboard-content">
        <div className="main-column">
          <GoalProgress goals={goals} />
          <RecentActivity activities={recentActivities} />
        </div>
        <div className="sidebar-column">
          <ActivityFeed />
          
          <motion.div 
            className="quick-actions card"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h3>Quick Actions</h3>
            <div className="actions-grid">
              <button className="action-btn">
                <ActivityIcon size={20} />
                <span>Start Activity</span>
              </button>
              <button className="action-btn">
                <TargetIcon size={20} />
                <span>Set Goal</span>
              </button>
              <button className="action-btn">
                <UsersIcon size={20} />
                <span>Add Friend</span>
              </button>
              <button className="action-btn">
                <MapIcon size={20} />
                <span>Share Location</span>
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;