/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';

type AntonieVanLeeuwenhoekAvatarProps = {
  mouthOpenScale: number;
  eyesOpen: boolean;
  isTalking: boolean;
};

export default function AntonieVanLeeuwenhoekAvatar({
  mouthOpenScale,
  eyesOpen,
}: AntonieVanLeeuwenhoekAvatarProps) {
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
          id="skinGradientLeeuwenhoek"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" style={{ stopColor: '#f7e6d5' }} />
          <stop offset="100%" style={{ stopColor: '#e5c3a8' }} />
        </linearGradient>
        <linearGradient
          id="hairGradientLeeuwenhoek"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" style={{ stopColor: '#616161' }} />
          <stop offset="100%" style={{ stopColor: '#424242' }} />
        </linearGradient>
        <radialGradient id="eyeGradientLeeuwenhoek">
          <stop offset="10%" stopColor="#81c995" />
          <stop offset="95%" stopColor="#388e3c" />
        </radialGradient>
      </defs>

      <g transform="translate(0, 10)">
        {/* Robe */}
        <path
          d="M 90 250 C 70 280, 230 280, 210 250 L 150 280 Z"
          fill="#1565c0"
        />

        {/* Head */}
        <circle cx="150" cy="160" r="70" fill="url(#skinGradientLeeuwenhoek)" />

        {/* Hair */}
        <g fill="url(#hairGradientLeeuwenhoek)">
          <path d="M 80,100 C 50,150 60,260 110,260 L 110,160 C 60,160 60,90 80,100 Z" />
          <path d="M 220,100 C 250,150 240,260 190,260 L 190,160 C 240,160 240,90 220,100 Z" />
          <path d="M 100,80 C 80,50 220,50 200,80 C 200,60 170,40 150,40 C 130,40 100,60 100,80 Z" />
        </g>
        
        {/* Collar */}
         <path
          d="M 120 230 L 150 240 L 180 230 C 160 235, 140 235, 120 230 Z"
          fill="#ffffff"
        />

        {/* Eyes */}
        <g style={{ opacity: eyesOpen ? 1 : 0 }}>
          <ellipse cx="125" cy="155" rx="10" ry="8" fill="white" />
          <circle cx="125" cy="155" r="5" fill="url(#eyeGradientLeeuwenhoek)" />
          <ellipse cx="175" cy="155" rx="10" ry="8" fill="white" />
          <circle cx="175" cy="155" r="5" fill="url(#eyeGradientLeeuwenhoek)" />
        </g>
        <g style={{ opacity: eyesOpen ? 0 : 1 }}>
          <path
            d="M 115 155 C 120 158, 130 158, 135 155"
            stroke="black"
            strokeWidth="2"
            fill="none"
          />
          <path
            d="M 165 155 C 170 158, 180 158, 185 155"
            stroke="black"
            strokeWidth="2"
            fill="none"
          />
        </g>

        {/* Eyebrows */}
        <path
          d="M 110 140 Q 125 135, 140 140"
          stroke="#424242"
          strokeWidth="3"
          fill="none"
        />
        <path
          d="M 160 140 Q 175 135, 190 140"
          stroke="#424242"
          strokeWidth="3"
          fill="none"
        />

        {/* Nose */}
        <path d="M 150 165 C 147 180, 153 180, 150 165" stroke="#d4b39a" strokeWidth="2" fill="none" />

        {/* Mouth */}
        <g style={{ opacity: mouthOpen ? 0 : 1 }}>
          <path
            d="M 140 200 H 160"
            stroke="#a1887f"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </g>
        <g style={{ opacity: mouthOpen ? 1 : 0 }}>
          <ellipse
            cx="150"
            cy="204"
            rx="12"
            ry={8 * mouthOpenScale}
            fill="#5e3a30"
          />
        </g>
      </g>
    </svg>
  );
}
