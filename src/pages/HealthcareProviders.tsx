import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

const HealthcareProviders: React.FC = () => {
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
          <h1>For Healthcare Providers</h1>
          <p>Integrate fitness into patient care and chronic disease management</p>
        </section>

        <section className="features-section">
          <h2>Prescribe Exercise as Medicine</h2>
          <div className="features-grid">
            <div className="feature-card">
              <h3>Clinical Integration</h3>
              <p>HIPAA-compliant platform that integrates with EHR systems</p>
            </div>
            <div className="feature-card">
              <h3>Condition-Specific Programs</h3>
              <p>Evidence-based exercise protocols for diabetes, heart disease, and more</p>
            </div>
            <div className="feature-card">
              <h3>Patient Monitoring</h3>
              <p>Track patient adherence and health outcomes remotely</p>
            </div>
            <div className="feature-card">
              <h3>Referral Network</h3>
              <p>Connect patients with certified fitness professionals</p>
            </div>
          </div>
        </section>

        <section className="cta-section">
          <h2>Enhance Patient Outcomes</h2>
          <Link to="/contact" className="cta-button">Learn More</Link>
        </section>
      </div>
    </div>
  );
};

export default HealthcareProviders;
