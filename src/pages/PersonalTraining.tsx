import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

const PersonalTraining: React.FC = () => {
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
          <h1>Personal Training</h1>
          <p>Transform your fitness journey with personalized training programs</p>
        </section>

        <section className="features-section">
          <h2>What You Get</h2>
          <div className="features-grid">
            <div className="feature-card">
              <h3>Custom Workout Plans</h3>
              <p>Tailored exercises designed specifically for your goals and fitness level</p>
            </div>
            <div className="feature-card">
              <h3>AI-Powered Coaching</h3>
              <p>Get real-time feedback and adjustments to optimize your training</p>
            </div>
            <div className="feature-card">
              <h3>Progress Tracking</h3>
              <p>Monitor your improvements with detailed analytics and insights</p>
            </div>
            <div className="feature-card">
              <h3>Nutrition Guidance</h3>
              <p>Personalized meal plans to complement your training routine</p>
            </div>
          </div>
        </section>

        <section className="cta-section">
          <h2>Ready to Start Your Journey?</h2>
          <Link to="/signup" className="cta-button">Get Started Today</Link>
        </section>
      </div>
    </div>
  );
};

export default PersonalTraining;
