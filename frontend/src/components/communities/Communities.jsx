import React, { useContext, useState } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import './Communities.css';

const Communities = () => {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('joined');

  return (
    <div className="communities">
      <div className="communities-header">
        <h1>Communities Ì±•</h1>
        <p>Join communities and collaborate with like-minded people</p>
        <button className="create-community-btn">
          + Create Community
        </button>
      </div>

      <div className="communities-tabs">
        <button 
          className={activeTab === 'joined' ? 'active' : ''}
          onClick={() => setActiveTab('joined')}
        >
          My Communities
        </button>
        <button 
          className={activeTab === 'discover' ? 'active' : ''}
          onClick={() => setActiveTab('discover')}
        >
          Discover
        </button>
        <button 
          className={activeTab === 'requests' ? 'active' : ''}
          onClick={() => setActiveTab('requests')}
        >
          Requests
        </button>
      </div>

      <div className="communities-content">
        {activeTab === 'joined' && (
          <div className="joined-communities">
            <div className="empty-communities">
              <div className="empty-icon">ÌøòÔ∏è</div>
              <h3>No communities yet</h3>
              <p>Join or create communities to collaborate with others. Communities help you stay motivated and share progress.</p>
              <button className="discover-communities-btn">
                Discover Communities
              </button>
            </div>
          </div>
        )}

        {activeTab === 'discover' && (
          <div className="discover-communities">
            <div className="empty-discover">
              <div className="empty-icon">Ì¥ç</div>
              <h3>No communities available</h3>
              <p>Public communities will appear here for you to join and participate in.</p>
            </div>
          </div>
        )}

        {activeTab === 'requests' && (
          <div className="community-requests">
            <div className="empty-requests">
              <div className="empty-icon">Ì≥®</div>
              <h3>No pending requests</h3>
              <p>Community join requests will appear here when you create a private community.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Communities;
