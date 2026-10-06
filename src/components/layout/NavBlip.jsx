import { motion } from 'motion/react'
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe'
import { ease, transition } from '@/lib/motion'

const D = 'M1 6h8l2-3 3 6 3-8 2 5h9'

/**
 * The navbar's active/hover indicator: a tiny ECG blip that draws in under a link.
 * One instance per nav, moved between links with a shared layoutId.
 */
export default function NavBlip({ drawKey }) {
  const reduced = useReducedMotionSafe()
  return (
    <motion.span
      layoutId="nav-blip"
      aria-hidden
      className="pointer-events-none absolute inset-x-0 -bottom-1 mx-auto block h-3 w-7 text-pulse-red"
      transition={transition.morph}
    >
      <svg viewBox="0 0 28 12" className="size-full overflow-visible" fill="none">
        {reduced ? (
          <path
            d={D}
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ) : (
          <motion.path
            key={drawKey}
            d={D}
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.45, ease: ease.out }}
          />
        )}
      </svg>
    </motion.span>
  )
}
