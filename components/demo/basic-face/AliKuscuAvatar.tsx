/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';

type AliKuscuAvatarProps = {
  mouthOpenScale: number;
  eyesOpen: boolean;
  isTalking: boolean;
};

export default function AliKuscuAvatar({
  mouthOpenScale,
  eyesOpen,
  isTalking,
}: AliKuscuAvatarProps) {
  const mouthOpen = mouthOpenScale > 0.1;
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 300 300"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="skinGradientAli" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#e0b8a8' }} />
          <stop offset="100%" style={{ stopColor: '#c89f83' }} />
        </linearGradient>
        <linearGradient
          id="turbanGradient"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" style={{ stopColor: '#f5f5f5' }} />
          <stop offset="100%" style={{ stopColor: '#e0e0e0' }} />
        </linearGradient>
        <radialGradient id="eyeGradientAli">
          <stop offset="10%" stopColor="#422d0d" />
          <stop offset="95%" stopColor="#2c1e08" />
        </radialGradient>
        <filter id="shadowAli" x="-20%" y="-20%" width="140%" height="140%">
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

      <g transform="translate(-22, -25) scale(1.15)">
        {/* Turban */}
        <path
          d="M 80,100 C 60,60 240,60 220,100 C 260,130 250,180 220,180 C 180,200 120,200 80,180 C 50,180 40,130 80,100 Z"
          fill="url(#turbanGradient)"
        />
        <path
          d="M 150,50 C 170,50 180,70 170,80 L 130,80 C 120,70 130,50 150,50 Z"
          fill="#d32f2f"
        />

        {/* Head */}
        <path
          d="M 100,160 C 100,220 200,220 200,160 Q 150,130 100,160 Z"
          fill="url(#skinGradientAli)"
          filter="url(#shadowAli)"
        />

        {/* Neck and Shoulders */}
        <path
          d="M 130 250 C 130 270, 170 270, 170 250 L 180 280 H 120 Z"
          fill="#c89f83"
        />
        <path
          d="M 90 280 C 50 300, 250 300, 210 280 L 150 300 Z"
          fill="#263238"
        />

        {/* Beard */}
        <path
          d="M 100,190 C 100,250 120,280 150,280 C 180,280 200,250 200,190 Q 150,220 100,190 Z"
          fill="#e0e0e0"
        />
        <path
          d="M 120,180 C 100,200 100,230 120,250 Q 150,260 180,250 C 200,230 200,200 180,180"
          fill="#bdbdbd"
        />

        {/* Eyes */}
        <g
          id="eyes-open-ali"
          style={{ transition: 'opacity 0.1s', opacity: eyesOpen ? 1 : 0 }}
        >
          <ellipse cx="125" cy="175" rx="10" ry="7" fill="white" />
          <circle cx="125" cy="175" r="5" fill="url(#eyeGradientAli)" />
          <circle cx="124" cy="174" r="1.5" fill="white" opacity="0.8" />

          <ellipse cx="175" cy="175" rx="10" ry="7" fill="white" />
          <circle cx="175" cy="175" r="5" fill="url(#eyeGradientAli)" />
          <circle cx="174" cy="174" r="1.5" fill="white" opacity="0.8" />
          <g
            id="star-reflection"
            style={{
              transition: 'opacity 0.3s ease-in-out',
              opacity: isTalking ? 0.9 : 0,
            }}
          >
            {/* Star in left eye */}
            <path
              d="M 125 172 L 126 174 L 128 175 L 126 176 L 125 178 L 124 176 L 122 175 L 124 174 Z"
              fill="white"
            />
            {/* Star in right eye */}
            <path
              d="M 175 172 L 176 174 L 178 175 L 176 176 L 175 178 L 174 176 L 172 175 L 174 174 Z"
              fill="white"
            />
          </g>
        </g>
        <g
          id="eyes-closed-ali"
          style={{ transition: 'opacity 0.1s', opacity: eyesOpen ? 0 : 1 }}
        >
          <path
            d="M 115 175 C 120 178, 130 178, 135 175"
            stroke="black"
            strokeWidth="2"
            fill="none"
          />
          <path
            d="M 165 175 C 170 178, 180 178, 185 175"
            stroke="black"
            strokeWidth="2"
            fill="none"
          />
        </g>

        {/* Eyebrows */}
        <path
          d="M 110 160 Q 125 155, 140 160"
          stroke="#bdbdbd"
          strokeWidth="4"
          fill="none"
        />
        <path
          d="M 160 160 Q 175 155, 190 160"
          stroke="#bdbdbd"
          strokeWidth="4"
          fill="none"
        />

        {/* Mouth */}
        <g
          id="mouth-closed-ali"
          style={{ transition: 'opacity 0.1s', opacity: mouthOpen ? 0 : 1 }}
        >
          <path
            d="M 140 210 H 160"
            stroke="#6d4c41"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </g>
        <g
          id="mouth-open-ali"
          style={{ transition: 'opacity 0.1s', opacity: mouthOpen ? 1 : 0 }}
        >
          <ellipse
            cx="150"
            cy="214"
            rx="15"
            ry={10 * mouthOpenScale}
            fill="#5e1919"
          />
        </g>
      </g>
    </svg>
  );
}
