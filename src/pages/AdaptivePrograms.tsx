import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

const AdaptivePrograms: React.FC = () => {
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
          <h1>Adaptive Programs</h1>
          <p>Workouts that evolve with you, powered by intelligent algorithms</p>
        </section>

        <section className="features-section">
          <h2>Training That Learns From You</h2>
          <div className="features-grid">
            <div className="feature-card">
              <h3>🧠 AI-Powered Adaptation</h3>
              <p>Programs automatically adjust intensity, volume, and exercises based on your performance, recovery, and feedback</p>
            </div>
            <div className="feature-card">
              <h3>📈 Progressive Overload</h3>
              <p>Smart progression system that gradually increases challenge to ensure continuous improvement without burnout</p>
            </div>
            <div className="feature-card">
              <h3>😴 Recovery-Based Scheduling</h3>
              <p>Workouts adapt to your sleep quality, stress levels, and muscle soreness for optimal training timing</p>
            </div>
            <div className="feature-card">
              <h3>🎚️ Dynamic Difficulty Scaling</h3>
              <p>Real-time adjustments during workouts based on heart rate, fatigue indicators, and performance metrics</p>
            </div>
            <div className="feature-card">
              <h3>🔄 Plateau Prevention</h3>
              <p>AI detects stagnation and automatically introduces variation to keep your body adapting and improving</p>
            </div>
            <div className="feature-card">
              <h3>🌡️ Environmental Adaptation</h3>
              <p>Programs adjust for weather, altitude, temperature, and available equipment to keep you training anywhere</p>
            </div>
            <div className="feature-card">
              <h3>⏱️ Time-Flexible Workouts</h3>
              <p>Busy day? Programs compress or extend based on your available time without sacrificing effectiveness</p>
            </div>
            <div className="feature-card">
              <h3>🩺 Injury-Aware Modifications</h3>
              <p>Automatically suggests alternative exercises and modifications when you report pain or discomfort</p>
            </div>
          </div>
        </section>

        <section className="cta-section">
          <h2>Experience Intelligent Training</h2>
          <Link to="/signup" className="cta-button">Try Adaptive Programs</Link>
        </section>
      </div>
    </div>
  );
};

export default AdaptivePrograms;
