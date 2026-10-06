import { useRef } from 'react'
import { m, useMotionValue, useSpring, useTransform } from 'motion/react'
import { useFinePointer } from '@/hooks/useMediaQuery'
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe'
import { cx } from '@/lib/cx'

const spring = { stiffness: 260, damping: 24, mass: 0.6 }

/**
 * Tilts up to `max` degrees towards the cursor with a soft glare. Mouse/trackpad only;
 * on touch or under reduced motion it renders its children unchanged.
 */
export default function TiltCard({ max = 4, glare = true, className, children }) {
  const reduced = useReducedMotionSafe()
  const finePointer = useFinePointer()
  const ref = useRef(null)
  const px = useMotionValue(0.5)
  const py = useMotionValue(0.5)
  const hover = useMotionValue(0)

  const rotateX = useSpring(useTransform(py, [0, 1], [max, -max]), spring)
  const rotateY = useSpring(useTransform(px, [0, 1], [-max, max]), spring)
  const glareX = useTransform(px, [0, 1], ['-25%', '25%'])
  const glareY = useTransform(py, [0, 1], ['-25%', '25%'])
  const glareOpacity = useSpring(hover, spring)

  if (reduced || !finePointer) return <div className={className}>{children}</div>

  const onPointerMove = (event) => {
    const box = ref.current.getBoundingClientRect()
    px.set((event.clientX - box.left) / box.width)
    py.set((event.clientY - box.top) / box.height)
    hover.set(1)
  }
  const onPointerLeave = () => {
    px.set(0.5)
    py.set(0.5)
    hover.set(0)
  }

  return (
    <m.div
      ref={ref}
      className={cx('relative', className)}
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      {children}
      {glare && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]"
        >
          <m.span
            className="absolute -inset-1/2 bg-[radial-gradient(circle_at_center,rgb(255_255_255/0.55),transparent_45%)] mix-blend-soft-light"
            style={{ x: glareX, y: glareY, opacity: glareOpacity }}
          />
        </span>
      )}
    </m.div>
  )
}
