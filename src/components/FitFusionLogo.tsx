import React from 'react';

interface LogoProps {
  width?: number;
  height?: number;
  className?: string;
}

const FitFusionLogo: React.FC<LogoProps> = ({ width = 32, height = 32, className = '' }) => {
  return (
    <svg 
      width={width} 
      height={height} 
      viewBox="0 0 100 100" 
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Heart shape */}
      <path 
        d="M50 85 C 20 65, 10 50, 10 35 C 10 20, 20 10, 32 10 C 40 10, 45 15, 50 22 C 55 15, 60 10, 68 10 C 80 10, 90 20, 90 35 C 90 50, 80 65, 50 85 Z" 
        fill="#708d50"
      />
      
      {/* Left glasses lens */}
      <circle cx="35" cy="40" r="10" fill="none" stroke="#262621" strokeWidth="3"/>
      <ellipse cx="35" cy="40" rx="4" ry="6" fill="#262621"/>
      
      {/* Right glasses lens */}
      <circle cx="65" cy="40" r="10" fill="none" stroke="#262621" strokeWidth="3"/>
      <ellipse cx="65" cy="40" rx="4" ry="6" fill="#262621"/>
      
      {/* Glasses bridge */}
      <path 
        d="M 45 40 Q 50 38, 55 40" 
        fill="none" 
        stroke="#262621" 
        strokeWidth="3"
        strokeLinecap="round"
      />
      
      {/* Glasses arm (left) */}
      <path 
        d="M 25 40 Q 20 38, 18 35" 
        fill="none" 
        stroke="#262621" 
        strokeWidth="3"
        strokeLinecap="round"
      />
      
      {/* Glasses arm (right) */}
      <path 
        d="M 75 40 Q 80 38, 82 35" 
        fill="none" 
        stroke="#262621" 
        strokeWidth="3"
        strokeLinecap="round"
      />
      
      {/* Nose */}
      <line x1="50" y1="48" x2="48" y2="55" stroke="#262621" strokeWidth="2.5" strokeLinecap="round"/>
      
      {/* Smile */}
      <path 
        d="M 40 60 Q 50 68, 60 60" 
        fill="none" 
        stroke="#262621" 
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
};

export default FitFusionLogo;
