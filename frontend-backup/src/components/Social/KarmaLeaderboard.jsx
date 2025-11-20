import React from 'react';
import { useSocial } from '../../contexts/social/SocialContext';

const KarmaLeaderboard = () => {
  const { leaderboard, loading } = useSocial();

  if (loading) return <div>Loading leaderboard...</div>;

  return (
    <div className="leaderboard">
      <h3>🏆 Community Leaderboard</h3>
      <div className="leaderboard-list">
        {leaderboard.map((user, index) => (
          <div key={user._id} className={`leaderboard-item ${index < 3 ? 'top-three' : ''}`}>
            <span className="rank">#{index + 1}</span>
            <span className="user-info">
              <span className="avatar">{user.name?.charAt(0)}</span>
              {user.name}
            </span>
            <span className="karma-points">{user.totalKarma || 0} pts</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KarmaLeaderboard;