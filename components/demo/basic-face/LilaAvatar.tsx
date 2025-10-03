/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';

type LilaAvatarProps = {
  mouthOpen: boolean;
  eyesOpen: boolean;
};

export default function LilaAvatar({ mouthOpen, eyesOpen }: LilaAvatarProps) {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 300 300"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="skinGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#f9d4c5' }} />
          <stop offset="100%" style={{ stopColor: '#e0b8a8' }} />
        </linearGradient>
        <linearGradient id="hairGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#e53935' }} />
          <stop offset="100%" style={{ stopColor: '#b71c1c' }} />
        </linearGradient>
        <radialGradient id="eyeGradient">
          <stop offset="10%" stopColor="#4caf50" />
          <stop offset="95%" stopColor="#2e7d32" />
        </radialGradient>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
          <feOffset dx="2" dy="2" result="offsetblur" />
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.5" />
          </feComponentTransfer>
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <g transform="translate(0, 10)">
        {/* Hair Back */}
        <path
          d="M 50,100 C 20,150 20,250 80,280 Q 150,320 220,280 C 280,250 280,150 250,100 Q 150,-20 50,100 Z"
          fill="url(#hairGradient)"
        />

        {/* Head */}
        <circle
          cx="150"
          cy="155"
          r="85"
          fill="url(#skinGradient)"
          filter="url(#shadow)"
        />

        {/* Neck */}
        <path d="M 130 230 C 130 250, 170 250, 170 230 L 160 250 Q 150 260, 140 250 Z" fill="#e0b8a8" />

        {/* Eyes */}
        <g id="eyes-open" style={{ transition: 'opacity 0.1s', opacity: eyesOpen ? 1 : 0 }}>
          <ellipse cx="120" cy="150" rx="15" ry="20" fill="white" />
          <circle cx="120" cy="150" r="10" fill="url(#eyeGradient)" />
          <circle cx="118" cy="148" r="3" fill="white" opacity="0.8" />
          <path d="M 100 135 Q 120 125, 140 135" stroke="black" strokeWidth="2" fill="none" />

          <ellipse cx="180" cy="150" rx="15" ry="20" fill="white" />
          <circle cx="180" cy="150" r="10" fill="url(#eyeGradient)" />
          <circle cx="178" cy="148" r="3" fill="white" opacity="0.8" />
          <path d="M 160 135 Q 180 125, 200 135" stroke="black" strokeWidth="2" fill="none" />
        </g>
        <g id="eyes-closed" style={{ transition: 'opacity 0.1s', opacity: eyesOpen ? 0 : 1 }}>
            <path d="M 105 150 C 115 155, 125 155, 135 150" stroke="black" strokeWidth="2" fill="none" />
            <path d="M 165 150 C 175 155, 185 155, 195 150" stroke="black" strokeWidth="2" fill="none" />
        </g>

        {/* Eyebrows */}
        <path d="M 105 125 Q 120 120, 135 125" stroke="#a13333" strokeWidth="4" fill="none" />
        <path d="M 165 125 Q 180 120, 195 125" stroke="#a13333" strokeWidth="4" fill="none" />

        {/* Mouth */}
        <g id="mouth-closed" style={{ transition: 'opacity 0.1s', opacity: mouthOpen ? 0 : 1 }}>
          <path d="M 135 200 Q 150 205, 165 200" stroke="#8c2f39" strokeWidth="3" fill="none" />
        </g>
        <g id="mouth-open" style={{ transition: 'opacity 0.1s', opacity: mouthOpen ? 1 : 0 }}>
            <ellipse cx="150" cy="205" rx="15" ry="8" fill="#5e1919" />
        </g>

        {/* Hair Front */}
        <path
          d="M 70,80 C 40,120 100,100 120,70 Q 150,40 180,70 C 200,100 260,120 230,80 Q 150,-10 70,80 Z"
          fill="url(#hairGradient)"
        />
      </g>
    </svg>
  );
}
