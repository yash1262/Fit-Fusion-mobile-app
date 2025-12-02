import React, { useState } from 'react';
import FitFusionLogo from "./FitFusionLogo";
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';

const SignIn: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      // Firebase authentication
      await signInWithEmailAndPassword(auth, formData.email, formData.password);
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Sign in error:', error);
      let errorMessage = 'Invalid email or password. Please try again.';
      
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email. Please sign up first.';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect password. Please try again.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address format.';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many failed attempts. Please try again later.';
      }
      
      setErrors({ submit: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    console.log(`Logging in with ${provider}`);
    // Implement social login logic
  };

  const handleForgotPassword = async (email: string) => {
    try {
      // Simulate password reset
      await new Promise(resolve => setTimeout(resolve, 1000));
      setShowForgotPassword(false);
      setErrors({ success: 'Password reset link sent to your email!' });
    } catch (error) {
      setErrors({ forgot: 'Failed to send reset link. Please try again.' });
    }
  };

  return (
    <div className="signin-page">
      {/* Navigation */}
      <nav className="navbar">
        <div className="container">
          <div className="nav-wrapper">
            <Link to="/landing" className="brand-logo">
              <FitFusionLogo width={40} height={40} />
              <span className="brand-text">Fit Fusion</span>
            </Link>
            <div className="nav-actions">
              <span className="nav-text">Don't have an account?</span>
              <Link to="/signup" className="btn btn-primary">Sign Up</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="signin-container">
        <div className="signin-content">
          {/* Left Side - Form */}
          <div className="signin-form-section">
            <div className="form-container">
              <div className="form-header">
                <h1 className="form-title">Welcome Back</h1>
                <p className="form-description">
                  Sign in to your account to continue your fitness journey
                </p>
              </div>

              {!showForgotPassword ? (
                <form onSubmit={handleSubmit} className="signin-form">
                  {errors.submit && (
                    <div className="error-banner">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                      </svg>
                      {errors.submit}
                    </div>
                  )}

                  {errors.success && (
                    <div className="success-banner">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                      </svg>
                      {errors.success}
                    </div>
                  )}

                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`form-input ${errors.email ? 'error' : ''}`}
                      placeholder="Enter your email address"
                      autoComplete="email"
                    />
                    {errors.email && <span className="error-text">{errors.email}</span>}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Password</label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className={`form-input ${errors.password ? 'error' : ''}`}
                      placeholder="Enter your password"
                      autoComplete="current-password"
                    />
                    {errors.password && <span className="error-text">{errors.password}</span>}
                  </div>

                  <div className="form-options">
                    <label className="checkbox-item">
                      <input
                        type="checkbox"
                        name="rememberMe"
                        checked={formData.rememberMe}
                        onChange={handleInputChange}
                        className="checkbox-input"
                      />
                      <span className="checkbox-label">Remember me</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowForgotPassword(true)}
                      className="forgot-password-link"
                    >
                      Forgot password?
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="btn btn-primary btn-full"
                  >
                    {isLoading ? (
                      <>
                        <div className="loading-spinner"></div>
                        Signing In...
                      </>
                    ) : (
                      'Sign In'
                    )}
                  </button>

                  <div className="divider">
                    <span className="divider-text">Or continue with</span>
                  </div>

                  <div className="social-login">
                    <button
                      type="button"
                      onClick={() => handleSocialLogin('google')}
                      className="social-btn google-btn"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      Continue with Google
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSocialLogin('apple')}
                      className="social-btn apple-btn"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                      </svg>
                      Continue with Apple
                    </button>
                  </div>
                </form>
              ) : (
                <div className="forgot-password-form">
                  <div className="forgot-header">
                    <h2 className="forgot-title">Reset Password</h2>
                    <p className="forgot-description">
                      Enter your email address and we'll send you a link to reset your password.
                    </p>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input
                      type="email"
                      className="form-input"
                      placeholder="Enter your email address"
                      defaultValue={formData.email}
                    />
                    {errors.forgot && <span className="error-text">{errors.forgot}</span>}
                  </div>

                  <div className="forgot-actions">
                    <button
                      type="button"
                      onClick={() => handleForgotPassword(formData.email)}
                      className="btn btn-primary btn-full"
                    >
                      Send Reset Link
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowForgotPassword(false)}
                      className="btn btn-ghost btn-full"
                    >
                      Back to Sign In
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Side - Hero */}
          <div className="signin-hero-section">
            <div className="hero-content">
              <div className="hero-stats">
                <div className="stat-card">
                  <div className="stat-number">10M+</div>
                  <div className="stat-label">Workouts Completed</div>
                </div>
                <div className="stat-card">
                  <div className="stat-number">500K+</div>
                  <div className="stat-label">Active Users</div>
                </div>
                <div className="stat-card">
                  <div className="stat-number">95%</div>
                  <div className="stat-label">Success Rate</div>
                </div>
              </div>
              
              <div className="hero-text">
                <h2 className="hero-title">
                  Continue Your Fitness Journey
                </h2>
                <p className="hero-description">
                  Track your progress, achieve your goals, and stay motivated with our intelligent fitness platform.
                </p>
              </div>

              <div className="hero-features">
                <div className="feature-item">
                  <div className="feature-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                    </svg>
                  </div>
                  <span className="feature-text">Personalized workout plans</span>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                    </svg>
                  </div>
                  <span className="feature-text">Advanced progress tracking</span>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                    </svg>
                  </div>
                  <span className="feature-text">Nutrition guidance & meal planning</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .signin-page {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          background: #ffffff;
          min-height: 100vh;
        }

        /* Navigation */
        .navbar {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(0, 0, 0, 0.08);
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

        .nav-actions {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .nav-text {
          color: #6a6a6a;
          font-size: 0.95rem;
        }

        /* Main Container */
        .signin-container {
          min-height: calc(100vh - 80px);
        }

        .signin-content {
          display: grid;
          grid-template-columns: 1fr 1fr;
          min-height: calc(100vh - 80px);
        }

        /* Form Section */
        .signin-form-section {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 3rem;
          background: white;
        }

        .form-container {
          max-width: 400px;
          width: 100%;
        }

        .form-header {
          text-align: center;
          margin-bottom: 2.5rem;
        }

        .form-title {
          font-size: 2.25rem;
          font-weight: 800;
          color: #1a1a1a;
          margin-bottom: 0.75rem;
        }

        .form-description {
          font-size: 1.125rem;
          color: #6a6a6a;
          line-height: 1.5;
        }

        /* Form Elements */
        .signin-form {
          display: grid;
          gap: 1.5rem;
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
        }

        .form-input:focus {
          border-color: #708d50;
          box-shadow: 0 0 0 3px rgba(112, 141, 80, 0.1);
        }

        .form-input.error {
          border-color: #ef4444;
          box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
        }

        .error-text {
          color: #ef4444;
          font-size: 0.875rem;
          font-weight: 500;
        }

        .form-options {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .checkbox-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
        }

        .checkbox-input {
          width: 18px;
          height: 18px;
          accent-color: #708d50;
          cursor: pointer;
        }

        .checkbox-label {
          font-size: 0.95rem;
          color: #374151;
          font-weight: 500;
        }

        .forgot-password-link {
          background: none;
          border: none;
          color: #708d50;
          font-size: 0.95rem;
          font-weight: 600;
          cursor: pointer;
          text-decoration: none;
        }

        .forgot-password-link:hover {
          text-decoration: underline;
        }

        /* Buttons */
        .btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.875rem 1.75rem;
          border-radius: 12px;
          font-weight: 600;
          font-size: 0.95rem;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          text-decoration: none;
        }

        .btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none !important;
        }

        .btn:hover:not(:disabled) {
          transform: translateY(-2px);
        }

        .btn-primary {
          background: linear-gradient(135deg, #708d50, #5a7340);
          color: white;
          box-shadow: 0 8px 20px rgba(112, 141, 80, 0.3);
        }

        .btn-primary:hover:not(:disabled) {
          box-shadow: 0 12px 30px rgba(112, 141, 80, 0.4);
        }

        .btn-ghost {
          background: transparent;
          color: #4a4a4a;
          border: 1px solid rgba(0, 0, 0, 0.12);
        }

        .btn-ghost:hover {
          background: rgba(0, 0, 0, 0.05);
        }

        .btn-full {
          width: 100%;
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

        /* Divider */
        .divider {
          position: relative;
          text-align: center;
          margin: 1rem 0;
        }

        .divider::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 0;
          right: 0;
          height: 1px;
          background: #e2e8f0;
        }

        .divider-text {
          background: white;
          padding: 0 1rem;
          color: #6a6a6a;
          font-size: 0.875rem;
        }

        /* Social Login */
        .social-login {
          display: grid;
          gap: 0.75rem;
        }

        .social-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          padding: 0.875rem 1rem;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          background: white;
          color: #374151;
          font-weight: 600;
          font-size: 0.95rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .social-btn:hover {
          border-color: #cbd5e1;
          background: #f8fafc;
          transform: translateY(-1px);
        }

        .google-btn:hover {
          border-color: #4285f4;
          color: #4285f4;
        }

        .apple-btn:hover {
          border-color: #000;
          color: #000;
        }

        /* Error/Success Banners */
        .error-banner,
        .success-banner {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 1rem;
          border-radius: 12px;
          font-weight: 500;
          font-size: 0.95rem;
        }

        .error-banner {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.3);
          color: #dc2626;
        }

        .success-banner {
          background: rgba(16, 185, 129, 0.1);
          border: 1px solid rgba(16, 185, 129, 0.3);
          color: #059669;
        }

        /* Forgot Password Form */
        .forgot-password-form {
          display: grid;
          gap: 2rem;
        }

        .forgot-header {
          text-align: center;
        }

        .forgot-title {
          font-size: 1.75rem;
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 0.5rem;
        }

        .forgot-description {
          color: #6a6a6a;
          line-height: 1.5;
        }

        .forgot-actions {
          display: grid;
          gap: 1rem;
        }

        /* Hero Section */
        .signin-hero-section {
          background: linear-gradient(135deg, #708d50, #5a7340);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 3rem;
        }

        .hero-content {
          max-width: 500px;
          text-align: center;
        }

        .hero-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
          margin-bottom: 3rem;
        }

        .stat-card {
          text-align: center;
          padding: 1.5rem 1rem;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          backdrop-filter: blur(10px);
        }

        .stat-number {
          font-size: 1.75rem;
          font-weight: 800;
          margin-bottom: 0.25rem;
        }

        .stat-label {
          font-size: 0.875rem;
          opacity: 0.9;
        }

        .hero-text {
          margin-bottom: 2.5rem;
        }

        .hero-title {
          font-size: 2.25rem;
          font-weight: 800;
          margin-bottom: 1rem;
          line-height: 1.2;
        }

        .hero-description {
          font-size: 1.125rem;
          opacity: 0.9;
          line-height: 1.6;
        }

        .hero-features {
          display: grid;
          gap: 1rem;
          text-align: left;
        }

        .feature-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .feature-icon {
          width: 32px;
          height: 32px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .feature-text {
          font-size: 1rem;
          font-weight: 500;
        }

        /* Responsive Design */
        @media (max-width: 1024px) {
          .signin-content {
            grid-template-columns: 1fr;
          }

          .signin-hero-section {
            order: -1;
            padding: 2rem;
          }

          .hero-stats {
            grid-template-columns: 1fr;
            gap: 1rem;
          }

          .stat-card {
            padding: 1rem;
          }
        }

        @media (max-width: 768px) {
          .signin-form-section {
            padding: 2rem 1.5rem;
          }

          .form-title {
            font-size: 1.875rem;
          }

          .hero-title {
            font-size: 1.875rem;
          }

          .nav-actions .nav-text {
            display: none;
          }
        }
      `}</style>
    </div>
  );
};

export default SignIn;
