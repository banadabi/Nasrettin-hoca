/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';

type AndreasVesaliusAvatarProps = {
  mouthOpenScale: number;
  eyesOpen: boolean;
  isTalking: boolean;
};

export default function AndreasVesaliusAvatar({
  mouthOpenScale,
  eyesOpen,
}: AndreasVesaliusAvatarProps) {
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
          id="skinGradientVesalius"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" style={{ stopColor: '#efdcd0' }} />
          <stop offset="100%" style={{ stopColor: '#d8b9a4' }} />
        </linearGradient>
        <linearGradient
          id="hairGradientVesalius"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" style={{ stopColor: '#a1887f' }} />
          <stop offset="100%" style={{ stopColor: '#6d4c41' }} />
        </linearGradient>
        <radialGradient id="eyeGradientVesalius">
          <stop offset="10%" stopColor="#4e342e" />
          <stop offset="95%" stopColor="#3e2723" />
        </radialGradient>
      </defs>

      <g transform="translate(0, 10)">
        {/* Shirt */}
        <path
          d="M 90 240 C 70 270, 230 270, 210 240 L 150 280 Z"
          fill="#424242"
        />
        {/* Ruff Collar */}
        <g fill="#fafafa">
            <ellipse cx="150" cy="240" rx="80" ry="15"/>
            <ellipse cx="150" cy="235" rx="75" ry="15"/>
        </g>

        {/* Head */}
        <ellipse cx="150" cy="150" rx="70" ry="80" fill="url(#skinGradientVesalius)" />

        {/* Beard */}
        <path
          d="M 110,190 C 110,240 120,260 150,260 C 180,260 190,240 190,190 Q 150,220 110,190 Z"
          fill="url(#hairGradientVesalius)"
        />

        {/* Mouth */}
        <g style={{ opacity: mouthOpen ? 1 : 0 }}>
          <ellipse
            cx="150"
            cy="195"
            rx="10"
            ry={7 * mouthOpenScale}
            fill="#5e3a30"
          />
        </g>
        
        {/* Hair */}
        <path
          d="M 90,80 C 70,120 120,130 150,130 C 180,130 230,120 210,80 Q 150,60 90,80 Z"
          fill="url(#hairGradientVesalius)"
        />

        {/* Eyes */}
        <g style={{ opacity: eyesOpen ? 1 : 0 }}>
          <ellipse cx="120" cy="155" rx="10" ry="8" fill="white" />
          <circle cx="120" cy="155" r="5" fill="url(#eyeGradientVesalius)" />
          <ellipse cx="180" cy="155" rx="10" ry="8" fill="white" />
          <circle cx="180" cy="155" r="5" fill="url(#eyeGradientVesalius)" />
        </g>
        <g style={{ opacity: eyesOpen ? 0 : 1 }}>
          <path d="M 110 155 C 120 160, 130 160, 130 155" stroke="black" strokeWidth="2" fill="none" />
          <path d="M 170 155 C 180 160, 190 160, 190 155" stroke="black" strokeWidth="2" fill="none" />
        </g>

        {/* Eyebrows */}
        <path d="M 105 140 Q 120 135, 135 140" stroke="#6d4c41" strokeWidth="4" fill="none" />
        <path d="M 165 140 Q 180 135, 195 140" stroke="#6d4c41" strokeWidth="4" fill="none" />
        
        {/* Nose */}
        <path d="M 150 160 L 145 180 L 155 180 Z" fill="#d8b9a4" />

      </g>
    </svg>
  );
}
