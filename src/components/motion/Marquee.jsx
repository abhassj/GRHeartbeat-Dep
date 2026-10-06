import { useRef } from 'react'
import { useLoopGate } from '@/hooks/useLoops'
import { useMotionPaused, useReducedMotionSafe } from '@/hooks/useReducedMotionSafe'
import { cx } from '@/lib/cx'

/**
 * Infinite horizontal loop (CSS transform). The children are rendered twice; the copy is
 * hidden from assistive tech and focus. Pauses on hover, on keyboard focus and while
 * off-screen. `duration` is seconds per loop; `reverse` runs it left-to-right.
 * Under reduced motion it renders the items once as a static, wrapped row. It registers as a
 * decorative loop (so a pause control is reachable) and holds still while motion is paused.
 */
export default function Marquee({
  duration = 40,
  reverse = false,
  gap = '3rem',
  label,
  loopGroup,
  className,
  children,
}) {
  const reduced = useReducedMotionSafe()
  const paused = useMotionPaused()
  const ref = useRef(null)
  // A decorative loop: it moves only while the loop arbiter gives it the turn.
  const turn = useLoopGate(ref, { group: loopGroup, active: !reduced })

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
      data-loop="marquee"
      data-running={String(turn && !paused)}
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
          !turn && '[animation-play-state:paused]',
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
