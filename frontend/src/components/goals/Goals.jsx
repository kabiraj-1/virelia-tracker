import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import goalService from '../../services/goalService';
import GoalForm from './GoalForm';
import GoalCard from './GoalCard';
import './Goals.css';

const Goals = () => {
  const { user } = useAuth();
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

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

  const filteredGoals = goals.filter(goal => {
    switch (filter) {
      case 'completed':
        return goal.isCompleted;
      case 'active':
        return !goal.isCompleted;
      case 'health':
        return goal.category === 'health';
      case 'career':
        return goal.category === 'career';
      case 'education':
        return goal.category === 'education';
      case 'personal':
        return goal.category === 'personal';
      case 'financial':
        return goal.category === 'financial';
      default:
        return true;
    }
  });

  const stats = {
    total: goals.length,
    completed: goals.filter(goal => goal.isCompleted).length,
    active: goals.filter(goal => !goal.isCompleted).length,
    progress: goals.length > 0 
      ? Math.round(goals.reduce((sum, goal) => sum + goal.progress, 0) / goals.length)
      : 0
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
        <div className="header-content">
          <h1>ÌæØ My Goals</h1>
          <p>Track and manage your personal goals</p>
        </div>
        <button 
          className="btn-primary"
          onClick={() => setShowForm(true)}
        >
          + New Goal
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {/* Goals Statistics */}
      <div className="goals-stats">
        <div className="stat-card">
          <div className="stat-icon">Ì≥ä</div>
          <h3>Total Goals</h3>
          <p className="stat-number">{stats.total}</p>
        </div>
        <div className="stat-card">
          <div className="stat-icon">‚úÖ</div>
          <h3>Completed</h3>
          <p className="stat-number">{stats.completed}</p>
        </div>
        <div className="stat-card">
          <div className="stat-icon">Ì∫Ä</div>
          <h3>In Progress</h3>
          <p className="stat-number">{stats.active}</p>
        </div>
        <div className="stat-card">
          <div className="stat-icon">Ì≥à</div>
          <h3>Avg Progress</h3>
          <p className="stat-number">{stats.progress}%</p>
        </div>
      </div>

      {/* Goals Filter */}
      <div className="goals-filter">
        <button 
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All Goals
        </button>
        <button 
          className={`filter-btn ${filter === 'active' ? 'active' : ''}`}
          onClick={() => setFilter('active')}
        >
          Active
        </button>
        <button 
          className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
          onClick={() => setFilter('completed')}
        >
          Completed
        </button>
        <select 
          value={filter} 
          onChange={(e) => setFilter(e.target.value)}
          className="category-filter"
        >
          <option value="all">All Categories</option>
          <option value="health">Health & Fitness</option>
          <option value="career">Career</option>
          <option value="education">Education</option>
          <option value="personal">Personal</option>
          <option value="financial">Financial</option>
        </select>
      </div>

      {/* Goal Form Modal */}
      {showForm && (
        <GoalForm
          onSubmit={handleCreateGoal}
          onCancel={() => setShowForm(false)}
        />
      )}

      {/* Goals Grid */}
      <div className="goals-grid">
        {filteredGoals.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              {filter === 'completed' ? 'Ìæâ' : 
               filter === 'active' ? 'ÌæØ' : 'Ì≥ù'}
            </div>
            <h3>
              {filter === 'completed' ? 'No completed goals yet' :
               filter === 'active' ? 'No active goals' :
               'No goals yet'}
            </h3>
            <p>
              {filter === 'completed' ? 'Complete some goals to see them here!' :
               filter === 'active' ? 'All your goals are completed! Great job!' :
               'Create your first goal to start tracking your progress!'}
            </p>
            {filter !== 'completed' && (
              <button 
                className="btn-primary"
                onClick={() => setShowForm(true)}
              >
                Create Your First Goal
              </button>
            )}
          </div>
        ) : (
          filteredGoals.map(goal => (
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
