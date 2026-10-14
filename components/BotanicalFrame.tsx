"use client";

export default function BotanicalFrame() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none"
    >
      {/* 1. TOP-LEFT CORNER BRANCH: Emerald Monstera with Gold Veins */}
      <svg
        className="absolute -top-12 -left-12 sm:-top-8 sm:-left-8 w-72 h-72 sm:w-96 sm:h-96 opacity-60 transition-opacity duration-300"
        viewBox="0 0 320 320"
        fill="none"
      >
        <defs>
          <linearGradient id="goldStem" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#d4af37" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#e5c158" stopOpacity="0.3" />
          </linearGradient>
          <linearGradient id="leafEmerald" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1a5538" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#0e3a24" stopOpacity="0.15" />
          </linearGradient>
        </defs>

        {/* Curved Vine / Branch */}
        <path
          d="M-20,-20 Q80,50 160,110 T240,210"
          stroke="url(#goldStem)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* Large Monstera Leaf 1 */}
        <g transform="translate(110, 80) rotate(25)">
          <path
            d="M0,0 C-40,-20 -70,20 -50,60 C-30,100 20,90 40,60 C60,30 30,-10 0,0 Z"
            fill="url(#leafEmerald)"
            stroke="#2d7c54"
            strokeWidth="1.5"
          />
          {/* Gold Ribs */}
          <path d="M0,0 Q-10,40 -15,75" stroke="#e5c158" strokeWidth="1.5" />
          <path d="M-5,25 Q-30,15 -42,12" stroke="#d4af37" strokeWidth="1" />
          <path d="M-8,45 Q-35,40 -45,45" stroke="#d4af37" strokeWidth="1" />
          <path d="M-4,30 Q20,20 32,25" stroke="#d4af37" strokeWidth="1" />
          <path d="M-10,55 Q15,50 25,60" stroke="#d4af37" strokeWidth="1" />
        </g>

        {/* Smaller Gold Palm Leaflet */}
        <g transform="translate(50, 40) rotate(-15)">
          <path
            d="M0,0 C15,25 45,40 70,45 C45,35 25,15 0,0 Z"
            fill="rgba(212, 175, 55, 0.15)"
            stroke="#e5c158"
            strokeWidth="1.2"
          />
          <path d="M0,0 Q35,25 65,42" stroke="#e5c158" strokeWidth="1" />
        </g>
      </svg>

      {/* 2. BOTTOM-RIGHT CORNER BRANCH: Golden Palm Frond & Leaf */}
      <svg
        className="absolute -bottom-14 -right-14 sm:-bottom-10 sm:-right-10 w-80 h-80 sm:w-[420px] sm:h-[420px] opacity-60 transition-opacity duration-300"
        viewBox="0 0 340 340"
        fill="none"
      >
        <defs>
          <linearGradient id="goldFan" x1="100%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#e5c158" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#c59b27" stopOpacity="0.2" />
          </linearGradient>
        </defs>

        {/* Branch creeping up */}
        <path
          d="M360,360 Q240,260 170,160"
          stroke="url(#goldFan)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* Golden Palm Fan Fronds */}
        <path d="M250,270 Q200,210 130,175" stroke="#e5c158" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M265,285 Q215,240 150,215" stroke="#d4af37" strokeWidth="1.3" />
        <path d="M280,300 Q240,270 180,260" stroke="#d4af37" strokeWidth="1.3" />
        <path d="M235,255 Q190,180 120,135" stroke="#e5c158" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M220,240 Q180,150 115,100" stroke="#e5c158" strokeWidth="1.5" strokeLinecap="round" />

        {/* Monstera leaf at base */}
        <g transform="translate(190, 190) rotate(140)">
          <path
            d="M0,0 C-35,-15 -60,20 -45,55 C-25,90 20,80 35,50 C50,20 25,-10 0,0 Z"
            fill="rgba(20, 68, 45, 0.3)"
            stroke="#2d7c54"
            strokeWidth="1.3"
          />
          <path d="M0,0 Q-10,35 -15,65" stroke="#d4af37" strokeWidth="1.2" />
        </g>
      </svg>

      {/* 3. TOP-RIGHT CORNER: Delicate Golden Accent Twig */}
      <svg
        className="absolute -top-6 -right-6 w-48 h-48 sm:w-64 sm:h-64 opacity-40 transition-opacity duration-300"
        viewBox="0 0 200 200"
        fill="none"
      >
        <path
          d="M210,-10 Q140,50 90,110"
          stroke="#d4af37"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path d="M160,30 Q120,25 95,15" stroke="#e5c158" strokeWidth="1.1" />
        <path d="M135,55 Q100,55 75,50" stroke="#e5c158" strokeWidth="1.1" />
        <path d="M110,85 Q75,90 55,90" stroke="#e5c158" strokeWidth="1.1" />
      </svg>
    </div>
  );
}