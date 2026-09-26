import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Logo: React.FC<LogoProps> = ({ className = '', size = 'md' }) => {
  const isLarge = size === 'lg';
  const isSmall = size === 'sm';

  return (
    <div className={`flex flex-col items-center select-none text-center ${className}`}>
      {/* Exact Vector Silhouette from Premier Mobile Logo */}
      <div className="relative mb-2 flex items-center justify-center">
        <svg
          viewBox="0 0 500 160"
          className={`${
            isLarge ? 'w-64 sm:w-72 h-auto' : isSmall ? 'w-40 h-auto' : 'w-52 sm:w-56 h-auto'
          } text-heading filter drop-shadow-logo`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Upper Roof Arch (Canopy) */}
          <path
            d="M 154 75 C 166 38, 212 30, 250 30 C 288 30, 334 38, 346 75 C 340 73, 326 44, 298 38 C 274 33, 226 33, 202 38 C 174 44, 160 73, 154 75 Z"
            fill="currentColor"
          />

          {/* Windshield Base / Inner Horizon Line */}
          <path
            d="M 164 74 C 190 71, 220 70, 250 70 C 280 70, 310 71, 336 74 C 314 77, 280 77.5, 250 77.5 C 220 77.5, 186 77, 164 74 Z"
            fill="currentColor"
          />

          {/* Left Wing Mirror (Streamlined Teardrop) */}
          <path
            d="M 152 74 C 142 71, 128 73, 128 78 C 128 82, 136 84, 146 80 C 150 78, 153 76, 152 74 Z"
            fill="currentColor"
          />

          {/* Right Wing Mirror (Streamlined Teardrop) */}
          <path
            d="M 348 74 C 358 71, 372 73, 372 78 C 372 82, 364 84, 354 80 C 350 78, 347 76, 348 74 Z"
            fill="currentColor"
          />

          {/* Main Middle Dynamic Body Sweep (Hood / Waistline Arc) */}
          <path
            d="M 124 96 C 160 88, 204 84, 250 84 C 296 84, 340 88, 376 96 C 342 90, 298 87, 250 87 C 202 87, 158 90, 124 96 Z"
            fill="currentColor"
          />

          {/* Signature Lower Sweeping Swoosh with Right Tapered Wingtail */}
          <path
            d="M 136 104 C 172 98, 212 95, 256 95 C 292 95, 324 98, 352 104 C 362 106, 374 104, 386 96 C 376 106, 360 114, 344 116 C 322 118, 298 108, 264 103 C 220 97, 174 100, 136 104 Z"
            fill="currentColor"
          />
        </svg>
      </div>

      {/* 1. Main Title: PREMIER MOBILE */}
      <h1
        className="text-heading font-bold uppercase text-2xl sm:text-[26px] drop-shadow-sm tracking-[0.24em]"
        style={{ fontFamily: "'Cinzel', serif" }}
      >
        PREMIER MOBILE
      </h1>

      {/* 2. Sub-heading: PROFESSIONAL AUTO DETAIL */}
      <h2
        className="text-heading/90 text-[11px] sm:text-xs font-semibold tracking-[0.28em] uppercase mt-1"
        style={{ fontFamily: "'Montserrat', sans-serif" }}
      >
        PROFESSIONAL AUTO DETAIL
      </h2>

      {/* 3. Cities Line: San Antonio - New Braunfels - Austin */}
      <p
        className="text-accent-text text-[10px] sm:text-[11px] tracking-[0.18em] font-medium mt-1"
        style={{ fontFamily: "'Montserrat', sans-serif" }}
      >
        San Antonio - New Braunfels - Austin
      </p>
    </div>
  );
};


