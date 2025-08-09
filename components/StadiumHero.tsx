'use client';

interface StadiumHeroProps {
  title?: string;
  subtitle?: string;
  className?: string;
  /** Generic distant endzone color (non-descript Home banner) */
  homeColor?: string;
  /** Generic left sideline color (non-descript Away banner) */
  awayColor?: string;
}

export default function StadiumHero({
  title,
  subtitle,
  className = '',
  homeColor,
  awayColor,
}: StadiumHeroProps) {
  // Fallback brand-agnostic colors
  const homeC = homeColor ?? '#2563eb'; // blue-ish
  const awayC = awayColor ?? '#ef4444'; // red-ish

  // Generate randomized content for each board square
  const getSquareContent = (index: number) => {
    const random = Math.random();
    const row = Math.floor(index / 10);
    const col = index % 10;
    const x = 55 + col * 70; // square top-left x
    const y = 105 + row * 40; // square top-left y

    // Signature scribble
    if (random < 0.25) {
      const wiggle = 8 + Math.random() * 10;
      return (
        <path
          key={`sig-${index}`}
          d={`M${x + 4},${y + 24} C${x + 18},${y + 10} ${x + 28},${y + 35} ${x + 42},${y + 22} S${x + 60},${
            y + 25 - wiggle / 2
          } ${x + 66},${y + 24}`}
          stroke="#ffffff"
          strokeWidth="2"
          fill="none"
          opacity="0.35"
        />
      );
    }

    // Player number
    if (random < 0.45) {
      return (
        <text
          key={`num-${index}`}
          x={x + 35}
          y={y + 26}
          fontSize="20"
          fill="#ffffff"
          opacity="0.45"
          textAnchor="middle"
          fontWeight="bold"
        >
          {Math.floor(Math.random() * 99)}
        </text>
      );
    }

    // Football icon
    if (random < 0.65) {
      const angle = (Math.random() * 50 - 25).toFixed(1);
      return (
        <g
          key={`ball-${index}`}
          transform={`rotate(${angle} ${x + 35} ${y + 20})`}
          opacity="0.35"
        >
          <ellipse
            cx={x + 35}
            cy={y + 20}
            rx="15"
            ry="9"
            fill="#8b4513"
            stroke="#5a2c0d"
            strokeWidth="1.5"
          />
          <line
            x1={x + 23}
            y1={y + 20}
            x2={x + 47}
            y2={y + 20}
            stroke="#fff6e5"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
          <line
            x1={x + 29}
            y1={y + 16}
            x2={x + 29}
            y2={y + 24}
            stroke="#fff6e5"
            strokeWidth="1"
            strokeLinecap="round"
          />
          <line
            x1={x + 41}
            y1={y + 16}
            x2={x + 41}
            y2={y + 24}
            stroke="#fff6e5"
            strokeWidth="1"
            strokeLinecap="round"
          />
        </g>
      );
    }

    // Team initials
    if (random < 0.8) {
      const initials = [
        'SF',
        'KC',
        'DAL',
        'NE',
        'BUF',
        'PHI',
        'MIA',
        'GB',
        'LA',
        'NY',
      ];
      return (
        <text
          key={`team-${index}`}
          x={x + 35}
          y={y + 25}
          fontSize="15"
          fill="#ffcc00"
          opacity="0.55"
          textAnchor="middle"
          fontFamily="monospace"
        >
          {initials[Math.floor(Math.random() * initials.length)]}
        </text>
      );
    }

    // Picture-card thumbnail (polaroid style)
    const rot = (Math.random() * 10 - 5).toFixed(1);
    return (
      <g
        key={`pic-${index}`}
        transform={`rotate(${rot} ${x + 35} ${y + 20})`}
        opacity="0.45"
      >
        {/* Card */}
        <rect
          x={x + 14}
          y={y + 8}
          width="42"
          height="26"
          rx="3"
          ry="3"
          fill="#ffffff"
          opacity="0.22"
        />
        {/* Photo window */}
        <rect
          x={x + 18}
          y={y + 11}
          width="34"
          height="17"
          rx="2"
          fill="url(#pictureFill)"
        />
        {/* Bottom caption line */}
        <rect
          x={x + 22}
          y={y + 30}
          width="26"
          height="2"
          fill="#ffffff"
          opacity="0.45"
        />
      </g>
    );
  };

  return (
    <section
      className={`relative overflow-visible bg-gradient-to-b from-[#0b1221] via-[#0a1a12] to-black ${className}`}
    >
      {/* Stadium bowl + lights background */}
      <div className="absolute inset-0 -z-10">
        <svg
          viewBox="0 0 1600 900"
          className="w-full h-full"
          preserveAspectRatio="none"
        >
          <defs>
            {/* Vignette */}
            <radialGradient id="vignette" cx="50%" cy="40%" r="75%">
              <stop offset="0%" stopColor="rgba(0,0,0,0)" />
              <stop offset="100%" stopColor="rgba(0,0,0,0.25)" />
            </radialGradient>

            {/* Stadium tiers */}
            <linearGradient id="tierGrad" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#0f172a" />
              <stop offset="100%" stopColor="#020617" />
            </linearGradient>

            {/* Crowd bokeh dot */}
            <radialGradient id="crowdDot">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.55" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </radialGradient>

            {/* Light beam */}
            <linearGradient id="beamGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fff9c4" stopOpacity="0.8" />
              <stop offset="70%" stopColor="#fff59d" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#fff59d" stopOpacity="0" />
            </linearGradient>

            {/* Picture window fill */}
            <linearGradient id="pictureFill" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#34d399" stopOpacity="0.35" />
            </linearGradient>
          </defs>

          {/* Backdrop gradient */}
          <rect
            x="0"
            y="0"
            width="1600"
            height="900"
            fill="url(#tierGrad)"
            opacity="0.7"
          />

          {/* Concentric stadium tiers (upper deck feel) */}
          {[...Array(4)].map((_, i) => {
            const strokeW = 120 - i * 18;
            const ry = 260 - i * 28;
            const rx = 820 - i * 28;
            const opacity = 0.3 - i * 0.05;
            return (
              <ellipse
                key={`tier-${i}`}
                cx="800"
                cy="250"
                rx={rx}
                ry={ry}
                fill="none"
                stroke="url(#tierGrad)"
                strokeOpacity={opacity}
                strokeWidth={strokeW}
              />
            );
          })}

          {/* Crowd lights along rim */}
          {[...Array(12)].map((_, i) => {
            const cx = 150 + i * 120;
            return (
              <g key={`rim-${i}`}>
                <circle cx={cx} cy="90" r="10" fill="#ffffff" opacity="0.35" />
                <circle
                  cx={cx}
                  cy="90"
                  r="26"
                  fill="url(#crowdDot)"
                  opacity="0.25"
                />
              </g>
            );
          })}

          {/* Packed crowd bokeh */}
          {[...Array(360)].map((_, i) => {
            const cx = 30 + ((i * 11) % 1540);
            const row = Math.floor((i * 11) / 1540);
            const cy = 120 + row * 22 + (i % 3) * 3;
            const r = 2 + (i % 3);
            const o = 0.22 + (i % 5) * 0.03;
            return (
              <circle
                key={`crowd-${i}`}
                cx={cx}
                cy={cy}
                r={r}
                fill="url(#crowdDot)"
                opacity={o}
              />
            );
          })}

          {/* Multi-beam stadium lights */}
          {[200, 520, 1080, 1400].map((cx, idx) => {
            const tilt = idx % 2 === 0 ? -8 : 8;
            return (
              <g key={`beam-${idx}`} transform={`rotate(${tilt} ${cx} 0)`}>
                <polygon
                  points={`${cx - 20},0 ${cx + 20},0 ${cx + 120},420 ${cx - 120},420`}
                  fill="url(#beamGrad)"
                  opacity="0.35"
                />
              </g>
            );
          })}

          {/* Global vignette */}
          <rect x="0" y="0" width="1600" height="900" fill="url(#vignette)" />
        </svg>
      </div>

      {/* Field + board (angled upper-deck perspective) */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-full h-full" style={{ perspective: '1600px' }}>
          <svg
            viewBox="0 0 800 600"
            className="w-full h-full"
            style={{
              transform:
                'translateY(2%) scale(1.6) rotateX(38deg) rotateZ(-2deg)',
              transformOrigin: 'center bottom',
              filter: 'drop-shadow(0px 40px 80px rgba(0,0,0,0.55))',
            }}
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              {/* Grass Pattern */}
              <pattern
                id="fieldGrass"
                patternUnits="userSpaceOnUse"
                width="100"
                height="100"
              >
                <rect width="100" height="50" fill="#2d5016" />
                <rect y="50" width="100" height="50" fill="#355d1e" />
              </pattern>

              {/* Distant endzone (home banner) */}
              <linearGradient id="homeZone" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={homeC} stopOpacity="0.75" />
                <stop offset="100%" stopColor={homeC} stopOpacity="0.45" />
              </linearGradient>

              {/* Left sideline (away banner) */}
              <linearGradient id="awaySide" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={awayC} stopOpacity="0.75" />
                <stop offset="100%" stopColor={awayC} stopOpacity="0.4" />
              </linearGradient>

              {/* Light Glow */}
              <radialGradient id="lightGlow">
                <stop offset="0%" stopColor="#ffffaa" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#ffff66" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Main Field Background */}
            <rect
              x="50"
              y="100"
              width="700"
              height="400"
              fill="url(#fieldGrass)"
            />

            {/* Field Border */}
            <rect
              x="50"
              y="100"
              width="700"
              height="400"
              fill="none"
              stroke="#ffffff"
              strokeWidth="3"
              opacity="0.9"
            />

            {/* Distant endzone (top) */}
            <rect
              x="50"
              y="100"
              width="700"
              height="50"
              fill="url(#homeZone)"
            />

            {/* Left sideline banner */}
            <rect
              x="50"
              y="100"
              width="50"
              height="400"
              fill="url(#awaySide)"
            />

            {/* Yard Lines + 10x10 Grid */}
            <g opacity="0.65">
              {[...Array(9)].map((_, i) => (
                <line
                  key={`v-${i}`}
                  x1={120 + i * 70}
                  y1="100"
                  x2={120 + i * 70}
                  y2="500"
                  stroke="#ffffff"
                  strokeWidth="1.5"
                />
              ))}
              {[...Array(9)].map((_, i) => (
                <line
                  key={`h-${i}`}
                  x1="50"
                  y1={140 + i * 40}
                  x2="750"
                  y2={140 + i * 40}
                  stroke="#ffffff"
                  strokeWidth="1.5"
                />
              ))}
            </g>

            {/* Square Contents */}
            <g opacity="0.9">
              {[...Array(100)].map((_, i) => getSquareContent(i))}
            </g>

            {/* Goal Posts */}
            <g fill="#ffcc00" opacity="0.8">
              {/* Near Goal Post */}
              <rect x="395" y="470" width="10" height="42" />
              <rect x="350" y="470" width="100" height="4" />
              {/* Far Goal Post */}
              <rect x="398" y="95" width="4" height="15" />
              <rect x="385" y="95" width="30" height="2" />
            </g>

            {/* Overhead light glows */}
            <ellipse cx="150" cy="50" rx="100" ry="60" fill="url(#lightGlow)" />
            <ellipse cx="650" cy="50" rx="100" ry="60" fill="url(#lightGlow)" />
            <ellipse cx="400" cy="28" rx="120" ry="70" fill="url(#lightGlow)" />
          </svg>
        </div>
      </div>

      {/* Side stands with subtle activity */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Left stands */}
        <div className="absolute left-0 top-1/4 bottom-1/4 w-20 bg-gradient-to-r from-black/40 to-transparent">
          <div className="h-full flex flex-col justify-around p-3">
            {[...Array(7)].map((_, i) => (
              <div
                key={`l-${i}`}
                className="h-3 bg-white/25 rounded animate-pulse"
                style={{ animationDelay: `${i * 0.18}s` }}
              />
            ))}
          </div>
        </div>
        {/* Right stands */}
        <div className="absolute right-0 top-1/4 bottom-1/4 w-20 bg-gradient-to-l from-black/40 to-transparent">
          <div className="h-full flex flex-col justify-around p-3">
            {[...Array(7)].map((_, i) => (
              <div
                key={`r-${i}`}
                className="h-3 bg-white/25 rounded animate-pulse"
                style={{ animationDelay: `${i * 0.22}s` }}
              />
            ))}
          </div>
        </div>
        {/* Far rim lights */}
        <div className="absolute top-0 left-20 right-20 h-24 bg-gradient-to-b from-black/25 to-transparent">
          <div className="flex justify-around items-center h-full px-8">
            {[...Array(9)].map((_, i) => (
              <div
                key={`t-${i}`}
                className="w-8 h-8 bg-white/20 rounded-full animate-pulse"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 flex items-center justify-center min-h-[640px] py-20">
        <div className="text-center text-white px-4 max-w-5xl mx-auto">
          {title && (
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 drop-shadow-2xl">
              {title}
            </h1>
          )}
          {subtitle && (
            <p className="text-xl md:text-2xl lg:text-3xl opacity-95 drop-shadow-xl">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Readability overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-black/15 pointer-events-none" />
    </section>
  );
}
