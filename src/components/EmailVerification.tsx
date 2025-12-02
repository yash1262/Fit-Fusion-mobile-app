import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebaseConfig';
import { 
  sendEmailVerification, 
  onAuthStateChanged,
  signOut 
} from 'firebase/auth';
import './EmailVerification.css';

const EmailVerification: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate('/signin');
        return;
      }

      setUserEmail(user.email || '');

      // Check if email is already verified
      if (user.emailVerified) {
        navigate('/dashboard');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  // Countdown timer for resend button
  useEffect(() => {
    if (countdown > 0 && !canResend) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      setCanResend(true);
    }
  }, [countdown, canResend]);

  // Auto-check verification status
  useEffect(() => {
    const checkInterval = setInterval(async () => {
      const user = auth.currentUser;
      if (user) {
        await user.reload();
        if (user.emailVerified) {
          setSuccess('✅ Email verified! Redirecting to dashboard...');
          setTimeout(() => navigate('/dashboard'), 2000);
        }
      }
    }, 3000); // Check every 3 seconds

    return () => clearInterval(checkInterval);
  }, [navigate]);

  const handleResendEmail = async () => {
    if (!canResend) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const user = auth.currentUser;
      if (user) {
        await sendEmailVerification(user);
        setSuccess('✅ Verification email sent! Please check your inbox.');
        setCountdown(60);
        setCanResend(false);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to send verification email');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckVerification = async () => {
    setLoading(true);
    setError('');

    try {
      const user = auth.currentUser;
      if (user) {
        await user.reload();
        if (user.emailVerified) {
          setSuccess('✅ Email verified! Redirecting...');
          setTimeout(() => navigate('/dashboard'), 1500);
        } else {
          setError('Email not verified yet. Please check your inbox and click the verification link.');
        }
      }
    } catch (err: any) {
      setError('Error checking verification status');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/signin');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <div className="verification-container">
      <div className="verification-card">
        <div className="verification-icon">
          <svg width="80" height="80" viewBox="0 0 100 100" fill="none">
            <circle cx="50" cy="50" r="45" fill="#708d50" opacity="0.1"/>
            <path d="M50 20 L50 50 L70 70" stroke="#708d50" strokeWidth="4" strokeLinecap="round" fill="none"/>
            <circle cx="50" cy="50" r="40" stroke="#708d50" strokeWidth="3" fill="none"/>
            <path d="M30 50 L45 65 L70 35" stroke="#708d50" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
          </svg>
        </div>

        <h1 className="verification-title">Verify Your Email</h1>
        <p className="verification-subtitle">
          We've sent a verification link to
        </p>
        <p className="verification-email">{userEmail}</p>

        <div className="verification-steps">
          <div className="step">
            <div className="step-number">1</div>
            <div className="step-text">Check your email inbox</div>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <div className="step-text">Click the verification link</div>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <div className="step-text">Return here and click "I've Verified"</div>
          </div>
        </div>

        {error && (
          <div className="alert alert-error">
            <span className="alert-icon">⚠️</span>
            {error}
          </div>
        )}

        {success && (
          <div className="alert alert-success">
            <span className="alert-icon">✅</span>
            {success}
          </div>
        )}

        <div className="verification-actions">
          <button 
            className="btn-primary" 
            onClick={handleCheckVerification}
            disabled={loading}
          >
            {loading ? 'Checking...' : "I've Verified My Email"}
          </button>

          <button 
            className="btn-secondary" 
            onClick={handleResendEmail}
            disabled={!canResend || loading}
          >
            {canResend ? 'Resend Verification Email' : `Resend in ${countdown}s`}
          </button>

          <button className="btn-text" onClick={handleLogout}>
            Sign Out
          </button>
        </div>

        <div className="verification-help">
          <p className="help-title">Didn't receive the email?</p>
          <ul className="help-list">
            <li>Check your spam or junk folder</li>
            <li>Make sure {userEmail} is correct</li>
            <li>Wait a few minutes and try resending</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;
