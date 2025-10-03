/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React from "react";

type NasreddinHocaAvatarProps = {
  mouthOpenScale: number;
  eyesOpen: boolean;
  isTalking: boolean;
};

export default function NasreddinHocaAvatar({
  mouthOpenScale,
  eyesOpen,
  isTalking,
}: NasreddinHocaAvatarProps) {
  const mouthOpen = mouthOpenScale > 0.1;
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 300 360"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="skinGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: "#e0b8a8" }} />
          <stop offset="100%" style={{ stopColor: "#c89f83" }} />
        </linearGradient>
        <linearGradient
          id="turbanGradientClassic"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" style={{ stopColor: "#FFFFFF" }} />
          <stop offset="100%" style={{ stopColor: "#E8E8E8" }} />
        </linearGradient>
        <radialGradient id="eyeGradient">
          <stop offset="10%" stopColor="#422d0d" />
          <stop offset="95%" stopColor="#2c1e08" />
        </radialGradient>
        <radialGradient id="beardGradientNew">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#E0E0E0" />
        </radialGradient>
        <filter id="softShadow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="3" result="blur" />
          <feOffset in="blur" dx="2" dy="4" result="offsetBlur" />
          <feFlood floodColor="#000" floodOpacity="0.2" result="offsetColor" />
          <feComposite
            in="offsetColor"
            in2="offsetBlur"
            operator="in"
            result="offsetBlur"
          />
          <feMerge>
            <feMergeNode in="offsetBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <g transform="translate(0, 10)">
        {/* Giysi / Omuzlar */}
        <path
          d="M 100,280 C 80,320 220,320 200,280 L 150,310 Z"
          fill="#bcaaa4"
        />

        {/* Geleneksel Beyaz Sarık */}
        <g filter="url(#softShadow)">
          {/* Alt katman */}
          <ellipse
            cx="150"
            cy="120"
            rx="90"
            ry="30"
            fill="url(#turbanGradientClassic)"
          />
          {/* Orta katman */}
          <ellipse
            cx="150"
            cy="95"
            rx="80"
            ry="28"
            fill="url(#turbanGradientClassic)"
          />
          {/* Üst katman */}
          <ellipse
            cx="150"
            cy="70"
            rx="65"
            ry="23"
            fill="url(#turbanGradientClassic)"
          />
          {/* Fes */}
          <path
            d="M 135,50 C 135,40 165,40 165,50 C 160,55 140,55 135,50 Z"
            fill="#d32f2f"
          />
        </g>

        {/* Baş */}
        <ellipse cx="150" cy="165" rx="55" ry="60" fill="url(#skinGradient)" />

        {/* Büyük kabarık sakal */}
        <g filter="url(#softShadow)">
          <path
            d="M 95,170 C 20,220 50,350 150,350 C 250,350 280,220 205,170 C 200,200 180,210 150,210 C 120,210 100,200 95,170 Z"
            fill="url(#beardGradientNew)"
          />
        </g>

        {/* Gür Bıyık */}
        <path
          d="M 110,195 C 120,180 180,180 190,195 C 170,215 130,215 110,195 Z"
          fill="url(#beardGradientNew)"
        />

        {/* Ağız (bıyık altında) */}
        <g style={{ opacity: mouthOpen ? 1 : 0 }}>
          <ellipse
            cx="150"
            cy="205"
            rx="15"
            ry={10 * mouthOpenScale}
            fill="#5e1919"
          />
        </g>

        {/* Burun */}
        <ellipse
          cx="150"
          cy="180"
          rx="12"
          ry="10"
          fill="#f0beaf"
          stroke="#c89f83"
          strokeWidth="1"
        />

        {/* Gözler */}
        <g style={{ transition: "opacity 0.1s", opacity: eyesOpen ? 1 : 0 }}>
          <ellipse cx="125" cy="165" rx="10" ry="8" fill="white" />
          <circle cx="125" cy="165" r="5" fill="url(#eyeGradient)" />
          <circle cx="124" cy="164" r="1.5" fill="white" opacity="0.8" />

          <ellipse cx="175" cy="165" rx="10" ry="8" fill="white" />
          <circle cx="175" cy="165" r="5" fill="url(#eyeGradient)" />
          <circle cx="176" cy="164" r="1.5" fill="white" opacity="0.8" />
        </g>
        <g style={{ transition: "opacity 0.1s", opacity: eyesOpen ? 0 : 1 }}>
          <path
            d="M 115 165 C 125 170 135 170 135 165"
            stroke="black"
            strokeWidth="2"
            fill="none"
          />
          <path
            d="M 165 165 C 175 170 185 170 185 165"
            stroke="black"
            strokeWidth="2"
            fill="none"
          />
        </g>

        {/* Kaşlar */}
        <path
          d="M 110 145 Q 125 140, 140 145"
          stroke="#f5f5f5"
          strokeWidth="6"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M 160 145 Q 175 140, 190 145"
          stroke="#f5f5f5"
          strokeWidth="6"
          fill="none"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}