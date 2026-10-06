import { motion, useScroll, useSpring, useTransform } from 'motion/react'
import { cx } from '@/lib/cx'

/**
 * 2px Pulse Red line that fills with page scroll, with a small ECG blip riding its
 * leading edge. It only ever follows the user's own scrolling, so it stays on under
 * reduced motion.
 */
export default function ScrollProgress({ className }) {
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 220, damping: 32, restDelta: 0.001 })
  const blipX = useTransform(progress, (v) => `calc(${v * 100}vw - 100%)`)
  const blipOpacity = useTransform(progress, [0, 0.01, 0.99, 1], [0, 1, 1, 0])

  return (
    <div
      aria-hidden
      className={cx('pointer-events-none fixed inset-x-0 z-[60] h-0.5', className)}
      style={{ top: 'var(--banner-h)' }}
    >
      <motion.div className="h-full origin-left bg-pulse-red" style={{ scaleX: progress }} />
      <motion.svg
        viewBox="0 0 20 12"
        className="absolute top-0 left-0 h-3 w-5 -translate-y-[45%] text-pulse-red"
        style={{ x: blipX, opacity: blipOpacity }}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M0 6h6l2-4.5 3 9 2.5-6 1.5 1.5H20" />
      </motion.svg>
    </div>
  )
}
