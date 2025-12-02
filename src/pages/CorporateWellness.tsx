import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

const CorporateWellness: React.FC = () => {
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
          <h1>Corporate Wellness</h1>
          <p>Boost employee health, productivity, and morale</p>
        </section>

        <section className="features-section">
          <h2>Invest in Your Team's Health</h2>
          <div className="features-grid">
            <div className="feature-card">
              <h3>Wellness Challenges</h3>
              <p>Engage employees with team competitions and fitness goals</p>
            </div>
            <div className="feature-card">
              <h3>Health Metrics</h3>
              <p>Track company-wide wellness trends and ROI on health initiatives</p>
            </div>
            <div className="feature-card">
              <h3>Flexible Programs</h3>
              <p>Workouts that fit busy schedules - office, home, or gym</p>
            </div>
            <div className="feature-card">
              <h3>Reduced Healthcare Costs</h3>
              <p>Preventive wellness programs that lower insurance premiums</p>
            </div>
          </div>
        </section>

        <section className="cta-section">
          <h2>Build a Healthier Workplace</h2>
          <Link to="/contact" className="cta-button">Contact Sales</Link>
        </section>
      </div>
    </div>
  );
};

export default CorporateWellness;
