import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

const GoalManagement: React.FC = () => {
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
          <h1>Goal Management</h1>
          <p>Set ambitious goals, track your progress, and celebrate every milestone</p>
        </section>

        <section className="features-section">
          <h2>Your Success, Mapped Out</h2>
          <div className="features-grid">
            <div className="feature-card">
              <h3>🎯 SMART Goal Builder</h3>
              <p>Create Specific, Measurable, Achievable, Relevant, and Time-bound goals with our intelligent wizard that guides you every step</p>
            </div>
            <div className="feature-card">
              <h3>📊 Visual Progress Tracking</h3>
              <p>Watch your journey unfold with beautiful charts, graphs, and milestone markers that keep you motivated</p>
            </div>
            <div className="feature-card">
              <h3>🏆 Milestone Celebrations</h3>
              <p>Unlock achievements, earn badges, and celebrate wins with personalized rewards and motivational messages</p>
            </div>
            <div className="feature-card">
              <h3>🔄 Adaptive Goal Adjustment</h3>
              <p>AI automatically suggests goal modifications based on your progress, ensuring targets remain challenging yet achievable</p>
            </div>
            <div className="feature-card">
              <h3>📅 Timeline Visualization</h3>
              <p>See your entire fitness journey on an interactive timeline with past achievements and future targets</p>
            </div>
            <div className="feature-card">
              <h3>💪 Multi-Goal Tracking</h3>
              <p>Manage multiple goals simultaneously - weight loss, strength gains, endurance, flexibility, and more</p>
            </div>
            <div className="feature-card">
              <h3>🔔 Smart Reminders</h3>
              <p>Get timely nudges and motivational messages when you need them most to stay on track</p>
            </div>
            <div className="feature-card">
              <h3>📸 Before & After Gallery</h3>
              <p>Document your transformation with progress photos and side-by-side comparisons that show real results</p>
            </div>
          </div>
        </section>

        <section className="cta-section">
          <h2>Ready to Achieve Your Goals?</h2>
          <Link to="/signup" className="cta-button">Start Setting Goals</Link>
        </section>
      </div>
    </div>
  );
};

export default GoalManagement;
