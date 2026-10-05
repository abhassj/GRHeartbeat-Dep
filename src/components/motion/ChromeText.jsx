import { useRef } from 'react'
import { motion, useInView } from 'motion/react'
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe'
import { cx } from '@/lib/cx'
import { ease, revealMargin } from '@/lib/motion'

const sheen =
  'linear-gradient(105deg, transparent 38%, rgb(255 255 255 / 0.95) 50%, transparent 62%)'

/**
 * Text filled with the chrome gradient. When it first scrolls into view a light sheen
 * sweeps across it once. Keep it ≥ 32px and bold (see the colour doc's fallback note).
 */
export default function ChromeText({ as: Tag = 'span', className, children }) {
  const reduced = useReducedMotionSafe()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.6, margin: revealMargin })

  return (
    <Tag ref={ref} className={cx('relative inline-block', className)}>
      <span className="text-chrome">{children}</span>
      {!reduced && (
        // The sheen moves its background-position: a one-off, paint-only sweep on a few
        // glyphs. A text-clipped gradient cannot be moved with transform.
        <motion.span
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-clip-text text-transparent forced-colors:hidden"
          style={{ backgroundImage: sheen, backgroundSize: '250% 100%' }}
          initial={{ backgroundPosition: '100% 0%', opacity: 1 }}
          animate={inView ? { backgroundPosition: '-50% 0%', opacity: [1, 1, 0] } : undefined}
          transition={{ duration: 1.4, ease: ease.inOut, delay: 0.2 }}
        >
          {children}
        </motion.span>
      )}
    </Tag>
  )
}
