import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-background">
          <div className="hero-overlay"></div>
        </div>
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              Welcome to <span className="gradient-text">Virelia</span>
            </h1>
            <p className="hero-subtitle">
              Where meaningful connections create lasting impact. 
              Join our community of passionate individuals shaping the future of social interaction.
            </p>
            <div className="hero-buttons">
              {user ? (
                <Link to="/feed" className="btn-primary btn-large">
                  Ì∫Ä Go to Feed
                </Link>
              ) : (
                <>
                  <Link to="/register" className="btn-primary btn-large">
                    Ìæâ Join Now
                  </Link>
                  <Link to="/login" className="btn-secondary btn-large">
                    Ì¥ê Sign In
                  </Link>
                </>
              )}
            </div>
          </div>
          <div className="hero-visual">
            <div className="floating-cards">
              <div className="card card-1">
                <div className="card-icon">Ìºü</div>
                <h4>Build Karma</h4>
                <p>Earn reputation through meaningful contributions</p>
              </div>
              <div className="card card-2">
                <div className="card-icon">Ì≥±</div>
                <h4>Share Moments</h4>
                <p>Connect with like-minded individuals</p>
              </div>
              <div className="card card-3">
                <div className="card-icon">ÔøΩÔøΩ</div>
                <h4>Join Events</h4>
                <p>Participate in community activities</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <h2>Why Choose Virelia?</h2>
            <p>Experience social media reimagined with purpose and connection</p>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">Ìª°Ô∏è</div>
              <h3>Safe Community</h3>
              <p>Zero tolerance for harassment with advanced moderation and AI-powered content filtering</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">‚ö°</div>
              <h3>Lightning Fast</h3>
              <p>Optimized performance with real-time updates and seamless user experience</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">Ìæ®</div>
              <h3>Beautiful Design</h3>
              <p>Carefully crafted interface with dark/light mode and customizable themes</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">Ì¥í</div>
              <h3>Privacy First</h3>
              <p>Your data is encrypted and you have full control over your privacy settings</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">Ìºç</div>
              <h3>Global Reach</h3>
              <p>Connect with users worldwide while maintaining local community feel</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">Ì≥à</div>
              <h3>Growth Focused</h3>
              <p>Advanced analytics and insights to help you grow your presence</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">10K+</div>
              <div className="stat-label">Active Users</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">50K+</div>
              <div className="stat-label">Posts Shared</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">5K+</div>
              <div className="stat-label">Events Created</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">99.9%</div>
              <div className="stat-label">Uptime</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Begin Your Journey?</h2>
            <p>Join thousands of users already experiencing the future of social networking</p>
            {!user && (
              <Link to="/register" className="btn-primary btn-large btn-glow">
                Ì∫Ä Create Your Account
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
