import React, { useState } from 'react';
import GoalForm from './GoalForm';

const GoalCard = ({ goal, onUpdate, onDelete }) => {
  const [showEditForm, setShowEditForm] = useState(false);

  const handleProgressUpdate = (newProgress) => {
    const updates = { progress: newProgress };
    if (newProgress === 100) {
      updates.isCompleted = true;
    }
    onUpdate(goal._id, updates);
  };

  const handleComplete = () => {
    onUpdate(goal._id, { isCompleted: true, progress: 100 });
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this goal?')) {
      onDelete(goal._id);
    }
  };

  const getCategoryIcon = (category) => {
    const icons = {
      health: 'Ì≤™',
      career: 'Ì≤º',
      education: 'Ì≥ö',
      financial: 'Ì≤∞',
      personal: 'ÌæØ',
      other: 'Ìºü'
    };
    return icons[category] || 'ÌæØ';
  };

  if (showEditForm) {
    return (
      <GoalForm
        initialData={goal}
        onSubmit={(updates) => {
          onUpdate(goal._id, updates);
          setShowEditForm(false);
        }}
        onCancel={() => setShowEditForm(false)}
      />
    );
  }

  return (
    <div className={`goal-card ${goal.isCompleted ? 'completed' : ''}`}>
      <div className="goal-header">
        <div className="goal-category">
          {getCategoryIcon(goal.category)}
          <span>{goal.category}</span>
        </div>
        <div className="goal-actions">
          <button onClick={() => setShowEditForm(true)}>‚úèÔ∏è</button>
          <button onClick={handleDelete}>Ì∑ëÔ∏è</button>
        </div>
      </div>

      <div className="goal-content">
        <h3>{goal.title}</h3>
        {goal.description && <p>{goal.description}</p>}
        
        {goal.targetDate && (
          <div className="goal-date">
            Ì∑ìÔ∏è Target: {new Date(goal.targetDate).toLocaleDateString()}
          </div>
        )}
      </div>

      <div className="goal-progress">
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ width: `${goal.progress}%` }}
          ></div>
        </div>
        <span className="progress-text">{goal.progress}%</span>
      </div>

      <div className="goal-footer">
        {!goal.isCompleted && (
          <>
            <button 
              className="btn-small"
              onClick={() => handleProgressUpdate(Math.min(goal.progress + 25, 100))}
            >
              +25%
            </button>
            <button 
              className="btn-small btn-success"
              onClick={handleComplete}
            >
              Complete
            </button>
          </>
        )}
        {goal.isCompleted && (
          <span className="completed-badge">‚úÖ Completed</span>
        )}
      </div>
    </div>
  );
};

export default GoalCard;
