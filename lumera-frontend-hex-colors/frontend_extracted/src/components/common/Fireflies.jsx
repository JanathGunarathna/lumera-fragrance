import { motion } from 'framer-motion'
import { useMemo } from 'react'

/**
 * Renders a handful of small glowing gold particles that drift and pulse
 * within their container. Purely decorative — pair with a `relative`
 * positioned parent and give this component `absolute inset-0`.
 *
 * count: how many particles
 */
export default function Fireflies({ count = 14, className = '' }) {
  const particles = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: 2 + Math.random() * 3,
        duration: 6 + Math.random() * 6,
        delay: Math.random() * 6,
        drift: 20 + Math.random() * 40,
      })),
    [count]
  )

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`} aria-hidden="true">
      {particles.map((p) => (
        <motion.span
          key={p.id}
          className="absolute rounded-full bg-gold"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: p.size,
            height: p.size,
            boxShadow: '0 0 6px 2px rgba(198,161,91,0.55)',
          }}
          initial={{ opacity: 0, y: 0 }}
          animate={{
            opacity: [0, 0.9, 0],
            y: [0, -p.drift, -p.drift * 2],
            x: [0, p.drift / 3, -p.drift / 3],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}
