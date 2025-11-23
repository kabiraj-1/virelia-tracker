import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import './Activities.css';

const Activities = () => {
  const { user } = useAuth();
  const [activities, setActivities] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'work',
    duration: 60,
    date: new Date().toISOString().split('T')[0]
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const newActivity = {
      id: Date.now(),
      ...formData,
      createdAt: new Date().toISOString()
    };
    setActivities([newActivity, ...activities]);
    setFormData({
      title: '',
      description: '',
      category: 'work',
      duration: 60,
      date: new Date().toISOString().split('T')[0]
    });
    setShowForm(false);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const categories = {
    work: 'Ì≤º Work',
    exercise: 'Ì≤™ Exercise',
    study: 'Ì≥ö Study',
    leisure: 'ÌæÆ Leisure',
    social: 'Ì±• Social',
    health: 'Ìø• Health',
    other: 'Ì¥Æ Other'
  };

  const getTotalTime = () => {
    return activities.reduce((total, activity) => total + parseInt(activity.duration), 0);
  };

  const getCategoryTime = (category) => {
    return activities
      .filter(activity => activity.category === category)
      .reduce((total, activity) => total + parseInt(activity.duration), 0);
  };

  return (
    <div className="activities-container">
      <div className="activities-header">
        <div className="header-content">
          <h1>‚è±Ô∏è Activities</h1>
          <p>Track how you spend your time</p>
        </div>
        <button 
          className="btn-primary"
          onClick={() => setShowForm(true)}
        >
          + Log Activity
        </button>
      </div>

      {/* Activity Form Modal */}
      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Log New Activity</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Activity Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="What did you do?"
                  required
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Add some details..."
                  rows="3"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                  >
                    {Object.entries(categories).map(([key, label]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Duration (minutes)</label>
                  <input
                    type="number"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    min="1"
                    max="480"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Date</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                />
              </div>

              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowForm(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Log Activity
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Activity Statistics */}
      <div className="activities-stats">
        <div className="stat-card">
          <div className="stat-icon">‚è±Ô∏è</div>
          <h3>Total Time</h3>
          <p className="stat-number">{getTotalTime()}m</p>
          <p className="stat-label">This week</p>
        </div>
        
        {Object.keys(categories).map(category => {
          const time = getCategoryTime(category);
          return time > 0 ? (
            <div key={category} className="stat-card">
              <div className="stat-icon">{categories[category].split(' ')[0]}</div>
              <h3>{categories[category].split(' ')[1]}</h3>
              <p className="stat-number">{time}m</p>
              <p className="stat-label">
                {Math.round((time / getTotalTime()) * 100)}% of time
              </p>
            </div>
          ) : null;
        })}
      </div>

      {/* Activities List */}
      <div className="activities-list">
        <h3>Recent Activities</h3>
        
        {activities.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">‚è±Ô∏è</div>
            <h3>No activities logged yet</h3>
            <p>Start tracking your time to see insights about your daily routine!</p>
            <button 
              className="btn-primary"
              onClick={() => setShowForm(true)}
            >
              Log Your First Activity
            </button>
          </div>
        ) : (
          <div className="activities-grid">
            {activities.map(activity => (
              <div key={activity.id} className="activity-card">
                <div className="activity-header">
                  <div className="activity-category">
                    {categories[activity.category].split(' ')[0]}
                    <span>{categories[activity.category].split(' ')[1]}</span>
                  </div>
                  <div className="activity-duration">
                    {activity.duration}m
                  </div>
                </div>
                
                <div className="activity-content">
                  <h4>{activity.title}</h4>
                  {activity.description && <p>{activity.description}</p>}
                </div>
                
                <div className="activity-footer">
                  <span className="activity-date">
                    {new Date(activity.date).toLocaleDateString()}
                  </span>
                  <button 
                    className="btn-small btn-danger"
                    onClick={() => setActivities(activities.filter(a => a.id !== activity.id))}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Activities;
