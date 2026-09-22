import React from 'react';

/**
 * Johar Setu circular tree/plant emblem icon matching official Jharkhand branding.
 */
export const JoharSetuIcon = ({ className = 'w-6 h-6', isWhite = false }) => {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle
        cx="24"
        cy="24"
        r="22"
        className={isWhite ? 'fill-white stroke-transparent' : 'fill-emerald-50 stroke-emerald-600/30'}
        strokeWidth="1.5"
      />
      {/* Central Trunk */}
      <path
        d="M24 36V20"
        stroke={isWhite ? '#014d34' : '#015a3a'}
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      {/* Top Foliage / Leaves */}
      <circle
        cx="24"
        cy="15"
        r="4.5"
        fill={isWhite ? '#014d34' : '#015a3a'}
      />
      {/* Left Leaf Cluster */}
      <circle
        cx="16.5"
        cy="22.5"
        r="3.8"
        fill={isWhite ? '#014d34' : '#015a3a'}
      />
      {/* Right Leaf Cluster */}
      <circle
        cx="31.5"
        cy="22.5"
        r="3.8"
        fill={isWhite ? '#014d34' : '#015a3a'}
      />
      {/* Left Branch */}
      <path
        d="M24 26C21.5 26 19 24.5 17.5 23"
        stroke={isWhite ? '#014d34' : '#015a3a'}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {/* Right Branch */}
      <path
        d="M24 26C26.5 26 29 24.5 30.5 23"
        stroke={isWhite ? '#014d34' : '#015a3a'}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {/* Base Roots */}
      <path
        d="M18 36H30"
        stroke={isWhite ? '#014d34' : '#015a3a'}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
};

export default JoharSetuIcon;
