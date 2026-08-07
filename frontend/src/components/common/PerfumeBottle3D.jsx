import { motion } from 'framer-motion'

/**
 * A fully self-authored "3D" perfume bottle built from layered SVG
 * gradients (glass, liquid, facets, cap) plus a slow CSS/Framer float +
 * rotation to sell depth. No photography or stock assets involved, so it
 * scales to any brand color via the theme.css variables and works for
 * every product regardless of whether a real product photo exists yet.
 *
 * Props:
 *  - label: short mark shown on the bottle (defaults to "L")
 *  - liquidLevel: 0–1, how full the bottle reads (default 0.62)
 *  - floating: enable the idle float/rotate loop (default true)
 *  - className: sizing wrapper classes, e.g. "w-64 h-64"
 */
export default function PerfumeBottle3D({
  label = 'L',
  liquidLevel = 0.62,
  floating = true,
  className = 'w-56 h-56',
}) {
  const liquidTop = 96 + (1 - liquidLevel) * 130

  return (
    <motion.div
      className={`relative ${className}`}
      style={{ transformStyle: 'preserve-3d' }}
      animate={
        floating
          ? { y: [0, -14, 0], rotateZ: [-2, 2, -2] }
          : undefined
      }
      transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
    >
      {/* soft contact shadow, grounds the bottle */}
      <motion.div
        className="absolute left-1/2 bottom-0 -translate-x-1/2 rounded-full blur-xl"
        style={{ width: '55%', height: '10%', background: 'rgb(var(--shadow-color) / 0.55)' }}
        animate={floating ? { scaleX: [1, 0.85, 1], opacity: [0.5, 0.35, 0.5] } : undefined}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
      />

      <svg
        viewBox="0 0 220 320"
        className="relative w-full h-full drop-shadow-[0_25px_45px_rgba(0,0,0,0.55)]"
        style={{ transform: 'rotateY(-8deg) rotateX(3deg)', transformStyle: 'preserve-3d' }}
      >
        <defs>
          <linearGradient id="glass" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgb(var(--color-glass))" stopOpacity="0.05" />
            <stop offset="18%" stopColor="rgb(var(--color-glass))" stopOpacity="0.35" />
            <stop offset="42%" stopColor="rgb(var(--color-glass))" stopOpacity="0.08" />
            <stop offset="60%" stopColor="rgb(var(--color-gold-light))" stopOpacity="0.18" />
            <stop offset="100%" stopColor="rgb(var(--color-glass))" stopOpacity="0.04" />
          </linearGradient>

          <linearGradient id="liquid" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgb(var(--liquid-top))" stopOpacity="0.9" />
            <stop offset="100%" stopColor="rgb(var(--liquid-bottom))" stopOpacity="0.95" />
          </linearGradient>

          <linearGradient id="cap" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="rgb(var(--color-gold-light))" />
            <stop offset="50%" stopColor="rgb(var(--color-gold))" />
            <stop offset="100%" stopColor="rgb(var(--color-gold-dark))" />
          </linearGradient>

          <radialGradient id="glow" cx="50%" cy="45%" r="60%">
            <stop offset="0%" stopColor="rgb(var(--color-gold-light))" stopOpacity="0.35" />
            <stop offset="100%" stopColor="rgb(var(--color-gold-light))" stopOpacity="0" />
          </radialGradient>

          <clipPath id="bottleClip">
            <rect x="46" y="96" width="128" height="200" rx="14" />
          </clipPath>
        </defs>

        {/* ambient glow behind bottle */}
        <circle cx="110" cy="170" r="130" fill="url(#glow)" />

        {/* cap */}
        <rect x="88" y="18" width="44" height="34" rx="6" fill="url(#cap)" stroke="rgb(var(--color-gold-dark))" strokeWidth="1" />
        <rect x="94" y="8" width="32" height="16" rx="4" fill="rgb(var(--color-gold-dark))" />

        {/* neck */}
        <rect x="98" y="52" width="24" height="30" fill="url(#glass)" stroke="rgb(var(--color-gold) / 0.4)" strokeWidth="1" />

        {/* bottle body */}
        <rect x="46" y="86" width="128" height="210" rx="16" fill="rgb(var(--color-panel) / 0.4)" stroke="rgb(var(--color-gold) / 0.5)" strokeWidth="1.5" />

        {/* liquid fill, clipped to body */}
        <g clipPath="url(#bottleClip)">
          <motion.rect
            x="46"
            width="128"
            height="320"
            fill="url(#liquid)"
            animate={{ y: [liquidTop, liquidTop - 3, liquidTop] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          />
          {/* faux liquid surface shimmer */}
          <motion.rect
            x="46"
            width="128"
            height="6"
            fill="rgb(var(--color-gold-light))"
            opacity="0.35"
            animate={{ y: [liquidTop, liquidTop - 3, liquidTop] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          />
        </g>

        {/* glass overlay + facets on top of liquid for depth */}
        <rect x="46" y="86" width="128" height="210" rx="16" fill="url(#glass)" />
        <rect x="56" y="100" width="10" height="180" rx="5" fill="rgb(var(--color-glass))" opacity="0.18" />

        {/* label plate */}
        <rect x="70" y="170" width="80" height="56" rx="4" fill="rgb(var(--color-ink) / 0.55)" stroke="rgb(var(--color-gold) / 0.6)" strokeWidth="1" />
        <text
          x="110"
          y="206"
          textAnchor="middle"
          fontSize="30"
          fontFamily="'Cormorant Garamond', serif"
          fill="rgb(var(--color-gold-light))"
        >
          {label}
        </text>

        {/* outer highlight sweep */}
        <rect x="46" y="86" width="128" height="210" rx="16" fill="none" stroke="rgb(var(--color-glass))" strokeOpacity="0.25" strokeWidth="1" />
      </svg>
    </motion.div>
  )
}
