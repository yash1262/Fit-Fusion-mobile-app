import React, { useState } from 'react';
import FitFusionLogo from "./FitFusionLogo";
import { Link } from 'react-router-dom';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    type: 'general'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));

    // Clear error when user starts typing
    if (errors[e.target.name]) {
      setErrors(prev => ({ ...prev, [e.target.name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setSubmitted(true);
    
    // Reset form
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: '',
      type: 'general'
    });
  };

  return (
    <div className="contact-page">
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
              <li><Link to="/about" className="nav-link">About</Link></li>
              <li><Link to="/contact" className="nav-link active">Contact</Link></li>
              <li><Link to="/signin" className="btn btn-outline">Sign In</Link></li>
              <li><Link to="/signup" className="btn btn-primary">Get Started</Link></li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-content animate-on-scroll">
            <h1 className="page-title">Get in Touch</h1>
            <p className="page-subtitle">
              Have questions about Fit Fusion? We're here to help you on your fitness journey.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Options */}
      <section className="contact-options">
        <div className="container">
          <div className="options-grid">
            {[
              {
                icon: '📧',
                title: 'Email Support',
                description: 'Get help with your account, technical issues, or general questions',
                contact: 'support@fitfusion.app',
                response: 'Response within 24 hours'
              },
              {
                icon: '💼',
                title: 'Business Inquiries',
                description: 'Partnership opportunities, enterprise solutions, and collaborations',
                contact: 'business@fitfusion.app',
                response: 'Response within 48 hours'
              },
              {
                icon: '🏢',
                title: 'Press & Media',
                description: 'Media inquiries, press releases, and interview requests',
                contact: 'press@fitfusion.app',
                response: 'Response within 72 hours'
              }
            ].map((option, index) => (
              <div key={index} className="contact-option-card animate-on-scroll">
                <div className="option-icon">{option.icon}</div>
                <h3 className="option-title">{option.title}</h3>
                <p className="option-description">{option.description}</p>
                <div className="option-contact">
                  <a href={`mailto:${option.contact}`} className="contact-email">
                    {option.contact}
                  </a>
                </div>
                <p className="option-response">{option.response}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="contact-form-section">
        <div className="container">
          <div className="form-container">
            <div className="form-card animate-on-scroll">
              <div className="form-header">
                <h2 className="form-title">Send us a Message</h2>
                <p className="form-description">
                  Fill out the form below and we'll get back to you as soon as possible.
                </p>
              </div>
              
              {submitted ? (
                <div className="success-message">
                  <div className="success-icon">✅</div>
                  <h3 className="success-title">Message Sent!</h3>
                  <p className="success-text">
                    Thank you for contacting us. We'll get back to you soon.
                  </p>
                  <button 
                    onClick={() => setSubmitted(false)} 
                    className="btn btn-primary"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="contact-form">
                  <div className="form-group">
                    <label className="form-label">Inquiry Type</label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                      className="form-input"
                    >
                      <option value="general">General Question</option>
                      <option value="support">Technical Support</option>
                      <option value="business">Business Inquiry</option>
                      <option value="partnership">Partnership</option>
                      <option value="feedback">Feedback</option>
                    </select>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Full Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`form-input ${errors.name ? 'error' : ''}`}
                        placeholder="Enter your full name"
                      />
                      {errors.name && <span className="error-text">{errors.name}</span>}
                    </div>
                    <div className="form-group">
                      <label className="form-label">Email Address</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`form-input ${errors.email ? 'error' : ''}`}
                        placeholder="your@email.com"
                      />
                      {errors.email && <span className="error-text">{errors.email}</span>}
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Subject</label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className={`form-input ${errors.subject ? 'error' : ''}`}
                      placeholder="Brief description of your inquiry"
                    />
                    {errors.subject && <span className="error-text">{errors.subject}</span>}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Message</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      className={`form-input form-textarea ${errors.message ? 'error' : ''}`}
                      placeholder="Please provide details about your inquiry..."
                      rows={6}
                    />
                    {errors.message && <span className="error-text">{errors.message}</span>}
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary btn-submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="loading-spinner"></div>
                        Sending Message...
                      </>
                    ) : (
                      'Send Message'
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section">
        <div className="container">
          <div className="section-header animate-on-scroll">
            <h2 className="section-title">Frequently Asked Questions</h2>
            <p className="section-description">
              Find answers to common questions about Fit Fusion.
            </p>
          </div>
          
          <div className="faq-container">
            {[
              {
                question: 'How do I get started with Fit Fusion?',
                answer: 'Simply sign up for a free account, complete your profile, and start tracking your workouts and nutrition. Our AI will begin personalizing your experience immediately.'
              },
              {
                question: 'Is my health data secure?',
                answer: 'Yes, we use enterprise-grade encryption and follow strict privacy protocols. Your data is never sold to third parties and you maintain full control over your information.'
              },
              {
                question: 'Can I sync with other fitness apps?',
                answer: 'Yes, Fit Fusion integrates with major platforms including Apple Health, Google Fit, and popular wearable devices for seamless data synchronization.'
              },
              {
                question: 'Do you offer personalized coaching?',
                answer: 'Our AI provides personalized recommendations based on your goals, progress, and preferences. Premium users also get access to certified human trainers for additional guidance.'
              },
              {
                question: 'What devices are supported?',
                answer: 'Fit Fusion works on iOS, Android, and web browsers. We also support integration with most popular fitness wearables and smart scales.'
              },
              {
                question: 'How much does Fit Fusion cost?',
                answer: 'We offer a free tier with basic features. Premium plans start at $9.99/month with advanced analytics, personalized coaching, and priority support.'
              }
            ].map((faq, index) => (
              <div key={index} className="faq-item animate-on-scroll">
                <h4 className="faq-question">{faq.question}</h4>
                <p className="faq-answer">{faq.answer}</p>
              </div>
            ))}
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
                Transform your fitness journey with intelligent tracking and personalized insights.
              </p>
            </div>
            <div className="footer-links">
              <Link to="/privacy">Privacy Policy</Link>
              <Link to="/terms">Terms of Service</Link>
              <Link to="/support">Support</Link>
              <Link to="/careers">Careers</Link>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; {new Date().getFullYear()} Fit Fusion. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <style>{`
        .contact-page {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          color: #1a1a1a;
          background: #ffffff;
          line-height: 1.6;
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

        .nav-link:hover {
          color: #708d50;
          background: rgba(112, 141, 80, 0.08);
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
        }

        .btn:hover {
          transform: translateY(-2px);
        }

        .btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none !important;
        }

        .btn-primary {
          background: linear-gradient(135deg, #708d50, #5a7340);
          color: white;
          box-shadow: 0 8px 20px rgba(112, 141, 80, 0.3);
        }

        .btn-primary:hover:not(:disabled) {
          box-shadow: 0 12px 30px rgba(112, 141, 80, 0.4);
        }

        .btn-outline {
          background: transparent;
          color: #708d50;
          border: 2px solid #708d50;
        }

        .btn-outline:hover {
          background: rgba(112, 141, 80, 0.08);
        }

        /* Hero Section */
        .hero-section {
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          padding: 8rem 0 4rem;
          text-align: center;
        }

        .hero-content {
          max-width: 800px;
          margin: 0 auto;
        }

        .page-title {
          font-size: clamp(2.5rem, 5vw, 4rem);
          font-weight: 900;
          color: #1a1a1a;
          margin-bottom: 1.5rem;
          letter-spacing: -0.02em;
        }

        .page-subtitle {
          font-size: 1.25rem;
          color: #4a4a4a;
          line-height: 1.6;
          max-width: 600px;
          margin: 0 auto;
        }

        /* Contact Options */
        .contact-options {
          padding: 4rem 0;
          background: white;
        }

        .options-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
        }

        .contact-option-card {
          background: white;
          border: 1px solid rgba(0, 0, 0, 0.08);
          border-radius: 20px;
          padding: 2rem;
          text-align: center;
          transition: all 0.4s ease;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        }

        .contact-option-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
        }

        .option-icon {
          font-size: 3rem;
          margin-bottom: 1.5rem;
        }

        .option-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 1rem;
        }

        .option-description {
          color: #6a6a6a;
          margin-bottom: 1.5rem;
          line-height: 1.6;
        }

        .option-contact {
          background: #f8fafc;
          padding: 1rem;
          border-radius: 12px;
          margin-bottom: 1rem;
        }

        .contact-email {
          color: #708d50;
          text-decoration: none;
          font-weight: 600;
          font-size: 1.1rem;
        }

        .contact-email:hover {
          text-decoration: underline;
        }

        .option-response {
          font-size: 0.9rem;
          color: #9ca3af;
        }

        /* Contact Form */
        .contact-form-section {
          padding: 4rem 0;
          background: #f8fafc;
        }

        .form-container {
          max-width: 800px;
          margin: 0 auto;
        }

        .form-card {
          background: white;
          border-radius: 24px;
          padding: 3rem;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
          border: 1px solid rgba(0, 0, 0, 0.05);
        }

        .form-header {
          text-align: center;
          margin-bottom: 2.5rem;
        }

        .form-title {
          font-size: 2rem;
          font-weight: 800;
          color: #1a1a1a;
          margin-bottom: 1rem;
        }

        .form-description {
          color: #6a6a6a;
          font-size: 1.125rem;
        }

        .contact-form {
          display: grid;
          gap: 1.5rem;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .form-group {
          display: grid;
          gap: 0.5rem;
        }

        .form-label {
          font-weight: 600;
          color: #374151;
          font-size: 0.95rem;
        }

        .form-input {
          padding: 0.875rem 1rem;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          font-size: 1rem;
          transition: all 0.3s ease;
          outline: none;
          background: white;
          font-family: inherit;
        }

        .form-input:focus {
          border-color: #708d50;
          box-shadow: 0 0 0 3px rgba(112, 141, 80, 0.1);
        }

        .form-input.error {
          border-color: #ef4444;
          box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
        }

        .form-textarea {
          resize: vertical;
          min-height: 120px;
        }

        .error-text {
          color: #ef4444;
          font-size: 0.875rem;
          font-weight: 500;
        }

        .btn-submit {
          width: 100%;
          justify-content: center;
          font-size: 1.1rem;
          padding: 1rem 2rem;
        }

        /* Loading Spinner */
        .loading-spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top: 2px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* Success Message */
        .success-message {
          text-align: center;
          padding: 3rem 2rem;
        }

        .success-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
        }

        .success-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #10b981;
          margin-bottom: 1rem;
        }

        .success-text {
          color: #6a6a6a;
          margin-bottom: 2rem;
          font-size: 1.125rem;
        }

        /* FAQ Section */
        .faq-section {
          padding: 4rem 0;
          background: white;
        }

        .section-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .section-title {
          font-size: 2.5rem;
          font-weight: 800;
          color: #1a1a1a;
          margin-bottom: 1rem;
        }

        .section-description {
          font-size: 1.125rem;
          color: #6a6a6a;
        }

        .faq-container {
          max-width: 800px;
          margin: 0 auto;
          display: grid;
          gap: 1.5rem;
        }

        .faq-item {
          background: white;
          border: 1px solid rgba(0, 0, 0, 0.08);
          border-radius: 16px;
          padding: 2rem;
          transition: all 0.3s ease;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
        }

        .faq-item:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
        }

        .faq-question {
          font-size: 1.125rem;
          font-weight: 600;
          color: #708d50;
          margin-bottom: 1rem;
        }

        .faq-answer {
          color: #4a4a4a;
          line-height: 1.6;
        }

        /* Footer */
        .footer {
          background: #1a1a1a;
          color: #a0a0a0;
          padding: 3rem 0 2rem;
        }

        .footer-content {
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
          animation: fadeInUp 0.8s ease-out forwards;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .nav-menu {
            display: none;
          }

          .hero-section {
            padding: 6rem 0 3rem;
          }

          .contact-options,
          .contact-form-section,
          .faq-section {
            padding: 3rem 0;
          }

          .form-card {
            padding: 2rem;
          }

          .form-row {
            grid-template-columns: 1fr;
          }

          .footer-content {
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

export default Contact;
