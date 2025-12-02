import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

const MuscleBuilding: React.FC = () => {
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
          <h1>Muscle Building</h1>
          <p>Build strength and muscle mass with proven training methods</p>
        </section>

        <section className="features-section">
          <h2>Build Your Best Physique</h2>
          <div className="features-grid">
            <div className="feature-card">
              <h3>Progressive Overload</h3>
              <p>Structured programs that gradually increase intensity for optimal gains</p>
            </div>
            <div className="feature-card">
              <h3>Form Guidance</h3>
              <p>Video tutorials and AI feedback to ensure proper technique</p>
            </div>
            <div className="feature-card">
              <h3>Recovery Optimization</h3>
              <p>Smart scheduling to maximize muscle growth and prevent overtraining</p>
            </div>
            <div className="feature-card">
              <h3>Nutrition for Gains</h3>
              <p>High-protein meal plans designed to fuel muscle growth</p>
            </div>
          </div>
        </section>

        <section className="cta-section">
          <h2>Build Muscle the Smart Way</h2>
          <Link to="/signup" className="cta-button">Start Building</Link>
        </section>
      </div>
    </div>
  );
};

export default MuscleBuilding;
