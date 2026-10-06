import { useRef } from 'react'
import { m, useInView, useScroll, useTransform } from 'motion/react'
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe'
import { cx } from '@/lib/cx'
import { revealMargin, transition } from '@/lib/motion'

/**
 * Photo that wipes open top-to-bottom (clip-path) while the image settles from 1.15× to 1×.
 * `parallax` also drifts the image ±8% with scroll (it is pre-scaled so edges never show).
 * The frame is sized by className (e.g. aspect-4/5 or h-full); the image covers it.
 */
export default function ImageReveal({
  src,
  alt,
  parallax = false,
  className,
  imgClassName,
  rounded = 'rounded-card',
  ...imgProps
}) {
  const reduced = useReducedMotionSafe()
  const frame = useRef(null)
  const inView = useInView(frame, { once: true, amount: 0.3, margin: revealMargin })
  const { scrollYProgress } = useScroll({ target: frame, offset: ['start end', 'end start'] })
  const drift = useTransform(scrollYProgress, [0, 1], ['-8%', '8%'])

  const image = (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      className={cx('size-full object-cover', imgClassName)}
      {...imgProps}
    />
  )

  // The observed frame is never clipped itself: IntersectionObserver ignores elements
  // hidden by their own clip-path, so the wipe runs on an inner layer.
  return (
    <div ref={frame} className={cx('relative overflow-hidden', rounded, className)}>
      {reduced ? (
        image
      ) : (
        <m.div
          className="size-full"
          initial={{ clipPath: 'inset(0% 0% 100% 0%)' }}
          animate={inView ? { clipPath: 'inset(0% 0% 0% 0%)' } : undefined}
          transition={transition.slow}
        >
          <m.div className="size-full" style={parallax ? { y: drift, scale: 1.18 } : undefined}>
            <m.div
              className="size-full"
              initial={{ scale: 1.15 }}
              animate={inView ? { scale: 1 } : undefined}
              transition={{ ...transition.slow, duration: transition.slow.duration * 1.4 }}
            >
              {image}
            </m.div>
          </m.div>
        </m.div>
      )}
    </div>
  )
}
