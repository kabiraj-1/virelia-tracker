import React, { useContext, useState } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import './Friends.css';

const Friends = () => {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('all');

  return (
    <div className="friends">
      <div className="friends-header">
        <h1>Friends Ì±•</h1>
        <p>Connect with friends and track progress together</p>
      </div>

      <div className="friends-tabs">
        <button 
          className={activeTab === 'all' ? 'active' : ''}
          onClick={() => setActiveTab('all')}
        >
          All Friends
        </button>
        <button 
          className={activeTab === 'requests' ? 'active' : ''}
          onClick={() => setActiveTab('requests')}
        >
          Friend Requests
        </button>
        <button 
          className={activeTab === 'suggestions' ? 'active' : ''}
          onClick={() => setActiveTab('suggestions')}
        >
          Suggestions
        </button>
      </div>

      <div className="friends-content">
        {activeTab === 'all' && (
          <div className="friends-list">
            <div className="empty-friends">
              <div className="empty-icon">Ì±•</div>
              <h3>No friends yet</h3>
              <p>Start connecting with friends to see them here. You can add friends using their username or email.</p>
              <button className="add-friends-btn">
                Add Friends
              </button>
            </div>
          </div>
        )}

        {activeTab === 'requests' && (
          <div className="requests-list">
            <div className="empty-requests">
              <div className="empty-icon">Ì≥©</div>
              <h3>No pending requests</h3>
              <p>When someone sends you a friend request, it will appear here.</p>
            </div>
          </div>
        )}

        {activeTab === 'suggestions' && (
          <div className="suggestions-list">
            <div className="empty-suggestions">
              <div className="empty-icon">Ì¥ç</div>
              <h3>No suggestions available</h3>
              <p>Friend suggestions will appear here as you use the app more.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Friends;
