"use client";

import React from "react";

interface LogoProps {
  className?: string;
  size?: number;
}

/**
 * High-Precision Vector SVG Logo for Vraj Clerk (initials VC).
 * 
 * Design Features:
 * - 100% Pure SVG Vector: Infinitely crisp at 16px, 32px, retina 2x/3x, and 4K displays.
 * - Theme Adaptive Contrast:
 *   - Light Mode: Crisp pure white frosted plate, Deep Cobalt Blue (#1D4ED8) V stroke,
 *     and vibrant Blaze Orange (#FF6B00) C stroke.
 *   - Dark Mode: Matte Carbon (#161A22) plate, Luminous Electric Cyan (#38BDF8) V stroke,
 *     and high-voltage Blaze Orange (#FF6B00) C stroke.
 * - Micro-calibrated 3.2px stroke geometry for instantaneous legibility at header size.
 */
export function Logo({ className = "", size = 36 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`transition-transform duration-300 ${className}`}
      aria-label="Vraj Clerk Logo"
    >
      <defs>
        {/* Soft Ambient Inner Depth Shadow */}
        <filter id="logo-depth" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="1" stdDeviation="1" floodColor="#000000" floodOpacity="0.12" />
        </filter>
      </defs>

      {/* Theme-Adaptive Background Plate */}
      <rect
        x="0.6"
        y="0.6"
        width="34.8"
        height="34.8"
        rx="10"
        className="fill-card dark:fill-[#161A22] stroke-border/80 dark:stroke-white/15"
        strokeWidth="1.2"
      />

      {/* Main Logo Geometry with micro shadow */}
      <g filter="url(#logo-depth)">
        {/* Letter 'V': Precision Angled Chevron */}
        <path
          d="M8.5 11.5 L14.5 24.5 L20.5 11.5"
          className="stroke-[#1D4ED8] dark:stroke-[#38BDF8]"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Letter 'C': Interlocking Geometric Arc */}
        <path
          d="M28.5 12.5 C28.5 12.5 25 10.5 21 12.2 C18 13.6 17 17 17.5 19.8 C18.2 23.2 21 25.5 24.8 24.8 C27.5 24.2 28.5 23 28.5 23"
          stroke="#FF6B00"
          strokeWidth="3.2"
          strokeLinecap="round"
        />

        {/* Subtle Interlocking Micro-Accent Dot */}
        <circle
          cx="20.8"
          cy="18"
          r="1.2"
          className="fill-[#1D4ED8] dark:fill-[#38BDF8]"
          opacity="0.9"
        />
      </g>
    </svg>
  );
}
