import { motion } from 'motion/react'
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe'
import { stagger, variants, viewport } from '@/lib/motion'

/**
 * Reveals its RevealItem children one after another (0.08s apart) when in view.
 * Use for card grids, lists and stat rows: <RevealStagger as="ul"><RevealItem as="li">…
 */
export default function RevealStagger({
  as = 'div',
  delay = 0,
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

  const MotionTag = motion[as]
  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ ...viewport, amount }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: stagger, delayChildren: delay } },
      }}
      {...props}
    >
      {children}
    </MotionTag>
  )
}

export function RevealItem({ as = 'div', className, children, ...props }) {
  const reduced = useReducedMotionSafe()

  if (reduced) {
    const Tag = as
    return (
      <Tag className={className} {...props}>
        {children}
      </Tag>
    )
  }

  const MotionTag = motion[as]
  return (
    <MotionTag className={className} variants={variants.fadeUp} {...props}>
      {children}
    </MotionTag>
  )
}
