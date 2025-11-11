import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../../contexts/AuthContext';
import LeaderboardCard from './LeaderboardCard';
import RankingSystem from './RankingSystem';
import { Trophy, Medal, Crown, Search, Filter } from 'lucide-react';

const GlobalLeaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentUserRank, setCurrentUserRank] = useState(null);
  
  const { user } = useAuth();

  useEffect(() => {
    loadLeaderboard();
  }, [timeRange]);

  const loadLeaderboard = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/karma/leaderboard?range=${timeRange}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      const data = await response.json();
      
      if (data.success) {
        setLeaderboard(data.leaderboard);
        setCurrentUserRank(data.currentUserRank);
      }
    } catch (error) {
      console.error('Failed to load leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredLeaderboard = leaderboard.filter(entry =>
    entry.user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    entry.user.profile?.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    entry.user.profile?.lastName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <Crown className="h-6 w-6 text-yellow-500" />;
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />;
      case 3:
        return <Medal className="h-6 w-6 text-amber-600" />;
      default:
        return <Trophy className="h-5 w-5 text-blue-500" />;
    }
  };

  const getRankColor = (rank) => {
    switch (rank) {
      case 1:
        return 'from-yellow-400 to-yellow-600';
      case 2:
        return 'from-gray-300 to-gray-500';
      case 3:
        return 'from-amber-500 to-amber-700';
      default:
        return 'from-blue-500 to-blue-700';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          Global Leaderboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Compete with users worldwide and climb the ranks through active location sharing and engagement
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="flex items-center space-x-4">
          {/* Time Range Filter */}
          <div className="flex items-center space-x-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 px-3 py-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select 
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="bg-transparent border-none text-sm focus:outline-none focus:ring-0"
            >
              <option value="24h">Today</option>
              <option value="7d">This Week</option>
              <option value="30d">This Month</option>
              <option value="all">All Time</option>
            </select>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>

        <RankingSystem />
      </div>

      {/* Top 3 Podium */}
      {filteredLeaderboard.length >= 3 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* 2nd Place */}
          {filteredLeaderboard[1] && (
            <div className="transform scale-95 opacity-90">
              <LeaderboardCard
                entry={filteredLeaderboard[1]}
                rank={2}
                icon={getRankIcon(2)}
                gradient={getRankColor(2)}
              />
            </div>
          )}

          {/* 1st Place */}
          {filteredLeaderboard[0] && (
            <div className="transform scale-105">
              <LeaderboardCard
                entry={filteredLeaderboard[0]}
                rank={1}
                icon={getRankIcon(1)}
                gradient={getRankColor(1)}
              />
            </div>
          )}

          {/* 3rd Place */}
          {filteredLeaderboard[2] && (
            <div className="transform scale-95 opacity-90">
              <LeaderboardCard
                entry={filteredLeaderboard[2]}
                rank={3}
                icon={getRankIcon(3)}
                gradient={getRankColor(3)}
              />
            </div>
          )}
        </div>
      )}

      {/* Leaderboard List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600 text-sm font-medium text-gray-600 dark:text-gray-400">
          <div className="col-span-1">Rank</div>
          <div className="col-span-5">User</div>
          <div className="col-span-2 text-center">Karma</div>
          <div className="col-span-2 text-center">Level</div>
          <div className="col-span-2 text-center">Locations</div>
        </div>

        {/* Leaderboard Items */}
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {filteredLeaderboard.slice(3).map((entry, index) => (
            <div
              key={entry.user._id}
              className={`grid grid-cols-12 gap-4 px-6 py-4 items-center transition-colors hover:bg-gray-50 dark:hover:bg-gray-750 ${
                entry.user._id === user?.id ? 'bg-primary-50 dark:bg-primary-900/20 border-l-4 border-primary-500' : ''
              }`}
            >
              <div className="col-span-1">
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {index + 4}
                  </span>
                  {index < 7 && getRankIcon(index + 4)}
                </div>
              </div>

              <div className="col-span-5">
                <div className="flex items-center space-x-3">
                  <img
                    src={entry.user.profile?.avatar || `/api/placeholder/40/40`}
                    alt={entry.user.username}
                    className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-600"
                  />
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {entry.user.username}
                      {entry.user._id === user?.id && (
                        <span className="ml-2 text-xs bg-primary-100 dark:bg-primary-800 text-primary-800 dark:text-primary-200 px-2 py-1 rounded-full">
                          You
                        </span>
                      )}
                    </div>
                    {entry.user.profile?.firstName && (
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {entry.user.profile.firstName} {entry.user.profile.lastName}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="col-span-2 text-center">
                <span className="font-bold text-gray-900 dark:text-white">
                  {entry.karma.points.toLocaleString()}
                </span>
              </div>

              <div className="col-span-2 text-center">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium capitalize ${
                  entry.karma.level === 'platinum' ? 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200' :
                  entry.karma.level === 'gold' ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200' :
                  entry.karma.level === 'silver' ? 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200' :
                  'bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200'
                }`}>
                  {entry.karma.level}
                </span>
              </div>

              <div className="col-span-2 text-center">
                <span className="text-gray-900 dark:text-white">
                  {entry.stats?.totalLocations?.toLocaleString() || 0}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Current User Rank */}
      {currentUserRank && (
        <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Your Ranking</h3>
              <p className="opacity-90">
                You are ranked <strong>#{currentUserRank.rank}</strong> globally with{' '}
                <strong>{currentUserRank.points.toLocaleString()}</strong> karma points
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">#{currentUserRank.rank}</div>
              <div className="text-sm opacity-90 capitalize">{currentUserRank.level}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GlobalLeaderboard;