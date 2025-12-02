import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SplashScreen: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      navigate('/landing');
    }, 6000);

    return () => clearTimeout(timer);
  }, [navigate]);

  if (!isVisible) return null;

  return (
    <div className="splash-screen">
      <div className="splash-content">
        <div className="logo-container">
          <svg className="logo-icon" width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path 
              d="M50 85 C 20 65, 10 50, 10 35 C 10 20, 20 10, 32 10 C 40 10, 45 15, 50 22 C 55 15, 60 10, 68 10 C 80 10, 90 20, 90 35 C 90 50, 80 65, 50 85 Z" 
              fill="white"
            />
            <circle cx="35" cy="40" r="10" fill="none" stroke="#708d50" strokeWidth="3"/>
            <ellipse cx="35" cy="40" rx="4" ry="6" fill="#708d50"/>
            <circle cx="65" cy="40" r="10" fill="none" stroke="#708d50" strokeWidth="3"/>
            <ellipse cx="65" cy="40" rx="4" ry="6" fill="#708d50"/>
            <path d="M 45 40 Q 50 38, 55 40" fill="none" stroke="#708d50" strokeWidth="3" strokeLinecap="round"/>
            <path d="M 25 40 Q 20 38, 18 35" fill="none" stroke="#708d50" strokeWidth="3" strokeLinecap="round"/>
            <path d="M 75 40 Q 80 38, 82 35" fill="none" stroke="#708d50" strokeWidth="3" strokeLinecap="round"/>
            <line x1="50" y1="48" x2="48" y2="55" stroke="#708d50" strokeWidth="2.5" strokeLinecap="round"/>
            <path d="M 40 60 Q 50 68, 60 60" fill="none" stroke="#708d50" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
        </div>
        <h1 className="app-name">Fit Fusion</h1>
        <p className="tagline">Transform Your Fitness Journey</p>
        <div className="loading-dots">
          <div className="dot dot1"></div>
          <div className="dot dot2"></div>
          <div className="dot dot3"></div>
        </div>
      </div>

      <style>{`
        .splash-screen {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, #708d50 0%, #5a7340 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          z-index: 9999;
          animation: fadeIn 0.5s ease-in-out;
        }

        .splash-content {
          text-align: center;
          animation: slideUp 1s ease-out;
        }

        .logo-container {
          margin-bottom: 2rem;
        }

        .logo-icon {
          width: 140px;
          height: 140px;
          display: block;
          margin: 0 auto;
          animation: heartbeat 1.2s ease-in-out infinite;
          filter: drop-shadow(0 10px 30px rgba(0, 0, 0, 0.3));
        }

        .app-name {
          font-size: 3rem;
          font-weight: 900;
          margin-bottom: 1rem;
          letter-spacing: -0.02em;
          text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        }

        .tagline {
          font-size: 1.25rem;
          opacity: 0.9;
          margin-bottom: 3rem;
          font-weight: 400;
        }

        .loading-dots {
          display: flex;
          justify-content: center;
          gap: 0.5rem;
        }

        .dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.8);
          animation: bounce 1.4s ease-in-out infinite both;
        }

        .dot1 { animation-delay: -0.32s; }
        .dot2 { animation-delay: -0.16s; }
        .dot3 { animation-delay: 0s; }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideUp {
          from { 
            opacity: 0; 
            transform: translateY(50px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }

        @keyframes heartbeat {
          0% { 
            transform: scale(1); 
          }
          14% { 
            transform: scale(1.15); 
          }
          28% { 
            transform: scale(1); 
          }
          42% { 
            transform: scale(1.15); 
          }
          70% { 
            transform: scale(1); 
          }
        }

        @keyframes bounce {
          0%, 80%, 100% {
            transform: scale(0);
          }
          40% {
            transform: scale(1);
          }
        }

        @media (max-width: 768px) {
          .app-name {
            font-size: 2.5rem;
          }
          
          .tagline {
            font-size: 1.125rem;
          }
          
          .logo-icon {
            width: 120px;
            height: 120px;
          }
        }
      `}</style>
    </div>
  );
};

export default SplashScreen;
