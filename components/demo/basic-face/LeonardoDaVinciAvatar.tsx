/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';

type LeonardoDaVinciAvatarProps = {
  mouthOpenScale: number;
  eyesOpen: boolean;
  isTalking: boolean;
};

export default function LeonardoDaVinciAvatar({
  mouthOpenScale,
  eyesOpen,
}: LeonardoDaVinciAvatarProps) {
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
          id="skinGradientDaVinci"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" style={{ stopColor: '#f3e1d1' }} />
          <stop offset="100%" style={{ stopColor: '#e1bfa8' }} />
        </linearGradient>
        <linearGradient
          id="hairGradientDaVinci"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" style={{ stopColor: '#f5f5f5' }} />
          <stop offset="100%" style={{ stopColor: '#bdbdbd' }} />
        </linearGradient>
        <radialGradient id="eyeGradientDaVinci">
          <stop offset="10%" stopColor="#8d6e63" />
          <stop offset="95%" stopColor="#5d4037" />
        </radialGradient>
      </defs>

      <g transform="translate(0, 10)">
        {/* Robe */}
        <path
          d="M 90 250 C 70 280, 230 280, 210 250 L 150 280 Z"
          fill="#5d4037"
        />

        {/* Head */}
        <ellipse cx="150" cy="150" rx="70" ry="80" fill="url(#skinGradientDaVinci)" />

        {/* Beard */}
        <path
          d="M 100,180 C 100,260 120,290 150,290 C 180,290 200,260 200,180 Q 150,230 100,180 Z"
          fill="url(#hairGradientDaVinci)"
        />

         {/* Mouth */}
        <g style={{ opacity: mouthOpen ? 0 : 1 }}>
            <path d="M 140 205 H 160" stroke="#a1887f" strokeWidth="2" strokeLinecap="round"/>
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
        <g fill="url(#hairGradientDaVinci)">
          <path d="M 80,90 C 60,130 60,200 100,220 L 100,160 C 60,160 60,90 80,90 Z" />
          <path d="M 220,90 C 240,130 240,200 200,220 L 200,160 C 240,160 240,90 220,90 Z" />
          <path d="M 100,80 C 80,50 220,50 200,80 C 200,70 180,60 150,60 C 120,60 100,70 100,80 Z" />
        </g>
        
        {/* Beret */}
        <path d="M 90 80 Q 150 50, 210 80 C 200 90, 100 90, 90 80 Z" fill="#7b1fa2"/>
        <ellipse cx="150" cy="80" rx="65" ry="15" fill="#8e24aa"/>

        {/* Eyes */}
        <g style={{ opacity: eyesOpen ? 1 : 0 }}>
          <ellipse cx="125" cy="155" rx="10" ry="8" fill="white" />
          <circle cx="125" cy="155" r="5" fill="url(#eyeGradientDaVinci)" />
          <ellipse cx="175" cy="155" rx="10" ry="8" fill="white" />
          <circle cx="175" cy="155" r="5" fill="url(#eyeGradientDaVinci)" />
        </g>
        <g style={{ opacity: eyesOpen ? 0 : 1 }}>
          <path d="M 115 155 C 125 160, 135 160, 135 155" stroke="black" strokeWidth="2" fill="none" />
          <path d="M 165 155 C 175 160, 185 160, 185 155" stroke="black" strokeWidth="2" fill="none" />
        </g>

        {/* Eyebrows */}
        <path d="M 110 140 Q 125 135, 140 140" stroke="#bdbdbd" strokeWidth="4" fill="none" />
        <path d="M 160 140 Q 175 135, 190 140" stroke="#bdbdbd" strokeWidth="4" fill="none" />
        
        {/* Nose */}
        <path d="M 150 160 L 145 185 L 155 185 Z" fill="#e1bfa8" />

      </g>
    </svg>
  );
}