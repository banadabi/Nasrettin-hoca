/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';

type TheodorSchwannAvatarProps = {
  mouthOpenScale: number;
  eyesOpen: boolean;
  isTalking: boolean;
};

export default function TheodorSchwannAvatar({
  mouthOpenScale,
  eyesOpen,
}: TheodorSchwannAvatarProps) {
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
          id="skinGradientSchwann"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" style={{ stopColor: '#f8e8d9' }} />
          <stop offset="100%" style={{ stopColor: '#e6c8b0' }} />
        </linearGradient>
        <linearGradient
          id="hairGradientSchwann"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" style={{ stopColor: '#bcaaa4' }} />
          <stop offset="100%" style={{ stopColor: '#8d6e63' }} />
        </linearGradient>
        <radialGradient id="eyeGradientSchwann">
          <stop offset="10%" stopColor="#795548" />
          <stop offset="95%" stopColor="#4e342e" />
        </radialGradient>
      </defs>

      <g transform="translate(0, 10)">
        {/* Jacket */}
        <path
          d="M 90 240 C 70 270, 230 270, 210 240 L 150 280 Z"
          fill="#546e7a"
        />
        {/* Shirt and Bowtie */}
        <path
            d="M 140 235 L 150 245 L 160 235 Z"
            fill="#263238"
        />
         <path
          d="M 120 230 L 150 240 L 180 230 C 160 235, 140 235, 120 230 Z"
          fill="#eceff1"
        />


        {/* Head */}
        <ellipse cx="150" cy="150" rx="70" ry="80" fill="url(#skinGradientSchwann)" />

        {/* Hair */}
        <g fill="url(#hairGradientSchwann)">
            <path d="M 90,80 C 70,120 120,130 150,130 C 180,130 230,120 210,80 Q 150,60 90,80 Z" />
            <path d="M 80,140 C 75,160 80,190 90,190 L 90,140 Z"/>
            <path d="M 220,140 C 225,160 220,190 210,190 L 210,140 Z"/>
        </g>
        
        {/* Eyes */}
        <g style={{ opacity: eyesOpen ? 1 : 0 }}>
          <ellipse cx="120" cy="155" rx="10" ry="8" fill="white" />
          <circle cx="120" cy="155" r="5" fill="url(#eyeGradientSchwann)" />
          <ellipse cx="180" cy="155" rx="10" ry="8" fill="white" />
          <circle cx="180" cy="155" r="5" fill="url(#eyeGradientSchwann)" />
        </g>
        <g style={{ opacity: eyesOpen ? 0 : 1 }}>
          <path d="M 110 155 C 120 160, 130 160, 130 155" stroke="black" strokeWidth="2" fill="none" />
          <path d="M 170 155 C 180 160, 190 160, 190 155" stroke="black" strokeWidth="2" fill="none" />
        </g>
        
        {/* Eyebrows */}
        <path d="M 105 140 Q 120 135, 135 140" stroke="#8d6e63" strokeWidth="4" fill="none" />
        <path d="M 165 140 Q 180 135, 195 140" stroke="#8d6e63" strokeWidth="4" fill="none" />
        
        {/* Nose */}
        <path d="M 150 160 L 148 180 L 152 180 Z" fill="#e6c8b0" />

        {/* Mouth */}
        <g style={{ opacity: mouthOpen ? 0 : 1 }}>
          <path
            d="M 140 200 Q 150 210, 160 200"
            stroke="#a1887f"
            strokeWidth="2"
            fill="none"
          />
        </g>
        <g style={{ opacity: mouthOpen ? 1 : 0 }}>
          <ellipse
            cx="150"
            cy="205"
            rx="12"
            ry={8 * mouthOpenScale}
            fill="#5e3a30"
          />
        </g>
      </g>
    </svg>
  );
}