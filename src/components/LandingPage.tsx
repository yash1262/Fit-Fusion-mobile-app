import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import FitFusionLogo from './FitFusionLogo';
import WeatherMealNotification from './WeatherMealNotification';

const LandingPage: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [showNotification, setShowNotification] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (totalScroll / windowHeight) * 100;
      setScrollProgress(scrolled);

      const navbar = document.querySelector('.navbar');
      if (navbar) {
        if (totalScroll > 50) {
          navbar.classList.add('scrolled');
        } else {
          navbar.classList.remove('scrolled');
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -100px 0px' }
    );

    document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const featureCategories = [
    {
      category: "AI-Powered Smart Workout",
      description: "Personalized workout recommendations powered by artificial intelligence",
      features: [
        "AI analyzes your sleep, stress, and activity levels",
        "Daily personalized workout video recommendations",
        "Adaptive intensity based on muscle soreness",
        "Schedule-aware quick workouts for busy days",
        "Weather-based indoor/outdoor suggestions",
        "Real-time reasoning for every recommendation"
      ],
      icon: "🤖",
      gradient: "linear-gradient(135deg, #708d50 0%, #5a7340 100%)",
      link: "/smart-workout"
    },
    {
      category: "Comprehensive Workout Tracking",
      description: "Advanced exercise monitoring with real-time analytics",
      features: [
        "Multi-sport activity tracking with GPS precision",
        "Real-time heart rate and performance monitoring",
        "Customizable workout timers and interval training",
        "Exercise form analysis and technique improvement",
        "Progress tracking across 50+ workout types",
        "Integration with wearable devices and fitness equipment"
      ],
      icon: "🏋️‍♂️",
      gradient: "linear-gradient(135deg, #708d50 0%, #5a7340 100%)"
    },
    {
      category: "Smart Nutrition Management",
      description: "Intelligent meal tracking and dietary optimization",
      features: [
        "Advanced barcode scanning with comprehensive food database",
        "Macro and micronutrient tracking with detailed analytics",
        "AI-powered meal planning based on your goals",
        "Recipe suggestions with nutritional breakdowns",
        "Hydration monitoring with smart reminders",
        "Restaurant menu integration and dining out support"
      ],
      icon: "🥗",
      gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
    },
    {
      category: "Advanced Progress Analytics",
      description: "Data-driven insights for continuous improvement",
      features: [
        "Comprehensive body composition analysis",
        "Performance trends and predictive analytics",
        "Achievement system with personalized milestones",
        "Photo progress tracking with AI analysis",
        "Sleep quality monitoring and optimization",
        "Stress level tracking and management recommendations"
      ],
      icon: "📊",
      gradient: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)"
    },
    {
      category: "Personalized AI Coaching",
      description: "Intelligent recommendations tailored to your journey",
      features: [
        "Adaptive workout programs that evolve with progress",
        "Weather-based activity suggestions and planning",
        "Injury prevention and recovery guidance",
        "Motivational coaching based on behavior patterns",
        "Goal-oriented training plans with automatic adjustments",
        "Performance optimization through machine learning"
      ],
      icon: "🤖",
      gradient: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)"
    },
    {
      category: "Social & Community Features",
      description: "Connect, compete, and stay motivated together",
      features: [
        "Challenge friends and join fitness competitions",
        "Share achievements and progress with community",
        "Follow fitness influencers and certified trainers",
        "Group workout sessions and virtual training",
        "Leaderboards and friendly competition tracking",
        "Motivational support network and accountability partners"
      ],
      icon: "👥",
      gradient: "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)"
    },
    {
      category: "Enterprise-Grade Security",
      description: "Your health data protected with military-grade encryption",
      features: [
        "End-to-end encryption for all personal health data",
        "GDPR and HIPAA compliant data handling",
        "Biometric authentication and secure access",
        "Privacy controls with granular data sharing options",
        "Regular security audits and penetration testing",
        "Local data storage options with cloud sync flexibility"
      ],
      icon: "🔒",
      gradient: "linear-gradient(135deg, #708d50 0%, #5a7340 100%)"
    }
  ];

  return (
    <div className="landing-page">
      {/* Weather Meal Notification */}
      {showNotification && (
        <WeatherMealNotification onClose={() => setShowNotification(false)} />
      )}
      
      {/* Scroll Progress Indicator */}
      <div className="scroll-progress" style={{ width: `${scrollProgress}%` }} />

      {/* Premium Navigation */}
      <nav className="navbar">
        <div className="container">
          <div className="nav-wrapper">
            <Link to="/landing" className="brand-logo">
              <FitFusionLogo width={40} height={40} />
              <span className="brand-text">Fit Fusion</span>
            </Link>

            <ul className="nav-menu">
              <li><Link to="/landing" className="nav-link active">Home</Link></li>
              
              <li 
                className="nav-dropdown-wrapper"
                onMouseEnter={() => setActiveDropdown('features')}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <a href="#features" className="nav-link">Features</a>
                <div className={`mega-dropdown ${activeDropdown === 'features' ? 'active' : ''}`}>
                  <div className="dropdown-grid">
                    <div className="dropdown-section">
                      <h4>Tracking & Analytics</h4>
                      <Link to="/workout">Workout Monitoring</Link>
                      <Link to="/diet">Nutrition Tracking</Link>
                      <Link to="/progress">Progress Analytics</Link>
                      <Link to="/goals">Goal Management</Link>
                    </div>
                    <div className="dropdown-section">
                      <h4>AI & Personalization</h4>
                      <Link to="/smart-workout">🤖 Smart Workout AI</Link>
                      <Link to="/ai-coach">AI Personal Coach</Link>
                      <Link to="/adaptive">Adaptive Programs</Link>
                      <Link to="/insights">Health Insights</Link>
                    </div>
                    <div className="dropdown-section">
                      <h4>Social & Community</h4>
                      <Link to="/challenges">Fitness Challenges</Link>
                    </div>
                  </div>
                </div>
              </li>

              <li
                className="nav-dropdown-wrapper"
                onMouseEnter={() => setActiveDropdown('solutions')}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <a href="#solutions" className="nav-link">Solutions</a>
                <div className={`mega-dropdown ${activeDropdown === 'solutions' ? 'active' : ''}`}>
                  <div className="dropdown-grid">
                    <div className="dropdown-section">
                      <h4>For Individuals</h4>
                      <Link to="/personal">Personal Training</Link>
                      <Link to="/weight-loss">Weight Management</Link>
                      <Link to="/muscle-gain">Muscle Building</Link>
                      <Link to="/endurance">Endurance Training</Link>
                    </div>
                    <div className="dropdown-section">
                      <h4>For Professionals</h4>
                      <Link to="/trainers">Personal Trainers</Link>
                      <Link to="/gyms">Fitness Centers</Link>
                      <Link to="/corporate">Corporate Wellness</Link>
                      <Link to="/healthcare">Healthcare Providers</Link>
                    </div>
                  </div>
                </div>
              </li>

              <li><Link to="/about" className="nav-link">About</Link></li>
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
      <section className="hero">
        <div className="container">
          <div className="hero-content animate-on-scroll">
            <div className="hero-badge">
              <span className="badge-text">New in 2025</span>
              <span className="badge-highlight">AI-Powered Fitness Revolution</span>
            </div>
            
            <h1 className="hero-title">
              Transform Your Body.
              <span className="title-gradient">Elevate Your Mind.</span>
            </h1>
            
            <p className="hero-description">
              Experience the future of fitness with our comprehensive platform that combines 
              advanced workout tracking, intelligent nutrition management, and AI-powered 
              coaching to help you achieve your health goals faster than ever before.
            </p>

            <div className="hero-stats">
              <div className="stat-item">
                <div className="stat-number">500K+</div>
                <div className="stat-label">Active Users</div>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <div className="stat-number">50M+</div>
                <div className="stat-label">Workouts Tracked</div>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <div className="stat-number">95%</div>
                <div className="stat-label">Goal Achievement</div>
              </div>
            </div>

            <div className="hero-actions">
              <Link to="/signup" className="btn btn-primary btn-hero">
                Start Your Journey
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
                </svg>
              </Link>
              <Link to="/demo" className="btn btn-secondary btn-hero">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                     <path d="M8 5v14l11-7z" />
                </svg>
                   Watch Demo
              </Link>

            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section">
        <div className="container">
          <div className="section-header animate-on-scroll">
            <div className="section-badge">Features</div>
            <h2 className="section-title">Everything You Need for Complete Fitness</h2>
            <p className="section-description">
              Our comprehensive suite of tools and features provides everything you need 
              to track, analyze, and optimize your fitness journey with professional-grade precision.
            </p>
          </div>

          <div className="features-grid">
            {featureCategories.map((category, index) => {
              const content = (
                <>
                  <div className="feature-header">
                    <div className="feature-icon" style={{ background: category.gradient }}>
                      <span className="icon-emoji">{category.icon}</span>
                    </div>
                    <div className="feature-title-wrapper">
                      <h3 className="feature-title">{category.category}</h3>
                      <p className="feature-subtitle">{category.description}</p>
                    </div>
                  </div>

                  <div className="feature-list">
                    {category.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="feature-item">
                        <div className="feature-check">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                          </svg>
                        </div>
                        <span className="feature-text">{feature}</span>
                      </div>
                    ))}
                  </div>
                  {category.link && (
                    <div className="feature-cta">
                      Try Now →
                    </div>
                  )}
                </>
              );

              return category.link ? (
                <Link
                  key={index}
                  to={category.link}
                  className={`feature-card animate-on-scroll clickable`}
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  {content}
                </Link>
              ) : (
                <div
                  key={index}
                  className={`feature-card animate-on-scroll`}
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  {content}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="technology-section">
        <div className="container">
          <div className="section-header animate-on-scroll">
            <div className="section-badge">Technology</div>
            <h2 className="section-title">Built for Performance and Privacy</h2>
            <p className="section-description">
              Powered by cutting-edge technology and designed with your privacy as the top priority.
            </p>
          </div>

          <div className="tech-grid">
            <div className="tech-card animate-on-scroll">
              <div className="tech-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
                </svg>
              </div>
              <h3 className="tech-title">Military-Grade Security</h3>
              <p className="tech-description">
                Your health data is protected with end-to-end encryption and HIPAA-compliant 
                security measures that exceed industry standards.
              </p>
            </div>

            <div className="tech-card animate-on-scroll">
              <div className="tech-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
              <h3 className="tech-title">AI-Powered Intelligence</h3>
              <p className="tech-description">
                Advanced machine learning algorithms analyze your patterns and provide 
                personalized recommendations that adapt to your progress.
              </p>
            </div>

            <div className="tech-card animate-on-scroll">
              <div className="tech-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z"/>
                </svg>
              </div>
              <h3 className="tech-title">Universal Integration</h3>
              <p className="tech-description">
                Seamlessly connects with 200+ fitness devices, health apps, and wearables 
                for a truly unified fitness ecosystem.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content animate-on-scroll">
            <h2 className="cta-title">Ready to Transform Your Fitness Journey?</h2>
            <p className="cta-description">
              Join thousands of users who have already achieved their fitness goals with Fit Fusion.
              Start your transformation today with our comprehensive fitness platform.
            </p>
            <div className="cta-actions">
              <Link to="/signup" className="btn btn-primary btn-hero">
                Get Started Free
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
                </svg>
              </Link>
              <Link to="/contact" className="btn btn-outline btn-hero">
                Contact Sales
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <div className="footer-logo">
                <FitFusionLogo width={32} height={32} />
                <span>Fit Fusion</span>
              </div>
              <p className="footer-description">
                The most comprehensive fitness platform designed to help you achieve 
                your health and wellness goals with cutting-edge technology and personalized guidance.
              </p>
            </div>

            <div className="footer-links">
              <div className="footer-column">
                <h4>Product</h4>
                <Link to="/features">Features</Link>
                <Link to="/pricing">Pricing</Link>
                <Link to="/integrations">Integrations</Link>
                <Link to="/api">API</Link>
              </div>

              <div className="footer-column">
                <h4>Solutions</h4>
                <Link to="/personal">Personal</Link>
                <Link to="/trainers">For Trainers</Link>
                <Link to="/gyms">For Gyms</Link>
                <Link to="/enterprise">Enterprise</Link>
              </div>

              <div className="footer-column">
                <h4>Resources</h4>
                <Link to="/blog">Blog</Link>
                <Link to="/help">Help Center</Link>
                <Link to="/guides">Fitness Guides</Link>
                <Link to="/community">Community</Link>
              </div>

              <div className="footer-column">
                <h4>Company</h4>
                <Link to="/about">About Us</Link>
                <Link to="/careers">Careers</Link>
                <Link to="/press">Press Kit</Link>
                <Link to="/contact">Contact</Link>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <div className="footer-legal">
              <p>&copy; {new Date().getFullYear()} Fit Fusion. All rights reserved.</p>
              <div className="legal-links">
                <Link to="/privacy">Privacy Policy</Link>
                <Link to="/terms">Terms of Service</Link>
                <Link to="/cookies">Cookie Policy</Link>
              </div>
            </div>
          </div>
        </div>
      </footer>

      <style>{`
        .landing-page {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          color: #1a1a1a;
          background: #ffffff;
          line-height: 1.6;
        }

        /* Scroll Progress */
        .scroll-progress {
          position: fixed;
          top: 0;
          left: 0;
          height: 3px;
          background: linear-gradient(90deg, #708d50, #5a7340);
          z-index: 10000;
          transition: width 0.3s ease;
        }

        /* Navigation */
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

        .navbar.scrolled {
          background: rgba(255, 255, 255, 0.98);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
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
          transition: transform 0.3s ease;
        }

        .brand-logo:hover {
          transform: scale(1.02);
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
          position: relative;
        }

        .nav-link.active {
          color: #708d50;
          background: rgba(112, 141, 80, 0.1);
        }

        .nav-link:hover {
          color: #708d50;
          background: rgba(112, 141, 80, 0.08);
        }

        .nav-dropdown-wrapper {
          position: relative;
        }

        .mega-dropdown {
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translateX(-50%) translateY(10px);
          background: white;
          border-radius: 16px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
          border: 1px solid rgba(0, 0, 0, 0.08);
          min-width: 600px;
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s ease;
          z-index: 1001;
        }

        .mega-dropdown.active {
          opacity: 1;
          visibility: visible;
          transform: translateX(-50%) translateY(0);
        }

        .dropdown-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 0;
          padding: 1.5rem;
        }

        .dropdown-section h4 {
          font-size: 0.875rem;
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .dropdown-section a {
          display: block;
          color: #6a6a6a;
          text-decoration: none;
          padding: 0.5rem 0.75rem;
          border-radius: 6px;
          font-size: 0.9rem;
          transition: all 0.2s ease;
          margin-bottom: 0.25rem;
        }

        .dropdown-section a:hover {
          color: #708d50;
          background: rgba(112, 141, 80, 0.08);
          transform: translateX(4px);
        }

        .nav-actions {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        /* Buttons */
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
          position: relative;
          overflow: hidden;
        }

        .btn:hover {
          transform: translateY(-2px);
        }

        .btn-primary {
          background: linear-gradient(135deg, #708d50, #5a7340);
          color: white;
          box-shadow: 0 8px 20px rgba(112, 141, 80, 0.3);
        }

        .btn-primary:hover {
          box-shadow: 0 12px 30px rgba(112, 141, 80, 0.4);
        }

        .btn-secondary {
          background: white;
          color: #708d50;
          border: 2px solid #708d50;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        }

        .btn-secondary:hover {
          background: #708d50;
          color: white;
        }

        .btn-ghost {
          background: transparent;
          color: #4a4a4a;
          border: 1px solid rgba(0, 0, 0, 0.12);
        }

        .btn-ghost:hover {
          background: rgba(0, 0, 0, 0.05);
          border-color: rgba(0, 0, 0, 0.2);
        }

        .btn-outline {
          background: transparent;
          color: white;
          border: 2px solid rgba(255, 255, 255, 0.3);
        }

        .btn-outline:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 255, 255, 0.5);
        }

        .btn-hero {
          padding: 1rem 2rem;
          font-size: 1.1rem;
          border-radius: 12px;
        }

        /* Hero Section */
        .hero {
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          padding: 8rem 0 4rem;
          position: relative;
          overflow: hidden;
        }

        .hero::before {
          content: '';
          position: absolute;
          top: 0;
          right: -20%;
          width: 40%;
          height: 100%;
          background: linear-gradient(135deg, rgba(112, 141, 80, 0.05), rgba(90, 115, 64, 0.05));
          border-radius: 50% 0 0 50%;
          transform: rotate(-10deg);
        }

        .hero-content {
          max-width: 800px;
          margin: 0 auto;
          text-align: center;
          position: relative;
          z-index: 2;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.75rem;
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

        .badge-highlight {
          font-size: 0.875rem;
          font-weight: 500;
          color: #4a4a4a;
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
          margin-bottom: 3rem;
          line-height: 1.6;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }

        .hero-stats {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1.5rem;
          margin-bottom: 3rem;
          padding: 1.5rem 2rem;
          background: white;
          border-radius: 16px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
          max-width: 700px;
          width: 100%;
          margin-left: auto;
          margin-right: auto;
        }

        .stat-item {
          text-align: center;
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.25rem;
        }

        .stat-number {
          font-size: 2rem;
          font-weight: 800;
          color: #708d50;
          white-space: nowrap;
          line-height: 1;
        }

        .stat-label {
          font-size: 0.75rem;
          color: #6a6a6a;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          line-height: 1.2;
        }

        .stat-divider {
          width: 1px;
          height: 40px;
          background: rgba(0, 0, 0, 0.1);
          flex-shrink: 0;
        }

        .hero-actions {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        /* Sections */
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
        }

        .features-section {
          padding: 6rem 0;
          background: white;
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

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
          gap: 2rem;
        }

        .feature-card {
          background: white;
          border: 1px solid rgba(0, 0, 0, 0.08);
          border-radius: 20px;
          padding: 2rem;
          transition: all 0.4s ease;
          position: relative;
          overflow: hidden;
        }

        .feature-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(135deg, #708d50, #5a7340);
          transform: scaleX(0);
          transition: transform 0.4s ease;
        }

        .feature-card:hover::before {
          transform: scaleX(1);
        }

        .feature-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
          border-color: rgba(112, 141, 80, 0.2);
        }

        .feature-card.clickable {
          cursor: pointer;
          text-decoration: none;
          color: inherit;
        }

        .feature-cta {
          margin-top: 1.5rem;
          padding-top: 1.5rem;
          border-top: 1px solid rgba(0, 0, 0, 0.08);
          color: #708d50;
          font-weight: 700;
          font-size: 1rem;
          text-align: center;
          transition: transform 0.3s ease;
        }

        .feature-card.clickable:hover .feature-cta {
          transform: translateX(4px);
        }

        .feature-header {
          display: flex;
          gap: 1rem;
          margin-bottom: 1.5rem;
          align-items: flex-start;
        }

        .feature-icon {
          width: 60px;
          height: 60px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          flex-shrink: 0;
        }

        .feature-title-wrapper {
          flex: 1;
        }

        .feature-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 0.5rem;
        }

        .feature-subtitle {
          font-size: 0.95rem;
          color: #6a6a6a;
          line-height: 1.4;
        }

        .feature-list {
          display: grid;
          gap: 0.75rem;
        }

        .feature-item {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
        }

        .feature-check {
          width: 20px;
          height: 20px;
          background: linear-gradient(135deg, #708d50, #5a7340);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          flex-shrink: 0;
          margin-top: 0.125rem;
        }

        .feature-text {
          font-size: 0.95rem;
          color: #4a4a4a;
          line-height: 1.5;
        }

        /* Technology Section */
        .technology-section {
          padding: 6rem 0;
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
        }

        .tech-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
        }

        .tech-card {
          background: white;
          border-radius: 20px;
          padding: 2rem;
          text-align: center;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
          transition: all 0.4s ease;
        }

        .tech-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
        }

        .tech-icon {
          width: 64px;
          height: 64px;
          background: linear-gradient(135deg, #708d50, #5a7340);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          margin: 0 auto 1.5rem;
        }

        .tech-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 1rem;
        }

        .tech-description {
          color: #4a4a4a;
          line-height: 1.6;
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
          padding: 4rem 0 2rem;
        }

        .footer-content {
          display: grid;
          grid-template-columns: 1fr 2fr;
          gap: 4rem;
          margin-bottom: 3rem;
        }

        .footer-brand {
          max-width: 350px;
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
          margin-bottom: 1.5rem;
        }

        .footer-links {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 2rem;
        }

        .footer-column h4 {
          color: white;
          font-weight: 600;
          margin-bottom: 1rem;
        }

        .footer-column a {
          display: block;
          color: #a0a0a0;
          text-decoration: none;
          padding: 0.25rem 0;
          transition: color 0.3s ease;
        }

        .footer-column a:hover {
          color: #708d50;
        }

        .footer-bottom {
          padding-top: 2rem;
          border-top: 1px solid #333;
        }

        .footer-legal {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .legal-links {
          display: flex;
          gap: 2rem;
        }

        .legal-links a {
          color: #a0a0a0;
          text-decoration: none;
          transition: color 0.3s ease;
        }

        .legal-links a:hover {
          color: #708d50;
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

          .hero {
            padding: 6rem 0 3rem;
          }

          .hero-stats {
            flex-direction: column;
            gap: 1rem;
            padding: 1rem;
            max-width: 100%;
          }

          .stat-item {
            width: 100%;
          }

          .stat-divider {
            width: 100%;
            height: 1px;
          }

          .features-grid {
            grid-template-columns: 1fr;
          }

          .feature-header {
            flex-direction: column;
            text-align: center;
          }

          .footer-content {
            grid-template-columns: 1fr;
            gap: 2rem;
          }

          .footer-legal {
            flex-direction: column;
            text-align: center;
          }

          .btn-hero {
            width: 100%;
            max-width: 280px;
          }
        }
      `}</style>
    </div>
  );
};

export default LandingPage;