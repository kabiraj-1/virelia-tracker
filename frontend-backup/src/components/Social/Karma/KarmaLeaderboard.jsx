import React from 'react';
import { useKarma } from '../../../hooks/useKarma';

const KarmaLeaderboard = () => {
  const { leaderboard, loading, error } = useKarma();

  if (loading) return <div className="text-center py-4">Loading leaderboard...</div>;
  if (error) return <div className="text-center py-4 text-red-500">Error: {error}</div>;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Karma Leaderboard</h2>
      
      <div className="space-y-3">
        {leaderboard.map((user, index) => (
          <div
            key={user._id}
            className={`flex items-center justify-between p-4 rounded-lg border ${
              index < 3 ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200' : 'bg-gray-50 border-gray-200'
            }`}
          >
            <div className="flex items-center space-x-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                index === 0 ? 'bg-yellow-500' :
                index === 1 ? 'bg-gray-400' :
                index === 2 ? 'bg-orange-500' : 'bg-blue-500'
              }`}>
                {index + 1}
              </div>
              
              <img
                src={user.avatar || '/default-avatar.png'}
                alt={user.username}
                className="w-10 h-10 rounded-full"
              />
              
              <div>
                <h3 className="font-semibold text-gray-800">{user.username}</h3>
                <p className="text-sm text-gray-500">Level {Math.floor(user.karmaPoints / 100) + 1}</p>
              </div>
            </div>

            <div className="text-right">
              <div className="text-lg font-bold text-gray-800">
                {user.karmaPoints} pts
              </div>
              <div className="text-sm text-gray-500">Karma</div>
            </div>
          </div>
        ))}
      </div>

      {leaderboard.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No users on the leaderboard yet. Be the first to earn karma points!
        </div>
      )}
    </div>
  );
};

export default KarmaLeaderboard;