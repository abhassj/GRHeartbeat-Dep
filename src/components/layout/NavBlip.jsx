import { useEffect, useState } from 'react'
import { m } from 'motion/react'
import { useLayoutReady, useReducedMotionSafe } from '@/hooks/useReducedMotionSafe'
import { ease, transition } from '@/lib/motion'

const D = 'M1 6h8l2-3 3 6 3-8 2 5h9'
const DRAW_S = 0.45
const NONE = Symbol('none')

/**
 * The navbar's active/hover indicator: a tiny ECG blip that draws in under a link.
 * One instance per nav, moved between links with a shared layoutId.
 */
export default function NavBlip({ drawKey }) {
  const reduced = useReducedMotionSafe()
  // The blip remounts once when layout animation arrives (so it can slide). If the draw-in
  // under the current link has already finished by then, it is not replayed.
  const layoutReady = useLayoutReady()
  const [drawnKey, setDrawnKey] = useState(NONE)
  useEffect(() => {
    const timer = setTimeout(() => setDrawnKey(drawKey), DRAW_S * 1000)
    return () => clearTimeout(timer)
  }, [drawKey])
  const skipDraw = drawKey === drawnKey

  return (
    <m.span
      key={String(layoutReady)}
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
          <m.path
            key={drawKey}
            d={D}
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={skipDraw ? false : { pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: DRAW_S, ease: ease.out }}
          />
        )}
      </svg>
    </m.span>
  )
}
