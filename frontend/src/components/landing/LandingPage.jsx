import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
  const [currentFeature, setCurrentFeature] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % 3);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="landing-page">
      {/* Navigation */}
      <nav className="landing-nav">
        <div className="nav-container">
          <div className="logo">
            <span className="logo-icon">Ìºå</span>
            <span className="logo-text">Virelia</span>
          </div>
          <div className="nav-links">
            <Link to="/login" className="nav-link">Sign In</Link>
            <Link to="/register" className="nav-button">Launch App</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="cosmic-background">
          <div className="star-field">
            <div className="layer"></div>
            <div className="layer"></div>
            <div className="layer"></div>
          </div>
        </div>
        
        <div className="hero-content">
          <div className="hero-text">
            <div className="glowing-badge">
              <span>‚ú® Next-Gen Productivity Platform</span>
            </div>
            
            <h1>
              <span className="neon-text">Transform Your</span>
              <br />
              <span className="gradient-flow">Productivity Journey</span>
            </h1>
            
            <p className="hero-description">
              Where AI-powered goal tracking meets social connectivity. 
              Experience the future of productivity with real-time insights, 
              smart communities, and meaningful connections.
            </p>
            
            <div className="hero-buttons">
              <Link to="/register" className="cta-button cosmic-glow">
                <span className="button-text">Begin Cosmic Journey</span>
                <div className="button-orb"></div>
              </Link>
              <Link to="/login" className="cta-button space-transparent">
                Access Portal
              </Link>
            </div>

            <div className="hero-stats">
              <div className="stat-item">
                <div className="stat-value cosmic-number">15K+</div>
                <div className="stat-label">Cosmic Explorers</div>
              </div>
              <div className="stat-item">
                <div className="stat-value cosmic-number">2.4M+</div>
                <div className="stat-label">Goals Achieved</div>
              </div>
              <div className="stat-item">
                <div className="stat-value cosmic-number">99.9%</div>
                <div className="stat-label">Orbital Uptime</div>
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hologram-dashboard">
              <div className="holo-header">
                <div className="holo-dots">
                  <div className="dot pulsar"></div>
                  <div className="dot quasar"></div>
                  <div className="dot nebula"></div>
                </div>
                <div className="holo-title">Live Cosmic Feed</div>
              </div>
              
              <div className="holo-content">
                <div className="quantum-feed">
                  <div className="feed-item hologram">
                    <div className="user-orb">Ìº†</div>
                    <div className="feed-content">
                      <div className="feed-user">Quantum Explorer</div>
                      <div className="feed-text">Achieved singularity in coding marathon Ì∫Ä</div>
                      <div className="feed-time">Just now</div>
                    </div>
                    <div className="achievement-badge">Ìºü</div>
                  </div>
                  
                  <div className="feed-item hologram">
                    <div className="user-orb">Ì∫ê</div>
                    <div className="feed-content">
                      <div className="feed-user">Galactic Mentor</div>
                      <div className="feed-text">Completed interstellar learning path Ìºå</div>
                      <div className="feed-time">2 mins ago</div>
                    </div>
                    <div className="achievement-badge">Ì≤´</div>
                  </div>
                  
                  <div className="feed-item hologram">
                    <div className="user-orb">‚ö°</div>
                    <div className="feed-content">
                      <div className="feed-user">Nova Creator</div>
                      <div className="feed-text">Launched new productivity galaxy Ìª∏</div>
                      <div className="feed-time">5 mins ago</div>
                    </div>
                    <div className="achievement-badge">Ì¥•</div>
                  </div>
                </div>

                <div className="cosmic-stats">
                  <div className="stat-card nebula-glow">
                    <div className="stat-icon">ÌæØ</div>
                    <div className="stat-info">
                      <div className="stat-value">‚àû</div>
                      <div className="stat-label">Active Goals</div>
                    </div>
                  </div>
                  <div className="stat-card quasar-glow">
                    <div className="stat-icon">Ì±•</div>
                    <div className="stat-info">
                      <div className="stat-value">1.2K</div>
                      <div className="stat-label">Cosmic Connections</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="cosmic-container">
          <div className="section-header">
            <h2 className="section-title cosmic-glow">Cosmic Features</h2>
            <p className="section-subtitle">Powered by quantum innovation</p>
          </div>
          
          <div className="features-grid">
            {[
              {
                icon: 'Ì¥ñ',
                title: 'AI Goal Architect',
                description: 'Quantum-powered goal setting with adaptive intelligence and predictive success patterns.'
              },
              {
                icon: 'Ìºê',
                title: 'Social Galaxy',
                description: 'Connect across multiple dimensions with real-time collaboration and shared achievements.'
              },
              {
                icon: 'Ì≥°',
                title: 'Deep Analytics',
                description: 'Multi-dimensional insights with temporal analysis and predictive growth mapping.'
              },
              {
                icon: 'Ì∫Ä',
                title: 'Rocket Communities',
                description: 'Join specialized constellations focused on exponential growth and innovation.'
              },
              {
                icon: '‚è≥',
                title: 'Time Warp Tracking',
                description: '4D time management with temporal optimization and parallel achievement streams.'
              },
              {
                icon: 'Ì¥≠',
                title: 'Cosmic Vision',
                description: 'Future-predictive planning with quantum computing and AI foresight.'
              }
            ].map((feature, index) => (
              <div key={index} className="feature-card cosmic-card">
                <div className="feature-orb">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
                <div className="cosmic-glow-effect"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="black-hole-bg">
          <div className="singularity"></div>
        </div>
        <div className="cosmic-container">
          <h2>Ready for Cosmic Productivity?</h2>
          <p>Join the revolution where dreams become reality at light speed</p>
          <div className="cta-buttons">
            <Link to="/register" className="cta-button supernova">
              Create Black Hole Account
            </Link>
            <Link to="/demo" className="cta-button wormhole">
              Warp to Demo
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="cosmic-footer">
        <div className="cosmic-container">
          <div className="footer-content">
            <div className="footer-brand">
              <div className="logo">
                <span className="logo-icon">Ìºå</span>
                <span className="logo-text">Virelia</span>
              </div>
              <p>Crafting the future of human potential</p>
              <div className="quantum-signature">
                <span>Designed with ‚ô• by </span>
                <strong className="author-glow">Kabi Raj Bhatt</strong>
              </div>
            </div>
          </div>
          
          <div className="footer-bottom">
            <p>&copy; 2024 Virelia Tracker. All cosmic rights reserved across all dimensions.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
