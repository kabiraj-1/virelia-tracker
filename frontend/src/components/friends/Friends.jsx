import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import friendService from '../../services/friendService';
import './Friends.css';

const Friends = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('friends');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [friends, setFriends] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);

  useEffect(() => {
    loadFriendsData();
  }, []);

  const loadFriendsData = async () => {
    try {
      setLoading(true);
      const [friendsData, requestsData] = await Promise.all([
        friendService.getFriends(),
        friendService.getFriendRequests()
      ]);
      setFriends(friendsData);
      setFriendRequests(requestsData);
    } catch (error) {
      setError('Failed to load friends data');
      console.error('Error loading friends data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query) => {
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    try {
      setSearchLoading(true);
      const results = await friendService.searchUsers(query);
      setSearchResults(results);
    } catch (error) {
      console.error('Error searching users:', error);
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleSendFriendRequest = async (userId) => {
    try {
      await friendService.sendFriendRequest(userId);
      setError('');
      // Update search results to reflect the sent request
      setSearchResults(prev => prev.map(user => 
        user._id === userId ? { ...user, friendshipStatus: 'pending' } : user
      ));
    } catch (error) {
      setError('Failed to send friend request');
      console.error('Error sending friend request:', error);
    }
  };

  const handleAcceptRequest = async (requestId) => {
    try {
      await friendService.acceptFriendRequest(requestId);
      await loadFriendsData(); // Reload all data
      setError('');
    } catch (error) {
      setError('Failed to accept friend request');
      console.error('Error accepting friend request:', error);
    }
  };

  const handleRejectRequest = async (requestId) => {
    try {
      await friendService.rejectFriendRequest(requestId);
      setFriendRequests(prev => prev.filter(req => req._id !== requestId));
      setError('');
    } catch (error) {
      setError('Failed to reject friend request');
      console.error('Error rejecting friend request:', error);
    }
  };

  const handleRemoveFriend = async (friendId) => {
    try {
      await friendService.removeFriend(friendId);
      setFriends(prev => prev.filter(friend => friend.friend._id !== friendId));
      setError('');
    } catch (error) {
      setError('Failed to remove friend');
      console.error('Error removing friend:', error);
    }
  };

  const getFriendStatusText = (status) => {
    switch (status) {
      case 'pending': return 'Request Pending';
      case 'accepted': return 'Friends';
      case 'rejected': return 'Request Rejected';
      default: return 'Add Friend';
    }
  };

  const getFriendStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#ffc107';
      case 'accepted': return '#28a745';
      case 'rejected': return '#dc3545';
      default: return '#667eea';
    }
  };

  if (loading) {
    return (
      <div className="friends-container">
        <div className="loading">Loading friends...</div>
      </div>
    );
  }

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
            placeholder="Search users by username or email..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              handleSearch(e.target.value);
            }}
          />
          <span className="search-icon">Ì¥ç</span>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

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
          className={`nav-item ${activeTab === 'search' ? 'active' : ''}`}
          onClick={() => setActiveTab('search')}
        >
          Find Friends
        </button>
      </div>

      {/* Friends Content */}
      <div className="friends-content">
        {activeTab === 'friends' && (
          <div className="tab-content">
            {friends.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">Ì±•</div>
                <h3>No friends yet</h3>
                <p>Connect with friends to see their progress and stay motivated!</p>
                <button 
                  className="btn-primary"
                  onClick={() => setActiveTab('search')}
                >
                  Find Friends
                </button>
              </div>
            ) : (
              <div className="friends-grid">
                {friends.map(friendship => (
                  <div key={friendship._id} className="friend-card">
                    <div className="friend-header">
                      <div className="friend-avatar">
                        {friendship.friend.username?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <div className="friend-info">
                        <h4>{friendship.friend.username}</h4>
                        <span className="friend-email">{friendship.friend.email}</span>
                      </div>
                      <button 
                        className="btn-small btn-danger"
                        onClick={() => handleRemoveFriend(friendship.friend._id)}
                      >
                        Remove
                      </button>
                    </div>
                    
                    <div className="friend-status">
                      <span 
                        className="status-badge"
                        style={{ backgroundColor: getFriendStatusColor(friendship.status) }}
                      >
                        {getFriendStatusText(friendship.status)}
                      </span>
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
                <div className="empty-icon">ÔøΩÔøΩ</div>
                <h3>No friend requests</h3>
                <p>When someone sends you a friend request, it will appear here.</p>
              </div>
            ) : (
              <div className="requests-list">
                {friendRequests.map(request => (
                  <div key={request._id} className="request-card">
                    <div className="request-header">
                      <div className="friend-avatar">
                        {request.requestedBy.username?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <div className="request-info">
                        <h4>{request.requestedBy.username}</h4>
                        <span className="friend-email">{request.requestedBy.email}</span>
                        <span className="request-date">
                          {new Date(request.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    
                    <div className="request-actions">
                      <button 
                        className="btn-primary"
                        onClick={() => handleAcceptRequest(request._id)}
                      >
                        Accept
                      </button>
                      <button 
                        className="btn-secondary"
                        onClick={() => handleRejectRequest(request._id)}
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

        {activeTab === 'search' && (
          <div className="tab-content">
            <div className="search-section">
              <h3>Find Friends</h3>
              <p>Search for users by username or email to connect with them.</p>
              
              {searchLoading && <div className="loading-small">Searching...</div>}
              
              {searchResults.length === 0 && searchTerm.length >= 2 && !searchLoading && (
                <div className="empty-state-small">
                  <p>No users found matching "{searchTerm}"</p>
                </div>
              )}

              <div className="search-results">
                {searchResults.map(user => (
                  <div key={user._id} className="search-result-card">
                    <div className="result-header">
                      <div className="friend-avatar">
                        {user.username?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <div className="result-info">
                        <h4>{user.username}</h4>
                        <span className="friend-email">{user.email}</span>
                      </div>
                    </div>
                    
                    <div className="result-actions">
                      {user.friendshipStatus === 'none' && (
                        <button 
                          className="btn-primary"
                          onClick={() => handleSendFriendRequest(user._id)}
                        >
                          Add Friend
                        </button>
                      )}
                      {user.friendshipStatus === 'pending' && (
                        <span className="status-text">Request Sent</span>
                      )}
                      {user.friendshipStatus === 'accepted' && (
                        <span className="status-text">Already Friends</span>
                      )}
                      {user.friendshipStatus === 'rejected' && (
                        <span className="status-text">Request Rejected</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {searchTerm.length < 2 && (
                <div className="search-prompt">
                  <p>Enter at least 2 characters to search for users</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Friends;
