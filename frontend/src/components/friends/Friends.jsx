import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import './Friends.css';

const Friends = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('friends');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data - in a real app, this would come from an API
  const [friends, setFriends] = useState([
    {
      id: 1,
      username: 'alex_johnson',
      name: 'Alex Johnson',
      avatar: 'AJ',
      goalsCompleted: 12,
      currentStreak: 5,
      mutualFriends: 3
    },
    {
      id: 2,
      username: 'sarah_m',
      name: 'Sarah Miller',
      avatar: 'SM',
      goalsCompleted: 8,
      currentStreak: 12,
      mutualFriends: 2
    },
    {
      id: 3,
      username: 'mike_chen',
      name: 'Mike Chen',
      avatar: 'MC',
      goalsCompleted: 15,
      currentStreak: 7,
      mutualFriends: 5
    }
  ]);

  const [friendRequests, setFriendRequests] = useState([
    {
      id: 4,
      username: 'jessica_w',
      name: 'Jessica Wilson',
      avatar: 'JW',
      mutualFriends: 1
    }
  ]);

  const [suggestedFriends, setSuggestedFriends] = useState([
    {
      id: 5,
      username: 'david_k',
      name: 'David Kim',
      avatar: 'DK',
      mutualFriends: 4,
      commonGoals: 3
    },
    {
      id: 6,
      username: 'lisa_p',
      name: 'Lisa Parker',
      avatar: 'LP',
      mutualFriends: 2,
      commonGoals: 2
    }
  ]);

  const handleAddFriend = (friendId) => {
    const friend = suggestedFriends.find(f => f.id === friendId);
    if (friend) {
      setFriends([...friends, { ...friend, goalsCompleted: 0, currentStreak: 0 }]);
      setSuggestedFriends(suggestedFriends.filter(f => f.id !== friendId));
    }
  };

  const handleAcceptRequest = (requestId) => {
    const request = friendRequests.find(f => f.id === requestId);
    if (request) {
      setFriends([...friends, { ...request, goalsCompleted: 0, currentStreak: 0 }]);
      setFriendRequests(friendRequests.filter(f => f.id !== requestId));
    }
  };

  const handleRejectRequest = (requestId) => {
    setFriendRequests(friendRequests.filter(f => f.id !== requestId));
  };

  const handleRemoveFriend = (friendId) => {
    setFriends(friends.filter(f => f.id !== friendId));
  };

  const filteredFriends = friends.filter(friend =>
    friend.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    friend.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="friends-container">
      <div className="friends-header">
        <div className="header-content">
          <h1>Ì±• Friends</h1>
          <p>Connect with friends and stay motivated together</p>
        </div>
        
        <div className="search-box">
          <input
            type="text"
            placeholder="Search friends..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="search-icon">Ì¥ç</span>
        </div>
      </div>

      {/* Friends Navigation */}
      <div className="friends-nav">
        <button 
          className={`nav-item ${activeTab === 'friends' ? 'active' : ''}`}
          onClick={() => setActiveTab('friends')}
        >
          Friends ({friends.length})
        </button>
        <button 
          className={`nav-item ${activeTab === 'requests' ? 'active' : ''}`}
          onClick={() => setActiveTab('requests')}
        >
          Requests ({friendRequests.length})
        </button>
        <button 
          className={`nav-item ${activeTab === 'suggestions' ? 'active' : ''}`}
          onClick={() => setActiveTab('suggestions')}
        >
          Suggestions ({suggestedFriends.length})
        </button>
      </div>

      {/* Friends Content */}
      <div className="friends-content">
        {activeTab === 'friends' && (
          <div className="tab-content">
            {filteredFriends.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">Ì±•</div>
                <h3>No friends yet</h3>
                <p>Connect with friends to see their progress and stay motivated!</p>
                <button 
                  className="btn-primary"
                  onClick={() => setActiveTab('suggestions')}
                >
                  Find Friends
                </button>
              </div>
            ) : (
              <div className="friends-grid">
                {filteredFriends.map(friend => (
                  <div key={friend.id} className="friend-card">
                    <div className="friend-header">
                      <div className="friend-avatar">
                        {friend.avatar}
                      </div>
                      <div className="friend-info">
                        <h4>{friend.name}</h4>
                        <span className="friend-username">@{friend.username}</span>
                      </div>
                      <button 
                        className="btn-small btn-danger"
                        onClick={() => handleRemoveFriend(friend.id)}
                      >
                        Remove
                      </button>
                    </div>
                    
                    <div className="friend-stats">
                      <div className="friend-stat">
                        <span className="stat-number">{friend.goalsCompleted}</span>
                        <span className="stat-label">Goals Completed</span>
                      </div>
                      <div className="friend-stat">
                        <span className="stat-number">{friend.currentStreak}</span>
                        <span className="stat-label">Day Streak</span>
                      </div>
                      <div className="friend-stat">
                        <span className="stat-number">{friend.mutualFriends}</span>
                        <span className="stat-label">Mutual Friends</span>
                      </div>
                    </div>
                    
                    <div className="friend-actions">
                      <button className="btn-secondary">View Profile</button>
                      <button className="btn-primary">Message</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'requests' && (
          <div className="tab-content">
            {friendRequests.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">Ì≥®</div>
                <h3>No friend requests</h3>
                <p>When someone sends you a friend request, it will appear here.</p>
              </div>
            ) : (
              <div className="requests-list">
                {friendRequests.map(request => (
                  <div key={request.id} className="request-card">
                    <div className="request-header">
                      <div className="friend-avatar">
                        {request.avatar}
                      </div>
                      <div className="request-info">
                        <h4>{request.name}</h4>
                        <span className="friend-username">@{request.username}</span>
                        <span className="mutual-friends">
                          {request.mutualFriends} mutual friends
                        </span>
                      </div>
                    </div>
                    
                    <div className="request-actions">
                      <button 
                        className="btn-primary"
                        onClick={() => handleAcceptRequest(request.id)}
                      >
                        Accept
                      </button>
                      <button 
                        className="btn-secondary"
                        onClick={() => handleRejectRequest(request.id)}
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'suggestions' && (
          <div className="tab-content">
            {suggestedFriends.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">Ìºü</div>
                <h3>No suggestions available</h3>
                <p>Check back later for new friend suggestions!</p>
              </div>
            ) : (
              <div className="suggestions-grid">
                {suggestedFriends.map(suggestion => (
                  <div key={suggestion.id} className="suggestion-card">
                    <div className="suggestion-header">
                      <div className="friend-avatar">
                        {suggestion.avatar}
                      </div>
                      <div className="suggestion-info">
                        <h4>{suggestion.name}</h4>
                        <span className="friend-username">@{suggestion.username}</span>
                        <div className="suggestion-details">
                          <span>{suggestion.mutualFriends} mutual friends</span>
                          <span>{suggestion.commonGoals} common goals</span>
                        </div>
                      </div>
                    </div>
                    
                    <button 
                      className="btn-primary"
                      onClick={() => handleAddFriend(suggestion.id)}
                    >
                      Add Friend
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Friends;
