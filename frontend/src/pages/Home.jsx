import React from 'react'
import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <div>
      <section className="hero-section">
        <div className="container">
          <h1 className="hero-title">Welcome to Virelia</h1>
          <p className="hero-subtitle">
            Connect, share, and grow with our community
          </p>
          <div className="hero-buttons">
            <Link to="/register" className="btn btn-primary">
              Get Started
            </Link>
            <Link to="/login" className="btn btn-secondary">
              Sign In
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
