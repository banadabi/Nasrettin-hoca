/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';

type IsaacNewtonAvatarProps = {
  mouthOpenScale: number;
  eyesOpen: boolean;
  isTalking: boolean;
};

export default function IsaacNewtonAvatar({
  mouthOpenScale,
  eyesOpen,
  isTalking,
}: IsaacNewtonAvatarProps) {
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
          id="skinGradientNewton"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" style={{ stopColor: '#fdebe1' }} />
          <stop offset="100%" style={{ stopColor: '#f5c6b1' }} />
        </linearGradient>
        <linearGradient
          id="hairGradientNewton"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" style={{ stopColor: '#f5f5f5' }} />
          <stop offset="100%" style={{ stopColor: '#dcdcdc' }} />
        </linearGradient>
        <radialGradient id="eyeGradientNewton">
          <stop offset="10%" stopColor="#5a6a7b" />
          <stop offset="95%" stopColor="#3b4a59" />
        </radialGradient>
        <filter
          id="shadowNewton"
          x="-20%"
          y="-20%"
          width="140%"
          height="140%"
        >
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
        {/* Collar/Cravat */}
        <path
          d="M 120 240 L 150 270 L 180 240 C 160 250, 140 250, 120 240 Z"
          fill="#f5f5f5"
        />
        <path
          d="M 100 250 C 80 280, 220 280, 200 250 L 150 280 Z"
          fill="#37474f"
        />

        {/* Head */}
        <circle
          cx="150"
          cy="155"
          r="80"
          fill="url(#skinGradientNewton)"
          filter="url(#shadowNewton)"
        />

        {/* Hair (Periwig) */}
        <g fill="url(#hairGradientNewton)">
          {/* Main body of hair */}
          <path d="M 60,100 C 30,150 40,250 90,260 L 90,150 C 40,150 40,80 60,100 Z" />
          <path d="M 240,100 C 270,150 260,250 210,260 L 210,150 C 260,150 260,80 240,100 Z" />
          <path d="M 80,80 C 50,40 250,40 220,80 C 240,60 180,30 150,30 C 120,30 60,60 80,80 Z" />
          {/* Curls */}
          <circle cx="80" cy="180" r="25" />
          <circle cx="220" cy="180" r="25" />
          <circle cx="85" cy="215" r="25" />
          <circle cx="215" cy="215" r="25" />
          <circle cx="95" cy="245" r="20" />
          <circle cx="205" cy="245" r="20" />
        </g>

        {/* Eyes */}
        <g
          id="eyes-open-newton"
          style={{ transition: 'opacity 0.1s', opacity: eyesOpen ? 1 : 0 }}
        >
          <ellipse cx="125" cy="150" rx="12" ry="8" fill="white" />
          <circle cx="125" cy="150" r="6" fill="url(#eyeGradientNewton)" />
          <circle cx="123" cy="148" r="1.5" fill="white" opacity="0.8" />

          <ellipse cx="175" cy="150" rx="12" ry="8" fill="white" />
          <circle cx="175" cy="150" r="6" fill="url(#eyeGradientNewton)" />
          <circle cx="173" cy="148" r="1.5" fill="white" opacity="0.8" />
        </g>
        <g
          id="eyes-closed-newton"
          style={{ transition: 'opacity 0.1s', opacity: eyesOpen ? 0 : 1 }}
        >
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
          stroke="#cccccc"
          strokeWidth="4"
          fill="none"
        />
        <path
          d="M 160 135 Q 175 130, 190 135"
          stroke="#cccccc"
          strokeWidth="4"
          fill="none"
        />

        {/* Nose */}
        <path
          d="M 150 160 C 145 175, 155 175, 150 160 L 150 180"
          stroke="#d3a993"
          strokeWidth="2"
          fill="none"
        />

        {/* Mouth */}
        <g
          id="mouth-closed-newton"
          style={{ transition: 'opacity 0.1s', opacity: mouthOpen ? 0 : 1 }}
        >
          <path
            d="M 140 200 H 160"
            stroke="#a1887f"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </g>
        <g
          id="mouth-open-newton"
          style={{ transition: 'opacity 0.1s', opacity: mouthOpen ? 1 : 0 }}
        >
          <ellipse
            cx="150"
            cy="204"
            rx="15"
            ry={10 * mouthOpenScale}
            fill="#5e3a30"
          />
        </g>
      </g>
    </svg>
  );
}