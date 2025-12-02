import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

const EnduranceTraining: React.FC = () => {
  return (
    <div className="solution-page">
      <nav className="navbar">
        <div className="nav-container">
          <Link to="/landing" className="logo">FitFusion</Link>
          <ul className="nav-menu">
            <li><Link to="/landing" className="nav-link">Home</Link></li>
            <li><Link to="/about" className="nav-link">About</Link></li>
            <li><Link to="/contact" className="nav-link">Contact</Link></li>
            <li><Link to="/signin" className="nav-link">Sign In</Link></li>
          </ul>
        </div>
      </nav>

      <div className="solution-content">
        <section className="hero-section">
          <h1>Endurance Training</h1>
          <p>Boost your stamina and cardiovascular fitness</p>
        </section>

        <section className="features-section">
          <h2>Go the Distance</h2>
          <div className="features-grid">
            <div className="feature-card">
              <h3>Cardio Programs</h3>
              <p>Running, cycling, swimming - tailored plans for every endurance sport</p>
            </div>
            <div className="feature-card">
              <h3>Heart Rate Zones</h3>
              <p>Train smarter with zone-based workouts for optimal results</p>
            </div>
            <div className="feature-card">
              <h3>Performance Metrics</h3>
              <p>Track VO2 max, pace, distance, and more</p>
            </div>
            <div className="feature-card">
              <h3>Race Preparation</h3>
              <p>Structured training plans for 5K to marathon and beyond</p>
            </div>
          </div>
        </section>

        <section className="cta-section">
          <h2>Elevate Your Endurance</h2>
          <Link to="/signup" className="cta-button">Get Started</Link>
        </section>
      </div>
    </div>
  );
};

export default EnduranceTraining;
