
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';

type WilliamHarveyAvatarProps = {
  mouthOpenScale: number;
  eyesOpen: boolean;
  isTalking: boolean;
};

export default function WilliamHarveyAvatar({
  mouthOpenScale,
  eyesOpen,
}: WilliamHarveyAvatarProps) {
  const mouthOpen = mouthOpenScale > 0.1;

  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 300 300"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient
          id="skinGradientHarvey"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" style={{ stopColor: '#f3e1d1' }} />
          <stop offset="100%" style={{ stopColor: '#e1bfa8' }} />
        </linearGradient>
        <linearGradient
          id="hairGradientHarvey"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" style={{ stopColor: '#6d4c41' }} />
          <stop offset="100%" style={{ stopColor: '#4e342e' }} />
        </linearGradient>
        <radialGradient id="eyeGradientHarvey">
          <stop offset="10%" stopColor="#4a3f35" />
          <stop offset="95%" stopColor="#3a312a" />
        </radialGradient>
      </defs>

      <g transform="translate(0, 10)">
        {/* Robe */}
        <path
          d="M 90 250 C 70 280, 230 280, 210 250 L 150 280 Z"
          fill="#212121"
        />

        {/* Head */}
        <ellipse cx="150" cy="150" rx="70" ry="80" fill="url(#skinGradientHarvey)" />

        {/* Moustache */}
        <path d="M 120 190 C 140 200, 160 200, 180 190 Q 150 195, 120 190 Z" fill="url(#hairGradientHarvey)"/>

        {/* Goatee */}
        <path d="M 140 200 C 140 220, 160 220, 160 200 Q 150 225, 140 200 Z" fill="url(#hairGradientHarvey)"/>

        {/* Mouth */}
        <g style={{ opacity: mouthOpen ? 1 : 0 }}>
          <ellipse
            cx="150"
            cy="200"
            rx="8"
            ry={6 * mouthOpenScale}
            fill="#5e3a30"
          />
        </g>

        {/* Hair */}
        <path
          d="M 90,80 C 70,120 120,130 150,130 C 180,130 230,120 210,80 Q 150,60 90,80 Z"
          fill="url(#hairGradientHarvey)"
        />

        {/* Ruff Collar */}
        <g fill="#fafafa">
            <ellipse cx="150" cy="245" rx="90" ry="20"/>
            <ellipse cx="150" cy="240" rx="85" ry="20"/>
        </g>

        {/* Eyes */}
        <g style={{ opacity: eyesOpen ? 1 : 0 }}>
          <ellipse cx="120" cy="155" rx="10" ry="8" fill="white" />
          <circle cx="120" cy="155" r="5" fill="url(#eyeGradientHarvey)" />
          <ellipse cx="180" cy="155" rx="10" ry="8" fill="white" />
          <circle cx="180" cy="155" r="5" fill="url(#eyeGradientHarvey)" />
        </g>
        <g style={{ opacity: eyesOpen ? 0 : 1 }}>
          <path d="M 110 155 C 120 160, 130 160, 130 155" stroke="black" strokeWidth="2" fill="none" />
          <path d="M 170 155 C 180 160, 190 160, 190 155" stroke="black" strokeWidth="2" fill="none" />
        </g>

        {/* Eyebrows */}
        <path d="M 105 140 Q 120 135, 135 140" stroke="#4e342e" strokeWidth="4" fill="none" />
        <path d="M 165 140 Q 180 135, 195 140" stroke="#4e342e" strokeWidth="4" fill="none" />
        
        {/* Nose */}
        <path d="M 150 160 L 145 185 L 155 185 Z" fill="#e1bfa8" />
      </g>
    </svg>
  );
}
