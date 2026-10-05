import { useEffect, useMemo, useRef } from 'react'
import { animate, motion, useInView, useMotionValue, useTransform } from 'motion/react'
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe'
import { ease, revealMargin } from '@/lib/motion'

/**
 * Counts from 0 to `value` over 1.6s when 40% in view. Screen readers always get the
 * final value; the animated digits are hidden from them. Reduced motion shows the final value.
 */
export default function CountUp({
  value,
  prefix = '',
  suffix = '',
  duration = 1.6,
  locale = 'en-GB',
  className,
}) {
  const reduced = useReducedMotionSafe()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.4, margin: revealMargin })
  const format = useMemo(() => new Intl.NumberFormat(locale), [locale])
  const count = useMotionValue(0)
  const display = useTransform(count, (v) => `${prefix}${format.format(Math.round(v))}${suffix}`)
  const finalText = `${prefix}${format.format(value)}${suffix}`

  useEffect(() => {
    if (reduced || !inView) return
    const controls = animate(count, value, { duration, ease: ease.out })
    return () => controls.stop()
  }, [reduced, inView, count, value, duration])

  return (
    <span ref={ref} className={className}>
      <span className="sr-only">{finalText}</span>
      {reduced ? (
        <span aria-hidden>{finalText}</span>
      ) : (
        <motion.span aria-hidden className="tabular-nums">
          {display}
        </motion.span>
      )}
    </span>
  )
}
