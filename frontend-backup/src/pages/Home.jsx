import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              Welcome to <span className="gradient-text">Virelia</span>
            </h1>
            <p className="hero-subtitle">
              Where meaningful connections create lasting impact.
            </p>
            <div className="hero-buttons">
              <Link to="/register" className="btn-primary btn-large">
                Ìæâ Join Now
              </Link>
              <Link to="/login" className="btn-secondary btn-large">
                Ì¥ê Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
