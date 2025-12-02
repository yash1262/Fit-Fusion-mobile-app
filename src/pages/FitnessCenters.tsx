import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

const FitnessCenters: React.FC = () => {
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
          <h1>For Fitness Centers</h1>
          <p>Transform your gym with smart technology and member engagement tools</p>
        </section>

        <section className="features-section">
          <h2>Modernize Your Facility</h2>
          <div className="features-grid">
            <div className="feature-card">
              <h3>Member Portal</h3>
              <p>Give members access to workouts, classes, and progress tracking</p>
            </div>
            <div className="feature-card">
              <h3>Class Management</h3>
              <p>Schedule, manage, and track attendance for group fitness classes</p>
            </div>
            <div className="feature-card">
              <h3>Retention Analytics</h3>
              <p>Identify at-risk members and boost retention with data-driven insights</p>
            </div>
            <div className="feature-card">
              <h3>Branded Experience</h3>
              <p>White-label solution with your gym's branding and identity</p>
            </div>
          </div>
        </section>

        <section className="cta-section">
          <h2>Upgrade Your Gym Today</h2>
          <Link to="/contact" className="cta-button">Request Demo</Link>
        </section>
      </div>
    </div>
  );
};

export default FitnessCenters;
