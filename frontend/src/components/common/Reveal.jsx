import { motion } from 'framer-motion'

/**
 * Wraps any block of content and fades/rises it into view the first time
 * it scrolls into the viewport. Centralizing this means every page shares
 * the same easing/duration instead of ad-hoc animations per component.
 *
 * Props:
 *  - direction: 'up' | 'down' | 'left' | 'right' | 'none' (default 'up')
 *  - delay: seconds before the animation starts (for staggering siblings)
 *  - duration: seconds the animation takes
 *  - as: element type to render as (defaults to 'div')
 */
export default function Reveal({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.7,
  className = '',
  as = 'div',
  ...rest
}) {
  const offset = 28
  const initial = {
    opacity: 0,
    y: direction === 'up' ? offset : direction === 'down' ? -offset : 0,
    x: direction === 'left' ? offset : direction === 'right' ? -offset : 0,
  }

  const MotionTag = motion[as] || motion.div

  return (
    <MotionTag
      className={className}
      initial={initial}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
      {...rest}
    >
      {children}
    </MotionTag>
  )
}

/**
 * Stagger — a plain grid/flex container for a list of <Reveal> children.
 * It doesn't animate itself; give each child Reveal an increasing
 * `delay={i * 0.08}` (see Home.jsx for the pattern) so they cascade in
 * rather than all popping at once. Kept as its own component mainly for
 * readability at the call site: <Stagger className="grid ..."> vs a bare div.
 */
export function Stagger({ children, className = '', ...rest }) {
  return (
    <div className={className} {...rest}>
      {children}
    </div>
  )
}
