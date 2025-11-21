import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Feed from './feed/Feed';
import FriendsList from './friends/FriendsList';
import ActivityDashboard from './activity/ActivityDashboard';
import GoalTracker from './goals/GoalTracker';
import Notifications from './notifications/Notifications';
import Communities from './groups/Communities';
import AdvancedAnalytics from './analytics/AdvancedAnalytics';
import ChatWidget from './chat/ChatWidget';

const Router = () => {
  const { user } = useAuth();
  const [currentView, setCurrentView] = useState('feed');

  // Handle hash-based routing
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash && [
        'feed', 'friends', 'activity', 'goals', 'notifications', 
        'communities', 'analytics', 'chat'
      ].includes(hash)) {
        setCurrentView(hash);
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  if (!user) return null;

  return (
    <>
      {currentView === 'feed' && <Feed />}
      {currentView === 'friends' && <FriendsList />}
      {currentView === 'activity' && <ActivityDashboard />}
      {currentView === 'goals' && <GoalTracker />}
      {currentView === 'notifications' && <Notifications />}
      {currentView === 'communities' && <Communities />}
      {currentView === 'analytics' && <AdvancedAnalytics />}
      {currentView === 'chat' && <div>Chat View - Coming Soon</div>}
      <ChatWidget />
    </>
  );
};

export default Router;
