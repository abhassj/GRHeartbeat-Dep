import { useRef } from 'react'
import { useInView } from 'motion/react'
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe'
import { cx } from '@/lib/cx'

/**
 * Infinite horizontal loop (CSS transform). The children are rendered twice; the copy is
 * hidden from assistive tech and focus. Pauses on hover, on keyboard focus and while
 * off-screen. `duration` is seconds per loop; `reverse` runs it left-to-right.
 * Under reduced motion it renders the items once as a static, wrapped row.
 */
export default function Marquee({
  duration = 40,
  reverse = false,
  gap = '3rem',
  label,
  className,
  children,
}) {
  const reduced = useReducedMotionSafe()
  const ref = useRef(null)
  const inView = useInView(ref, { amount: 0 })

  if (reduced) {
    return (
      <div
        role={label ? 'group' : undefined}
        aria-label={label}
        className={cx('flex flex-wrap items-center justify-center', className)}
        style={{ gap }}
      >
        {children}
      </div>
    )
  }

  const track = 'flex shrink-0 items-center'

  return (
    <div
      ref={ref}
      role={label ? 'group' : undefined}
      aria-label={label}
      className={cx(
        'group relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]',
        className,
      )}
    >
      <div
        className={cx(
          'flex w-max animate-marquee group-focus-within:[animation-play-state:paused] group-hover:[animation-play-state:paused]',
          reverse && '[animation-direction:reverse]',
          !inView && '[animation-play-state:paused]',
        )}
        style={{ '--marquee-duration': `${duration}s` }}
      >
        <div className={track} style={{ gap, paddingRight: gap }}>
          {children}
        </div>
        <div className={track} style={{ gap, paddingRight: gap }} aria-hidden inert>
          {children}
        </div>
      </div>
    </div>
  )
}
