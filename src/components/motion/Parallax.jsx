import { useRef } from 'react'
import { m, useScroll, useTransform } from 'motion/react'
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe'

/**
 * Moves its child from −offset% to +offset% of its own height as it scrolls past.
 * For images in a cropped frame, use ImageReveal's `parallax` instead (it pre-scales).
 */
export default function Parallax({ offset = 8, className, children }) {
  const reduced = useReducedMotionSafe()
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [`-${offset}%`, `${offset}%`])

  return (
    <m.div ref={ref} className={className} style={reduced ? undefined : { y }}>
      {children}
    </m.div>
  )
}
