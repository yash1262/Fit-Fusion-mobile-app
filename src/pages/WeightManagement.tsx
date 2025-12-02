import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

const WeightManagement: React.FC = () => {
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
          <h1>Weight Management</h1>
          <p>Achieve and maintain your ideal weight with science-backed strategies</p>
        </section>

        <section className="features-section">
          <h2>Our Approach</h2>
          <div className="features-grid">
            <div className="feature-card">
              <h3>Calorie Tracking</h3>
              <p>Easy-to-use tools to monitor your daily intake and expenditure</p>
            </div>
            <div className="feature-card">
              <h3>Sustainable Plans</h3>
              <p>No crash diets - just healthy, long-term lifestyle changes</p>
            </div>
            <div className="feature-card">
              <h3>Expert Support</h3>
              <p>Guidance from nutrition and fitness professionals</p>
            </div>
            <div className="feature-card">
              <h3>Behavioral Coaching</h3>
              <p>Build healthy habits that last a lifetime</p>
            </div>
          </div>
        </section>

        <section className="cta-section">
          <h2>Start Your Transformation</h2>
          <Link to="/signup" className="cta-button">Join Now</Link>
        </section>
      </div>
    </div>
  );
};

export default WeightManagement;
