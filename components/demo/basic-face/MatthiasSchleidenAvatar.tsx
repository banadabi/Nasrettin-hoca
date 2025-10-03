/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';

type MatthiasSchleidenAvatarProps = {
  mouthOpenScale: number;
  eyesOpen: boolean;
  isTalking: boolean;
};

export default function MatthiasSchleidenAvatar({
  mouthOpenScale,
  eyesOpen,
}: MatthiasSchleidenAvatarProps) {
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
          id="skinGradientSchleiden"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" style={{ stopColor: '#f5e4d8' }} />
          <stop offset="100%" style={{ stopColor: '#e3c2af' }} />
        </linearGradient>
        <linearGradient
          id="hairGradientSchleiden"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" style={{ stopColor: '#6d4c41' }} />
          <stop offset="100%" style={{ stopColor: '#4e342e' }} />
        </linearGradient>
        <radialGradient id="eyeGradientSchleiden">
          <stop offset="10%" stopColor="#81c995" />
          <stop offset="95%" stopColor="#558b2f" />
        </radialGradient>
      </defs>

      <g transform="translate(0, 10)">
        {/* Jacket */}
        <path
          d="M 90 240 C 70 270, 230 270, 210 240 L 150 280 Z"
          fill="#3e2723"
        />
        {/* Shirt and Cravat */}
        <path
            d="M 140 230 L 150 250 L 160 230 Z"
            fill="#263238"
        />
        <path
          d="M 120 230 L 150 240 L 180 230 C 160 235, 140 235, 120 230 Z"
          fill="#f5f5f5"
        />


        {/* Head */}
        <ellipse cx="150" cy="150" rx="70" ry="80" fill="url(#skinGradientSchleiden)" />

        {/* Hair */}
        <g fill="url(#hairGradientSchleiden)">
            <path d="M 90,80 C 70,120 120,130 150,130 C 180,130 230,120 210,80 Q 150,60 90,80 Z" />
            {/* Sideburns */}
            <path d="M 80,140 C 70,160 75,190 85,190 L 85,140 Z"/>
            <path d="M 220,140 C 230,160 225,190 215,190 L 215,140 Z"/>
        </g>
        
        {/* Eyes */}
        <g style={{ opacity: eyesOpen ? 1 : 0 }}>
          <ellipse cx="120" cy="155" rx="10" ry="8" fill="white" />
          <circle cx="120" cy="155" r="5" fill="url(#eyeGradientSchleiden)" />
          <ellipse cx="180" cy="155" rx="10" ry="8" fill="white" />
          <circle cx="180" cy="155" r="5" fill="url(#eyeGradientSchleiden)" />
        </g>
        <g style={{ opacity: eyesOpen ? 0 : 1 }}>
          <path d="M 110 155 C 120 160, 130 160, 130 155" stroke="black" strokeWidth="2" fill="none" />
          <path d="M 170 155 C 180 160, 190 160, 190 155" stroke="black" strokeWidth="2" fill="none" />
        </g>
        
        {/* Glasses */}
        <g stroke="#4e342e" strokeWidth="2" fill="none">
            <circle cx="120" cy="155" r="15"/>
            <circle cx="180" cy="155" r="15"/>
            <path d="M 135 155 H 165"/>
        </g>

        {/* Eyebrows */}
        <path d="M 105 135 Q 120 130, 135 135" stroke="#4e342e" strokeWidth="4" fill="none" />
        <path d="M 165 135 Q 180 130, 195 135" stroke="#4e342e" strokeWidth="4" fill="none" />
        
        {/* Nose */}
        <path d="M 150 160 L 145 180 L 155 180 Z" fill="#e3c2af" />

        {/* Mouth */}
        <g style={{ opacity: mouthOpen ? 0 : 1 }}>
          <path
            d="M 140 200 Q 150 205, 160 200"
            stroke="#a1887f"
            strokeWidth="2"
            fill="none"
          />
        </g>
        <g style={{ opacity: mouthOpen ? 1 : 0 }}>
          <ellipse
            cx="150"
            cy="202"
            rx="10"
            ry={7 * mouthOpenScale}
            fill="#5e3a30"
          />
        </g>

      </g>
    </svg>
  );
}