import { useLayoutEffect, useRef } from 'react'
import { m, useSpring } from 'motion/react'
import Button from '@/components/ui/Button'
import { useLoopGate } from '@/hooks/useLoops'
import { useFinePointer } from '@/hooks/useMediaQuery'
import { useMotionPaused, useReducedMotionSafe } from '@/hooks/useReducedMotionSafe'
import { syncToHeartbeat } from '@/lib/heartbeat'

const MAX_PULL = 6
const spring = { stiffness: 300, damping: 20, mass: 0.5 }

/**
 * The primary CTA with the lub-dub glow (two beats on the shared 5 s heartbeat clock, so it
 * beats together with any synced PulseLine) and a magnetic hover that pulls it up to 6px
 * towards the cursor. Use only in the hero and the final CTA band. Takes every Button prop.
 * The glow and pull switch off under reduced motion; the glow holds still while paused.
 */
export default function HeartbeatButton({ variant = 'primary', size = 'lg', loopGroup, ...props }) {
  const reduced = useReducedMotionSafe()
  const paused = useMotionPaused()
  const finePointer = useFinePointer()
  const ref = useRef(null)
  const x = useSpring(0, spring)
  const y = useSpring(0, spring)
  const magnetic = finePointer && !reduced
  // The glow is a decorative loop: it runs only when the loop arbiter gives it the turn, and
  // re-aligns to the shared heartbeat clock every time it starts.
  const glowing = useLoopGate(ref, { group: loopGroup, active: !reduced })
  useLayoutEffect(() => {
    if (glowing) syncToHeartbeat(ref.current)
  }, [glowing])

  const onPointerMove = (event) => {
    const box = ref.current.getBoundingClientRect()
    const dx = event.clientX - (box.left + box.width / 2)
    const dy = event.clientY - (box.top + box.height / 2)
    const pull = (d, half) => Math.max(-MAX_PULL, Math.min(MAX_PULL, (d / half) * MAX_PULL))
    x.set(pull(dx, box.width / 2))
    y.set(pull(dy, box.height / 2))
  }
  const onPointerLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <m.span
      ref={ref}
      data-loop={reduced ? undefined : (loopGroup ?? 'glow')}
      data-running={reduced ? undefined : String(glowing && !paused)}
      className="inline-flex"
      style={magnetic ? { x, y } : undefined}
      onPointerMove={magnetic ? onPointerMove : undefined}
      onPointerLeave={magnetic ? onPointerLeave : undefined}
    >
      <Button variant={variant} size={size} pulse={glowing} {...props} />
    </m.span>
  )
}
