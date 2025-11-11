import React from 'react';
import { TrendingUp, Award, Users, MapPin } from 'lucide-react';

const KarmaMetrics = ({ data = {} }) => {
  const {
    points = 0,
    level = 'bronze',
    rank = 0,
    progress = 0,
    nextLevel = 'silver',
    achievements = []
  } = data;

  const levelColors = {
    bronze: 'from-yellow-600 to-yellow-800',
    silver: 'from-gray-400 to-gray-600',
    gold: 'from-yellow-400 to-yellow-600',
    platinum: 'from-blue-400 to-purple-600'
  };

  const levelRequirements = {
    bronze: 0,
    silver: 100,
    gold: 500,
    platinum: 1000
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
        Karma Metrics
      </h3>

      {/* Level Badge */}
      <div className={`bg-gradient-to-r ${levelColors[level]} rounded-lg p-6 text-white mb-6`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm opacity-90">Current Level</p>
            <h4 className="text-2xl font-bold capitalize">{level}</h4>
            <p className="text-sm opacity-90 mt-1">{points} Karma Points</p>
          </div>
          <Award className="h-12 w-12 opacity-90" />
        </div>
        
        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex justify-between text-sm mb-1">
            <span>Progress to {nextLevel}</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-white bg-opacity-30 rounded-full h-2">
            <div 
              className="bg-white h-2 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-center">
          <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{rank}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Global Rank</p>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-center">
          <Users className="h-6 w-6 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {achievements.length}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Achievements</p>
        </div>
      </div>

      {/* Recent Achievements */}
      <div>
        <h5 className="font-medium text-gray-900 dark:text-white mb-3">
          Recent Achievements
        </h5>
        <div className="space-y-2">
          {achievements.slice(0, 3).map((achievement, index) => (
            <div key={index} className="flex items-center space-x-3 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <Award className="h-5 w-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {achievement.name}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  +{achievement.points} points
                </p>
              </div>
            </div>
          ))}
          
          {achievements.length === 0 && (
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
              No achievements yet. Start sharing locations to earn karma!
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default KarmaMetrics;