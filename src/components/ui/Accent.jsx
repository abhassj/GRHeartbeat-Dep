import { cx } from '@/lib/cx'

/**
 * The one highlighted phrase in a headline: Pulse Red (white on red bands), set in
 * Montserrat 800 italic like the logo's HEARTBEAT. `italic={false}` keeps it upright.
 */
export default function Accent({ italic = true, className, children }) {
  return (
    <span
      className={cx(
        'text-(--accent-color,var(--color-pulse-red))',
        italic && 'pr-[0.06em] italic',
        className,
      )}
    >
      {children}
    </span>
  )
}
