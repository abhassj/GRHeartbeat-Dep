import { useRef, useState } from 'react'
import { motion, useSpring } from 'motion/react'
import Button from '@/components/ui/Button'
import { useRegisterLoop } from '@/hooks/useLoops'
import { useFinePointer } from '@/hooks/useMediaQuery'
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe'
import { cssCycleDelay } from '@/lib/heartbeat'

const MAX_PULL = 6
const spring = { stiffness: 300, damping: 20, mass: 0.5 }

/**
 * The primary CTA with the lub-dub glow (two beats on the shared 5 s heartbeat clock, so it
 * beats together with any synced PulseLine) and a magnetic hover that pulls it up to 6px
 * towards the cursor. Use only in the hero and the final CTA band. Takes every Button prop.
 * The glow and pull switch off under reduced motion; the glow holds still while paused.
 */
export default function HeartbeatButton({ variant = 'primary', size = 'lg', style, ...props }) {
  const reduced = useReducedMotionSafe()
  const finePointer = useFinePointer()
  const ref = useRef(null)
  const x = useSpring(0, spring)
  const y = useSpring(0, spring)
  const [beatDelay] = useState(cssCycleDelay)
  const magnetic = finePointer && !reduced
  useRegisterLoop(ref, !reduced)

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
    <motion.span
      ref={ref}
      className="inline-flex"
      style={magnetic ? { x, y } : undefined}
      onPointerMove={magnetic ? onPointerMove : undefined}
      onPointerLeave={magnetic ? onPointerLeave : undefined}
    >
      <Button
        variant={variant}
        size={size}
        pulse
        style={{ '--beat-delay': beatDelay, ...style }}
        {...props}
      />
    </motion.span>
  )
}
