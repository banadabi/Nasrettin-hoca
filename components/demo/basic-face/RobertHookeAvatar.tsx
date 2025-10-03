/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';

type RobertHookeAvatarProps = {
  mouthOpenScale: number;
  eyesOpen: boolean;
  isTalking: boolean;
};

export default function RobertHookeAvatar({
  mouthOpenScale,
  eyesOpen,
}: RobertHookeAvatarProps) {
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
          id="skinGradientHooke"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" style={{ stopColor: '#f3dccf' }} />
          <stop offset="100%" style={{ stopColor: '#e1bda9' }} />
        </linearGradient>
        <linearGradient
          id="hairGradientHooke"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" style={{ stopColor: '#8d6e63' }} />
          <stop offset="100%" style={{ stopColor: '#5d4037' }} />
        </linearGradient>
        <radialGradient id="eyeGradientHooke">
          <stop offset="10%" stopColor="#6d4c41" />
          <stop offset="95%" stopColor="#4e342e" />
        </radialGradient>
      </defs>

      <g transform="translate(0, 10)">
        {/* Collar */}
        <path
          d="M 120 240 L 150 260 L 180 240 C 160 250, 140 250, 120 240 Z"
          fill="#f5f5f5"
        />
        <path
          d="M 100 250 C 80 280, 220 280, 200 250 L 150 270 Z"
          fill="#004d40"
        />

        {/* Head */}
        <circle cx="150" cy="155" r="75" fill="url(#skinGradientHooke)" />

        {/* Hair (Periwig) */}
        <g fill="url(#hairGradientHooke)">
          <path d="M 70,90 C 40,130 50,240 100,250 L 100,160 C 50,160 50,90 70,90 Z" />
          <path d="M 230,90 C 260,130 250,240 200,250 L 200,160 C 250,160 250,90 230,90 Z" />
          <path d="M 90,70 C 60,40 240,40 210,70 C 220,50 180,20 150,20 C 120,20 80,50 90,70 Z" />
          <circle cx="90" cy="180" r="20" />
          <circle cx="210" cy="180" r="20" />
          <circle cx="95" cy="210" r="20" />
          <circle cx="205" cy="210" r="20" />
        </g>

        {/* Eyes */}
        <g style={{ opacity: eyesOpen ? 1 : 0 }}>
          <ellipse cx="125" cy="150" rx="12" ry="9" fill="white" />
          <circle cx="125" cy="150" r="6" fill="url(#eyeGradientHooke)" />
          <ellipse cx="175" cy="150" rx="12" ry="9" fill="white" />
          <circle cx="175" cy="150" r="6" fill="url(#eyeGradientHooke)" />
        </g>
        <g style={{ opacity: eyesOpen ? 0 : 1 }}>
          <path
            d="M 115 150 C 120 153, 130 153, 135 150"
            stroke="black"
            strokeWidth="2"
            fill="none"
          />
          <path
            d="M 165 150 C 170 153, 180 153, 185 150"
            stroke="black"
            strokeWidth="2"
            fill="none"
          />
        </g>

        {/* Eyebrows */}
        <path
          d="M 110 135 Q 125 130, 140 135"
          stroke="#5d4037"
          strokeWidth="4"
          fill="none"
        />
        <path
          d="M 160 135 Q 175 130, 190 135"
          stroke="#5d4037"
          strokeWidth="4"
          fill="none"
        />

        {/* Nose */}
        <path d="M 150 160 C 145 175, 155 175, 150 160 L 150 175" stroke="#c8a991" strokeWidth="2" fill="none" />

        {/* Mouth */}
        <g style={{ opacity: mouthOpen ? 0 : 1 }}>
          <path
            d="M 140 195 Q 150 205, 160 195"
            stroke="#a1887f"
            strokeWidth="2"
            fill="none"
          />
        </g>
        <g style={{ opacity: mouthOpen ? 1 : 0 }}>
          <ellipse
            cx="150"
            cy="200"
            rx="15"
            ry={10 * mouthOpenScale}
            fill="#5e3a30"
          />
        </g>
      </g>
    </svg>
  );
}
