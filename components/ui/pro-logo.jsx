import React from "react";

export const ProLogo = ({ className = "w-4 h-4" }) => {
  return (
    <svg 
      viewBox="0 0 120 56" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        {/* Purple gradient */}
        <linearGradient id="purpleBrand" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{stopColor:"#9333EA", stopOpacity:1}} />
          <stop offset="100%" style={{stopColor:"#7C3AED", stopOpacity:1}} />
        </linearGradient>
        
        <linearGradient id="purpleGlow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{stopColor:"#9333EA", stopOpacity:0.6}} />
          <stop offset="100%" style={{stopColor:"#7C3AED", stopOpacity:0.8}} />
        </linearGradient>
        
        {/* Filters */}
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        
        <filter id="shadow">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.3"/>
        </filter>
      </defs>
      
      {/* Outer glow */}
      <rect x="-2" y="-2" width="124" height="60" rx="30" fill="url(#purpleGlow)" opacity="0.3" filter="url(#glow)"/>
      
      {/* Main badge */}
      <rect x="0" y="0" width="120" height="56" rx="28" fill="url(#purpleBrand)" filter="url(#shadow)"/>
      
      {/* Inner highlight */}
      <rect x="3" y="3" width="114" height="26" rx="13" fill="#ffffff" opacity="0.15"/>
      
      {/* Star icon */}
      <path d="M 25 28 l 4 -9 l 9 -1.5 l -6.5 -6.5 l 1.5 -9 l -8 4.5 l -8 -4.5 l 1.5 9 l -6.5 6.5 l 9 1.5 z" 
            fill="#E0DBFF" opacity="0.9"/>
      
      {/* PRO text */}
      <text x="75" y="37" fontFamily="'Inter', 'Segoe UI', Arial, sans-serif" 
            fontSize="26" fontWeight="800" fill="#ffffff" textAnchor="middle" letterSpacing="2">
        PRO
      </text>
    </svg>
  );
};

export default ProLogo;
