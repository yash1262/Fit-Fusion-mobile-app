import React, { useEffect } from 'react';
import FitFusionLogo from "./FitFusionLogo";
import { Link } from 'react-router-dom';

const About: React.FC = () => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
          }
        });
      },
      { threshold: 0.15 }
    );

    document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="about-page">
      {/* Navigation */}
      <nav className="navbar">
        <div className="container">
          <div className="nav-wrapper">
            <Link to="/landing" className="brand-logo">
              <FitFusionLogo width={40} height={40} />
              <span className="brand-text">Fit Fusion</span>
            </Link>
            <ul className="nav-menu">
              <li><Link to="/landing" className="nav-link">Home</Link></li>
              <li><Link to="/features" className="nav-link">Features</Link></li>
              <li><Link to="/about" className="nav-link active">About</Link></li>
              <li><Link to="/contact" className="nav-link">Contact</Link></li>
              <li className="nav-actions">
                <Link to="/signin" className="btn btn-ghost">Sign In</Link>
                <Link to="/signup" className="btn btn-primary">Start Free</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-about">
        <div className="container">
          <div className="hero-content animate-on-scroll">
            <div className="hero-badge">
              <span className="badge-text">About Fit Fusion</span>
            </div>
            <h1 className="hero-title">
              Revolutionizing Fitness Through 
              <span className="title-gradient">Intelligent Technology</span>
            </h1>
            <p className="hero-description">
              We're building the future of personal fitness by combining advanced AI, 
              comprehensive health tracking, and user-centric design to create a platform 
              that truly understands and adapts to your unique fitness journey.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="mission-vision">
        <div className="container">
          <div className="content-grid">
            <div className="mission-card animate-on-scroll">
              <div className="card-header">
                <div className="card-icon mission-icon">
                  <FitFusionLogo width={32} height={32} />
                </div>
                <h2 className="card-title">Our Mission</h2>
              </div>
              <p className="card-description">
                To democratize access to intelligent fitness coaching by creating a comprehensive 
                platform that makes professional-grade health tracking, personalized workout programming, 
                and nutrition management accessible to everyone, regardless of their fitness level 
                or technical expertise.
              </p>
              <div className="mission-points">
                <div className="point-item">
                  <div className="point-check">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                    </svg>
                  </div>
                  <span>Make fitness accessible to everyone</span>
                </div>
                <div className="point-item">
                  <div className="point-check">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                    </svg>
                  </div>
                  <span>Leverage AI for personalized coaching</span>
                </div>
                <div className="point-item">
                  <div className="point-check">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                    </svg>
                  </div>
                  <span>Protect user data with enterprise-grade security</span>
                </div>
              </div>
            </div>

            <div className="vision-card animate-on-scroll">
              <div className="card-header">
                <div className="card-icon vision-icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                  </svg>
                </div>
                <h2 className="card-title">Our Vision</h2>
              </div>
              <p className="card-description">
                To become the world's most trusted fitness companion, empowering millions of users 
                to achieve their health goals through intelligent technology that learns, adapts, 
                and evolves with them throughout their fitness journey.
              </p>
              <div className="vision-goals">
                <div className="goal-item">
                  <div className="goal-number">2025</div>
                  <div className="goal-text">Launch comprehensive platform</div>
                </div>
                <div className="goal-item">
                  <div className="goal-number">1M+</div>
                  <div className="goal-text">Users by 2026</div>
                </div>
                <div className="goal-item">
                  <div className="goal-number">Global</div>
                  <div className="goal-text">Expansion by 2027</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="values-section">
        <div className="container">
          <div className="section-header animate-on-scroll">
            <div className="section-badge">Our Values</div>
            <h2 className="section-title">What Drives Us Forward</h2>
            <p className="section-description">
              These core principles guide every decision we make and every feature we build.
            </p>
          </div>

          <div className="values-grid">
            {[
              {
                icon: "🔒",
                title: "Privacy First",
                description: "Your health data belongs to you. We implement military-grade encryption and never sell your personal information.",
                gradient: "linear-gradient(135deg, #708d50 0%, #5a7340 100%)"
              },
              {
                icon: "🧠",
                title: "Intelligent Design",
                description: "Every feature is thoughtfully designed to provide maximum value while maintaining simplicity and ease of use.",
                gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
              },
              {
                icon: "🚀",
                title: "Continuous Innovation",
                description: "We constantly evolve our platform based on user feedback and the latest advances in health technology.",
                gradient: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)"
              },
              {
                icon: "🤝",
                title: "Inclusive Community",
                description: "Fitness is for everyone. We build features that accommodate all abilities, backgrounds, and fitness levels.",
                gradient: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)"
              },
              {
                icon: "⚡",
                title: "Performance Excellence",
                description: "Fast, reliable, and accurate. We maintain the highest standards of technical performance and data precision.",
                gradient: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)"
              },
              {
                icon: "🌱",
                title: "Sustainable Impact",
                description: "Building long-term wellness habits that create lasting positive change in people's lives and communities.",
                gradient: "linear-gradient(135deg, #a8e6cf 0%, #dcedc1 100%)"
              }
            ].map((value, index) => (
              <div key={index} className="value-card animate-on-scroll" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="value-icon" style={{ background: value.gradient }}>
                  <span>{value.icon}</span>
                </div>
                <h3 className="value-title">{value.title}</h3>
                <p className="value-description">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="technology-section">
        <div className="container">
          <div className="section-header animate-on-scroll">
            <div className="section-badge">Technology</div>
            <h2 className="section-title">Built with Modern Technology</h2>
            <p className="section-description">
              Our platform leverages cutting-edge technologies to deliver a fast, secure, and scalable experience.
            </p>
          </div>

          <div className="tech-categories">
            <div className="tech-category animate-on-scroll">
              <h3 className="category-title">Frontend</h3>
              <div className="tech-tags">
                <span className="tech-tag">React 18</span>
                <span className="tech-tag">TypeScript</span>
                <span className="tech-tag">Next.js</span>
                <span className="tech-tag">Tailwind CSS</span>
              </div>
            </div>

            <div className="tech-category animate-on-scroll">
              <h3 className="category-title">AI & Machine Learning</h3>
              <div className="tech-tags">
                <span className="tech-tag">TensorFlow</span>
                <span className="tech-tag">PyTorch</span>
                <span className="tech-tag">OpenAI API</span>
                <span className="tech-tag">Computer Vision</span>
              </div>
            </div>

            <div className="tech-category animate-on-scroll">
              <h3 className="category-title">Security & Infrastructure</h3>
              <div className="tech-tags">
                <span className="tech-tag">End-to-End Encryption</span>
                <span className="tech-tag">AWS</span>
                <span className="tech-tag">HIPAA Compliance</span>
                <span className="tech-tag">Zero Trust Architecture</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content animate-on-scroll">
            <h2 className="cta-title">Ready to Join the Fitness Revolution?</h2>
            <p className="cta-description">
              Experience the future of fitness with our intelligent platform designed to help you achieve your goals.
            </p>
            <div className="cta-actions">
              <Link to="/signup" className="btn btn-primary btn-hero">
                Start Your Journey
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
                </svg>
              </Link>
              <Link to="/contact" className="btn btn-outline btn-hero">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-simple">
            <div className="footer-brand">
              <div className="footer-logo">
                <FitFusionLogo width={28} height={28} />
                <span>Fit Fusion</span>
              </div>
              <p className="footer-description">
                Transforming fitness through intelligent technology and personalized coaching.
              </p>
            </div>
            <div className="footer-links">
              <Link to="/privacy">Privacy Policy</Link>
              <Link to="/terms">Terms of Service</Link>
              <Link to="/contact">Contact Us</Link>
              <Link to="/careers">Careers</Link>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; {new Date().getFullYear()} Fit Fusion. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <style>{`
        .about-page {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          color: #1a1a1a;
          background: #ffffff;
          line-height: 1.6;
        }

        /* Navigation (reuse from LandingPage) */
        .navbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(0, 0, 0, 0.08);
          z-index: 1000;
          transition: all 0.3s ease;
        }

        .nav-wrapper {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 0;
        }

        .brand-logo {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          text-decoration: none;
          color: #1a1a1a;
        }

        .logo-icon {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #708d50, #5a7340);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .brand-text {
          font-size: 1.5rem;
          font-weight: 800;
          letter-spacing: -0.5px;
        }

        .nav-menu {
          display: flex;
          align-items: center;
          gap: 0;
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .nav-link {
          text-decoration: none;
          color: #4a4a4a;
          font-weight: 500;
          font-size: 0.95rem;
          padding: 0.75rem 1.25rem;
          border-radius: 8px;
          transition: all 0.3s ease;
        }

        .nav-link.active {
          color: #708d50;
          background: rgba(112, 141, 80, 0.1);
        }

        .nav-actions {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          border-radius: 10px;
          text-decoration: none;
          font-weight: 600;
          font-size: 0.95rem;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn-primary {
          background: linear-gradient(135deg, #708d50, #5a7340);
          color: white;
          box-shadow: 0 8px 20px rgba(112, 141, 80, 0.3);
        }

        .btn-ghost {
          background: transparent;
          color: #4a4a4a;
          border: 1px solid rgba(0, 0, 0, 0.12);
        }

        .btn-outline {
          background: transparent;
          color: #708d50;
          border: 2px solid #708d50;
        }

        .btn-hero {
          padding: 1rem 2rem;
          font-size: 1.1rem;
          border-radius: 12px;
        }

        /* Hero Section */
        .hero-about {
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          padding: 8rem 0 4rem;
          text-align: center;
        }

        .hero-content {
          max-width: 800px;
          margin: 0 auto;
        }

        .hero-badge {
          display: inline-block;
          background: white;
          border: 1px solid rgba(112, 141, 80, 0.2);
          border-radius: 50px;
          padding: 0.5rem 1.25rem;
          margin-bottom: 2rem;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        }

        .badge-text {
          font-size: 0.875rem;
          font-weight: 600;
          color: #708d50;
        }

        .hero-title {
          font-size: clamp(2.5rem, 5vw, 4rem);
          font-weight: 900;
          line-height: 1.1;
          color: #1a1a1a;
          margin-bottom: 1.5rem;
          letter-spacing: -0.02em;
        }

        .title-gradient {
          background: linear-gradient(135deg, #708d50, #5a7340);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero-description {
          font-size: 1.25rem;
          color: #4a4a4a;
          line-height: 1.6;
          max-width: 600px;
          margin: 0 auto;
        }

        /* Mission & Vision */
        .mission-vision {
          padding: 6rem 0;
          background: white;
        }

        .content-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 3rem;
        }

        .mission-card,
        .vision-card {
          background: white;
          border: 1px solid rgba(0, 0, 0, 0.08);
          border-radius: 24px;
          padding: 2.5rem;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
        }

        .card-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .card-icon {
          width: 64px;
          height: 64px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .mission-icon {
          background: linear-gradient(135deg, #708d50, #5a7340);
        }

        .vision-icon {
          background: linear-gradient(135deg, #4facfe, #00f2fe);
        }

        .card-title {
          font-size: 1.75rem;
          font-weight: 800;
          color: #1a1a1a;
        }

        .card-description {
          font-size: 1.125rem;
          color: #4a4a4a;
          line-height: 1.6;
          margin-bottom: 2rem;
        }

        .mission-points {
          display: grid;
          gap: 1rem;
        }

        .point-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .point-check {
          width: 24px;
          height: 24px;
          background: linear-gradient(135deg, #708d50, #5a7340);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          flex-shrink: 0;
        }

        .vision-goals {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
        }

        .goal-item {
          text-align: center;
        }

        .goal-number {
          font-size: 1.5rem;
          font-weight: 800;
          color: #00a8cc;
          margin-bottom: 0.5rem;
        }

        .goal-text {
          font-size: 0.9rem;
          color: #6a6a6a;
          font-weight: 500;
        }

        /* Values Section */
        .values-section {
          padding: 6rem 0;
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
        }

        .section-header {
          text-align: center;
          margin-bottom: 4rem;
          max-width: 700px;
          margin-left: auto;
          margin-right: auto;
        }

        .section-badge {
          display: inline-block;
          background: linear-gradient(135deg, #708d50, #5a7340);
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.875rem;
          font-weight: 600;
          margin-bottom: 1rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .section-title {
          font-size: clamp(2rem, 4vw, 3rem);
          font-weight: 800;
          color: #1a1a1a;
          margin-bottom: 1rem;
          line-height: 1.2;
        }

        .section-description {
          font-size: 1.125rem;
          color: #4a4a4a;
          line-height: 1.6;
        }

        .values-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
        }

        .value-card {
          background: white;
          border-radius: 20px;
          padding: 2rem;
          text-align: center;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
          transition: all 0.4s ease;
        }

        .value-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
        }

        .value-icon {
          width: 64px;
          height: 64px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          margin: 0 auto 1.5rem;
        }

        .value-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 1rem;
        }

        .value-description {
          color: #4a4a4a;
          line-height: 1.6;
        }

        /* Technology Section */
        .technology-section {
          padding: 6rem 0;
          background: white;
        }

        .tech-categories {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 3rem;
        }

        .tech-category {
          text-align: center;
        }

        .category-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 1.5rem;
        }

        .tech-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
          justify-content: center;
        }

        .tech-tag {
          background: linear-gradient(135deg, #708d50, #5a7340);
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.875rem;
          font-weight: 500;
        }

        /* CTA Section */
        .cta-section {
          background: linear-gradient(135deg, #708d50, #5a7340);
          color: white;
          padding: 6rem 0;
          text-align: center;
        }

        .cta-content {
          max-width: 600px;
          margin: 0 auto;
        }

        .cta-title {
          font-size: clamp(2rem, 4vw, 2.5rem);
          font-weight: 800;
          margin-bottom: 1rem;
        }

        .cta-description {
          font-size: 1.125rem;
          opacity: 0.9;
          margin-bottom: 2.5rem;
          line-height: 1.6;
        }

        .cta-actions {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        .cta-section .btn-primary {
          background: white;
          color: #708d50;
        }

        /* Footer */
        .footer {
          background: #1a1a1a;
          color: #a0a0a0;
          padding: 3rem 0 2rem;
        }

        .footer-simple {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .footer-brand {
          max-width: 400px;
        }

        .footer-logo {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1rem;
          color: white;
          font-size: 1.25rem;
          font-weight: 800;
        }

        .footer-description {
          line-height: 1.6;
        }

        .footer-links {
          display: flex;
          gap: 2rem;
        }

        .footer-links a {
          color: #a0a0a0;
          text-decoration: none;
          transition: color 0.3s ease;
        }

        .footer-links a:hover {
          color: #708d50;
        }

        .footer-bottom {
          padding-top: 2rem;
          border-top: 1px solid #333;
          text-align: center;
        }

        /* Animations */
        .animate-on-scroll {
          opacity: 0;
          transform: translateY(40px);
          transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        .animate-on-scroll.animate-in {
          opacity: 1;
          transform: translateY(0);
        }

        /* Responsive */
        @media (max-width: 768px) {
          .nav-menu {
            display: none;
          }

          .hero-about {
            padding: 6rem 0 3rem;
          }

          .content-grid {
            grid-template-columns: 1fr;
            gap: 2rem;
          }

          .values-grid {
            grid-template-columns: 1fr;
          }

          .tech-categories {
            grid-template-columns: 1fr;
            gap: 2rem;
          }

          .footer-simple {
            flex-direction: column;
            gap: 2rem;
            text-align: center;
          }

          .footer-links {
            flex-wrap: wrap;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
};

export default About;
