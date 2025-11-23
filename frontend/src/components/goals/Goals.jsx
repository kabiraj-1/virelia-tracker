import React, { useState, useEffect } from 'react';
import goalService from '../../services/goalService';
import GoalForm from './GoalForm';
import GoalCard from './GoalCard';
import './Goals.css';

const Goals = () => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = async () => {
    try {
      setLoading(true);
      const goalsData = await goalService.getGoals();
      setGoals(goalsData);
    } catch (error) {
      setError('Failed to load goals');
      console.error('Error loading goals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGoal = async (goalData) => {
    try {
      const newGoal = await goalService.createGoal(goalData);
      setGoals([newGoal, ...goals]);
      setShowForm(false);
      setError('');
    } catch (error) {
      setError('Failed to create goal');
      console.error('Error creating goal:', error);
    }
  };

  const handleUpdateGoal = async (id, updates) => {
    try {
      const updatedGoal = await goalService.updateGoal(id, updates);
      setGoals(goals.map(goal => goal._id === id ? updatedGoal : goal));
      setError('');
    } catch (error) {
      setError('Failed to update goal');
      console.error('Error updating goal:', error);
    }
  };

  const handleDeleteGoal = async (id) => {
    try {
      await goalService.deleteGoal(id);
      setGoals(goals.filter(goal => goal._id !== id));
      setError('');
    } catch (error) {
      setError('Failed to delete goal');
      console.error('Error deleting goal:', error);
    }
  };

  if (loading) {
    return (
      <div className="goals-container">
        <div className="loading">Loading your goals...</div>
      </div>
    );
  }

  return (
    <div className="goals-container">
      <div className="goals-header">
        <h1>í¾¯ My Goals</h1>
        <button 
          className="btn-primary"
          onClick={() => setShowForm(true)}
        >
          + New Goal
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {showForm && (
        <GoalForm
          onSubmit={handleCreateGoal}
          onCancel={() => setShowForm(false)}
        />
      )}

      <div className="goals-stats">
        <div className="stat-card">
          <h3>Total Goals</h3>
          <p className="stat-number">{goals.length}</p>
        </div>
        <div className="stat-card">
          <h3>Completed</h3>
          <p className="stat-number">
            {goals.filter(goal => goal.isCompleted).length}
          </p>
        </div>
        <div className="stat-card">
          <h3>In Progress</h3>
          <p className="stat-number">
            {goals.filter(goal => !goal.isCompleted).length}
          </p>
        </div>
      </div>

      <div className="goals-grid">
        {goals.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">í¾¯</div>
            <h3>No goals yet</h3>
            <p>Create your first goal to start tracking your progress!</p>
            <button 
              className="btn-primary"
              onClick={() => setShowForm(true)}
            >
              Create Your First Goal
            </button>
          </div>
        ) : (
          goals.map(goal => (
            <GoalCard
              key={goal._id}
              goal={goal}
              onUpdate={handleUpdateGoal}
              onDelete={handleDeleteGoal}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Goals;
