/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';

type IbnSinaAvatarProps = {
  mouthOpenScale: number;
  eyesOpen: boolean;
  isTalking: boolean;
};

export default function IbnSinaAvatar({
  mouthOpenScale,
  eyesOpen,
  isTalking,
}: IbnSinaAvatarProps) {
  const mouthOpen = mouthOpenScale > 0.1;

  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 300 300"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="skinGradientIbnSina" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#e0c1a8' }} />
          <stop offset="100%" style={{ stopColor: '#c8a98f' }} />
        </linearGradient>
        <linearGradient id="turbanGradientIbnSina" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#c8e6c9' }} />
          <stop offset="100%" style={{ stopColor: '#a5d6a7' }} />
        </linearGradient>
        <linearGradient id="beardGradientIbnSina" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#424242' }} />
          <stop offset="100%" style={{ stopColor: '#212121' }} />
        </linearGradient>
        <radialGradient id="eyeGradientIbnSina">
          <stop offset="10%" stopColor="#4e342e" />
          <stop offset="95%" stopColor="#3e2723" />
        </radialGradient>
      </defs>

      <g transform="translate(0, 15)">
        {/* Robe */}
        <path
          d="M 90 260 C 60 290, 240 290, 210 260 L 150 290 Z"
          fill="#37474f"
        />

        {/* Head */}
        <ellipse cx="150" cy="160" rx="70" ry="80" fill="url(#skinGradientIbnSina)" />

        {/* Beard */}
        <path
          d="M 110,190 C 110,260 130,285 150,285 C 170,285 190,260 190,190 Q 150,230 110,190 Z"
          fill="url(#beardGradientIbnSina)"
        />

        {/* Mouth */}
        <g style={{ opacity: mouthOpen ? 0 : 1 }}>
            <path d="M 140 215 H 160" stroke="#a1887f" strokeWidth="2" strokeLinecap="round"/>
        </g>
        <g style={{ opacity: mouthOpen ? 1 : 0 }}>
          <ellipse
            cx="150"
            cy="218"
            rx="12"
            ry={8 * mouthOpenScale}
            fill="#5e3a30"
          />
        </g>
        
        {/* Eyes */}
        <g style={{ opacity: eyesOpen ? 1 : 0 }}>
          <ellipse cx="125" cy="165" rx="10" ry="7" fill="white" />
          <circle cx="125" cy="165" r="5" fill="url(#eyeGradientIbnSina)" />
          <ellipse cx="175" cy="165" rx="10" ry="7" fill="white" />
          <circle cx="175" cy="165" r="5" fill="url(#eyeGradientIbnSina)" />
        </g>
        <g style={{ opacity: eyesOpen ? 0 : 1 }}>
          <path d="M 115 165 C 125 170, 135 170, 135 165" stroke="black" strokeWidth="2" fill="none" />
          <path d="M 165 165 C 175 170, 185 170, 185 165" stroke="black" strokeWidth="2" fill="none" />
        </g>

        {/* Eyebrows */}
        <path d="M 110 150 Q 125 145, 140 150" stroke="#212121" strokeWidth="5" fill="none" />
        <path d="M 160 150 Q 175 145, 190 150" stroke="#212121" strokeWidth="5" fill="none" />
        
        {/* Nose */}
        <path d="M 150 170 L 145 190 L 155 190 Z" fill="#c8a98f" />

        {/* Turban */}
        <ellipse cx="150" cy="95" rx="90" ry="45" fill="url(#turbanGradientIbnSina)" />
        <ellipse cx="150" cy="65" rx="70" ry="30" fill="url(#turbanGradientIbnSina)" />
        <ellipse cx="150" cy="45" rx="50" ry="20" fill="url(#turbanGradientIbnSina)" />
        
        {/* Fes on top of Turban */}
        <ellipse cx="150" cy="30" rx="15" ry="8" fill="#d32f2f" />
      </g>
    </svg>
  );
}