import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
  return (
    <div className="page-container" style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated Background Elements */}
      <div style={{
        position: 'absolute',
        width: '400px',
        height: '400px',
        borderRadius: '50%',
        background: 'rgba(255,255,255,0.1)',
        top: '-200px',
        left: '-200px',
        animation: 'float 6s ease-in-out infinite'
      }}></div>
      
      <div style={{
        position: 'absolute',
        width: '300px',
        height: '300px',
        borderRadius: '50%',
        background: 'rgba(255,255,255,0.05)',
        bottom: '-150px',
        right: '-150px',
        animation: 'float 8s ease-in-out infinite reverse'
      }}></div>

      <div style={{
        textAlign: 'center',
        maxWidth: '600px',
        padding: '2rem',
        position: 'relative',
        zIndex: 10
      }}>
        <div style={{
          fontSize: '120px',
          fontWeight: '800',
          marginBottom: '1.5rem',
          animation: 'bounce 2s ease-in-out infinite',
          textShadow: '0 4px 20px rgba(0,0,0,0.3)'
        }}>
          404
        </div>
        
        <h1 style={{
          fontSize: '3rem',
          fontWeight: '700',
          marginBottom: '1rem',
          textShadow: '0 4px 20px rgba(0,0,0,0.3)',
          letterSpacing: '-0.02em'
        }}>
          Page Not Found
        </h1>
        
        <p style={{
          fontSize: '1.25rem',
          opacity: 0.9,
          marginBottom: '2.5rem',
          lineHeight: '1.6',
          maxWidth: '500px',
          margin: '0 auto 2.5rem'
        }}>
          Looks like you've wandered off your fitness path! 
          The page you're looking for doesn't exist.
        </p>
        
        <div style={{
          display: 'flex',
          gap: '1.25rem',
          justifyContent: 'center',
          flexWrap: 'wrap',
          marginBottom: '3rem'
        }}>
          <Link 
            to="/dashboard" 
            className="btn btn-primary" 
            style={{
              fontSize: '1.125rem',
              padding: '1rem 2rem',
              background: 'white',
              color: '#667eea',
              fontWeight: '600',
              borderRadius: '12px',
              textDecoration: 'none',
              transition: 'all 0.3s ease',
              boxShadow: '0 8px 25px rgba(255,255,255,0.3)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 12px 35px rgba(255,255,255,0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(255,255,255,0.3)';
            }}
          >
            🏠 Go to Dashboard
          </Link>
          
          <Link 
            to="/landing" 
            className="btn btn-secondary" 
            style={{
              fontSize: '1.125rem',
              padding: '1rem 2rem',
              background: 'transparent',
              color: 'white',
              border: '2px solid white',
              fontWeight: '600',
              borderRadius: '12px',
              textDecoration: 'none',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            🚀 Back to Home
          </Link>
        </div>
        
        <div style={{
          opacity: 0.8,
          fontSize: '0.875rem'
        }}>
          <p>
            Need help?{' '}
            <Link 
              to="/contact" 
              style={{ 
                color: 'white', 
                textDecoration: 'underline',
                transition: 'opacity 0.3s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
            >
              Contact our support team
            </Link>
          </p>
        </div>
      </div>
      
      <style>{`
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-20px);
          }
          60% {
            transform: translateY(-10px);
          }
        }
        
        @keyframes float {
          0%, 100% { 
            transform: translateY(0px) rotate(0deg); 
            opacity: 0.7;
          }
          50% { 
            transform: translateY(-20px) rotate(10deg); 
            opacity: 0.4;
          }
        }
      `}</style>
    </div>
  );
};

export default NotFound;
