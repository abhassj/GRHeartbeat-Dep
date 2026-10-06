import { m } from 'motion/react'
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe'
import { distance, transition, viewport } from '@/lib/motion'

/**
 * Fades its content in with a 24px rise once 20% of it is on screen.
 * Under reduced motion it renders a plain element: visible and static.
 */
export default function Reveal({
  as = 'div',
  delay = 0,
  y = distance.rise,
  amount = viewport.amount,
  className,
  children,
  ...props
}) {
  const reduced = useReducedMotionSafe()

  if (reduced) {
    const Tag = as
    return (
      <Tag className={className} {...props}>
        {children}
      </Tag>
    )
  }

  const MotionTag = m[as]
  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ ...viewport, amount }}
      transition={{ ...transition.base, delay }}
      {...props}
    >
      {children}
    </MotionTag>
  )
}
