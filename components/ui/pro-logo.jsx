import React from "react";

export const ProLogo = ({ className = "w-4 h-4" }) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="pro-gradient" x1="0" y1="0" x2="24" y2="24">
          <stop offset="0%" stopColor="#a855f7" /> {/* Purple-500 */}
          <stop offset="100%" stopColor="#ec4899" /> {/* Pink-500 */}
        </linearGradient>
      </defs>
      
      {/* A stylized gem/crown made of rounded squares to match Plnnr's pixel aesthetic */}
      
      {/* Top Center */}
      <rect x="8" y="2" width="8" height="8" rx="2" fill="url(#pro-gradient)" opacity="0.9" />
      
      {/* Bottom Left */}
      <rect x="2" y="10" width="8" height="8" rx="2" fill="url(#pro-gradient)" opacity="0.8" />
      
      {/* Bottom Right */}
      <rect x="14" y="10" width="8" height="8" rx="2" fill="url(#pro-gradient)" opacity="1" />
      
      {/* Center overlapping accent to bind them */}
      <rect x="8" y="8" width="8" height="8" rx="2" fill="url(#pro-gradient)" opacity="0.6" style={{ mixBlendMode: 'overlay' }} />
    </svg>
  );
};

export default ProLogo;
