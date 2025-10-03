/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';

type RudolfVirchowAvatarProps = {
  mouthOpenScale: number;
  eyesOpen: boolean;
  isTalking: boolean;
};

export default function RudolfVirchowAvatar({
  mouthOpenScale,
  eyesOpen,
}: RudolfVirchowAvatarProps) {
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
          id="skinGradientVirchow"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" style={{ stopColor: '#f2e2d8' }} />
          <stop offset="100%" style={{ stopColor: '#e0c1b0' }} />
        </linearGradient>
        <linearGradient
          id="hairGradientVirchow"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" style={{ stopColor: '#9e9e9e' }} />
          <stop offset="100%" style={{ stopColor: '#616161' }} />
        </linearGradient>
        <radialGradient id="eyeGradientVirchow">
          <stop offset="10%" stopColor="#455a64" />
          <stop offset="95%" stopColor="#263238" />
        </radialGradient>
      </defs>

      <g transform="translate(0, 10)">
        {/* Jacket and Shirt */}
        <path
          d="M 90 240 C 70 270, 230 270, 210 240 L 150 280 Z"
          fill="#212121"
        />
        <path
            d="M 140 235 L 150 245 L 160 235 Z"
            fill="#424242" // Bowtie
        />
         <path
          d="M 120 230 L 150 240 L 180 230 C 160 235, 140 235, 120 230 Z"
          fill="#fafafa" // Collar
        />

        {/* Head */}
        <ellipse cx="150" cy="150" rx="70" ry="85" fill="url(#skinGradientVirchow)" />

        {/* Beard */}
        <path
          d="M 110,190 C 110,240 120,260 150,260 C 180,260 190,240 190,190 Q 150,230 110,190 Z"
          fill="url(#hairGradientVirchow)"
        />

        {/* Mouth */}
         <g style={{ opacity: mouthOpen ? 0 : 1 }}>
          <path
            d="M 140 205 H 160"
            stroke="#a1887f"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </g>
        <g style={{ opacity: mouthOpen ? 1 : 0 }}>
          <ellipse
            cx="150"
            cy="208"
            rx="12"
            ry={8 * mouthOpenScale}
            fill="#5e3a30"
          />
        </g>

        {/* Hair */}
        <path
          d="M 90,80 C 70,120 120,130 150,130 C 180,130 230,120 210,80 Q 150,50 90,80 Z"
          fill="url(#hairGradientVirchow)"
        />

        {/* Eyes */}
        <g style={{ opacity: eyesOpen ? 1 : 0 }}>
          <ellipse cx="120" cy="155" rx="10" ry="8" fill="white" />
          <circle cx="120" cy="155" r="5" fill="url(#eyeGradientVirchow)" />
          <ellipse cx="180" cy="155" rx="10" ry="8" fill="white" />
          <circle cx="180" cy="155" r="5" fill="url(#eyeGradientVirchow)" />
        </g>
        <g style={{ opacity: eyesOpen ? 0 : 1 }}>
          <path d="M 110 155 C 120 160, 130 160, 130 155" stroke="black" strokeWidth="2" fill="none" />
          <path d="M 170 155 C 180 160, 190 160, 190 155" stroke="black" strokeWidth="2" fill="none" />
        </g>

        {/* Eyebrows */}
        <path d="M 105 140 Q 120 135, 135 140" stroke="#616161" strokeWidth="4" fill="none" />
        <path d="M 165 140 Q 180 135, 195 140" stroke="#616161" strokeWidth="4" fill="none" />
        
        {/* Nose */}
        <path d="M 150 160 L 145 180 L 155 180 Z" fill="#e0c1b0" />
      </g>
    </svg>
  );
}