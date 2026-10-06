import { AnimatePresence, m } from 'motion/react'
import MotionPauseButton from '@/components/motion/MotionPauseButton'
import { useNeedsFloatingControl } from '@/hooks/useLoops'
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe'
import { transition } from '@/lib/motion'

/**
 * Bottom-left pause control that appears whenever a decorative loop is on screen but no
 * inline pause control is (e.g. the final CTA band's glow), so pausing is always reachable.
 */
export default function FloatingMotionControl() {
  const reduced = useReducedMotionSafe()
  const needed = useNeedsFloatingControl()

  return (
    <AnimatePresence>
      {needed && !reduced && (
        <m.div
          key="motion-control"
          className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] left-4 z-30 sm:bottom-6 sm:left-6"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={transition.fast}
        >
          <MotionPauseButton variant="floating" register={false} />
        </m.div>
      )}
    </AnimatePresence>
  )
}
