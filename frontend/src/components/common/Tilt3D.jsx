import { useRef, useState } from 'react'

/**
 * Wraps any block of content in a mouse-tracked 3D tilt with an optional
 * sheen/glare sweep. Pure CSS transforms — no dependency, works with any
 * children (cards, the hero bottle, images).
 *
 * Props:
 *  - max: max rotation in degrees (default 10)
 *  - scale: hover scale (default 1.02)
 *  - glare: show a moving light sheen layer (default true)
 *  - className: applied to the outer (perspective) wrapper
 */
export default function Tilt3D({
  children,
  max = 10,
  scale = 1.02,
  glare = true,
  className = '',
}) {
  const ref = useRef(null)
  const [style, setStyle] = useState({})
  const [glareStyle, setGlareStyle] = useState({ opacity: 0 })

  const handleMove = (e) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width
    const py = (e.clientY - rect.top) / rect.height
    const rotateY = (px - 0.5) * max * 2
    const rotateX = (0.5 - py) * max * 2

    setStyle({
      transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${scale}, ${scale}, ${scale})`,
    })

    if (glare) {
      setGlareStyle({
        opacity: 0.16,
        background: `radial-gradient(circle at ${px * 100}% ${py * 100}%, rgb(var(--color-glass)) 0%, transparent 55%)`,
      })
    }
  }

  const handleLeave = () => {
    setStyle({ transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)' })
    setGlareStyle({ opacity: 0 })
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={`relative [transform-style:preserve-3d] transition-transform duration-300 ease-out will-change-transform ${className}`}
      style={style}
    >
      {children}
      {glare && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 transition-opacity duration-300 mix-blend-overlay"
          style={glareStyle}
        />
      )}
    </div>
  )
}
