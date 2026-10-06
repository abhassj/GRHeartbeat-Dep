import { useLayoutEffect, useRef, useState } from 'react'
import { AnimatePresence, m, useMotionValueEvent, useScroll } from 'motion/react'
import { useLoopGate } from '@/hooks/useLoops'
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe'
import { syncToHeartbeat } from '@/lib/heartbeat'
import { transition } from '@/lib/motion'

/**
 * Small "scroll" cue at the foot of the hero: a mouse outline with an ECG blip that flashes
 * once per shared heartbeat. Disappears after the first scroll. Decorative (aria-hidden).
 */
export default function ScrollCue({ label }) {
  const reduced = useReducedMotionSafe()
  const ref = useRef(null)
  const { scrollY } = useScroll()
  const [scrolled, setScrolled] = useState(false)
  const blip = useRef(null)
  useMotionValueEvent(scrollY, 'change', (y) => y > 8 && setScrolled(true))
  const turn = useLoopGate(ref, { group: 'hero', active: !reduced && !scrolled })
  // Re-align to the shared heartbeat clock whenever the blip (re)starts.
  useLayoutEffect(() => {
    if (turn) syncToHeartbeat(blip.current)
  }, [turn])

  return (
    <AnimatePresence>
      {!scrolled && (
        <m.div
          ref={ref}
          aria-hidden
          className="pointer-events-none absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-xs font-semibold tracking-[0.12em] text-grey-600 uppercase lg:flex"
          exit={{ opacity: 0, y: 6 }}
          transition={transition.fast}
        >
          <svg viewBox="0 0 24 36" className="h-9 w-6" fill="none">
            <rect
              x="1"
              y="1"
              width="22"
              height="34"
              rx="11"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <path
              d="M5 18h4l1.5-3 2 6 1.5-3h5"
              stroke="var(--color-pulse-red)"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={turn ? 'origin-center animate-cue-beat' : undefined}
              ref={blip}
              style={{ transformBox: 'fill-box' }}
            />
          </svg>
          {label}
        </m.div>
      )}
    </AnimatePresence>
  )
}
