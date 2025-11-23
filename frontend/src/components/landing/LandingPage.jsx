import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1>Ì∫Ä Virelia Tracker</h1>
            <h2>Track Your Productivity, Achieve Your Goals, Connect with Friends</h2>
            <p>The all-in-one social productivity platform that helps you stay focused, track progress, and achieve more together.</p>
            <div className="hero-buttons">
              <Link to="/register" className="cta-button primary">
                Start Your Journey
              </Link>
              <Link to="/login" className="cta-button secondary">
                Sign In
              </Link>
            </div>
          </div>
          <div className="hero-visual">
            <div className="feature-preview">
              <div className="preview-card">
                <div className="card-header">Ì≥ä Your Dashboard</div>
                <div className="card-stats">
                  <div className="stat">Goals: 0</div>
                  <div className="stat">Friends: 0</div>
                  <div className="stat">Progress: 0%</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <h2>Why Choose Virelia Tracker?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">ÌæØ</div>
              <h3>Goal Tracking</h3>
              <p>Set, track, and achieve your personal and professional goals with detailed progress monitoring.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">Ì±•</div>
              <h3>Social Accountability</h3>
              <p>Connect with friends, share progress, and stay motivated together in your productivity journey.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">Ì≥à</div>
              <h3>Advanced Analytics</h3>
              <p>Get insights into your productivity patterns and optimize your workflow with detailed analytics.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">ÌøòÔ∏è</div>
              <h3>Communities</h3>
              <p>Join like-minded people in communities focused on specific goals, hobbies, or productivity methods.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">‚è±Ô∏è</div>
              <h3>Activity Tracking</h3>
              <p>Log and categorize your daily activities to understand where your time goes.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">Ì¥î</div>
              <h3>Smart Reminders</h3>
              <p>Never miss important deadlines or goals with intelligent notification system.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works">
        <div className="container">
          <h2>How It Works</h2>
          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <h3>Sign Up & Set Goals</h3>
              <p>Create your account and define what you want to achieve</p>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <h3>Track Progress</h3>
              <p>Log your daily activities and monitor your advancement</p>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <h3>Connect & Grow</h3>
              <p>Join communities, add friends, and achieve more together</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <h2>Ready to Boost Your Productivity?</h2>
          <p>Join thousands of users already achieving their goals with Virelia Tracker</p>
          <Link to="/register" className="cta-button large">
            Get Started Free
          </Link>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
