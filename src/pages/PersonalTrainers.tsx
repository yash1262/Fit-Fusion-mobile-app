import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

const PersonalTrainers: React.FC = () => {
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
          <h1>For Personal Trainers</h1>
          <p>Empower your clients with cutting-edge fitness technology</p>
        </section>

        <section className="features-section">
          <h2>Grow Your Training Business</h2>
          <div className="features-grid">
            <div className="feature-card">
              <h3>Client Management</h3>
              <p>Track multiple clients, their progress, and workout plans in one place</p>
            </div>
            <div className="feature-card">
              <h3>Custom Programs</h3>
              <p>Create and assign personalized workout and nutrition plans</p>
            </div>
            <div className="feature-card">
              <h3>Progress Monitoring</h3>
              <p>Real-time insights into client performance and adherence</p>
            </div>
            <div className="feature-card">
              <h3>Communication Tools</h3>
              <p>Stay connected with clients through in-app messaging and updates</p>
            </div>
          </div>
        </section>

        <section className="cta-section">
          <h2>Elevate Your Training Practice</h2>
          <Link to="/signup" className="cta-button">Get Started</Link>
        </section>
      </div>
    </div>
  );
};

export default PersonalTrainers;
