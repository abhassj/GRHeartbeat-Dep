import { useRef } from 'react'
import { Pause, Play } from 'lucide-react'
import { motionControl } from '@/data/navigation'
import { useRegisterPauseControl } from '@/hooks/useLoops'
import { useMotionPreference } from '@/hooks/useReducedMotionSafe'
import { cx } from '@/lib/cx'

/**
 * Pauses / resumes the background video and every decorative loop on the site (WCAG 2.2.2).
 * `overlay`: a round icon button over media. `floating`: a labelled pill (see
 * FloatingMotionControl). Inline instances register so the floating one stays hidden while
 * they are on screen.
 */
export default function MotionPauseButton({ variant = 'overlay', register = true, className }) {
  const ref = useRef(null)
  const { paused, setPaused } = useMotionPreference()
  useRegisterPauseControl(ref, register)
  const Icon = paused ? Play : Pause
  const label = paused ? motionControl.play : motionControl.pause

  return (
    <button
      ref={ref}
      type="button"
      onClick={() => setPaused(!paused)}
      aria-label={variant === 'overlay' ? label : undefined}
      className={cx(
        'inline-flex items-center justify-center rounded-full text-ink shadow-card-hover transition-colors duration-200 hover:bg-white',
        variant === 'overlay'
          ? 'size-11 bg-white/90 backdrop-blur-sm'
          : 'h-11 gap-2 border border-line bg-white/95 px-4 text-sm font-semibold backdrop-blur-sm',
        className,
      )}
    >
      <Icon aria-hidden size={18} fill="currentColor" />
      {variant === 'floating' && label}
    </button>
  )
}
