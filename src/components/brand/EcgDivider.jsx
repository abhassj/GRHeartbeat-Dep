import PulseLine from '@/components/brand/PulseLine'
import { cx } from '@/lib/cx'

/**
 * Thin full-width ECG trace between major sections. Draws once when scrolled into view,
 * sends a single blip along, then rests. Hairlines fade it into the page at both ends.
 */
export default function EcgDivider({
  color = 'var(--color-pulse-red)',
  shape = 'spike',
  position = 0.5,
  className,
}) {
  return (
    <div
      aria-hidden
      className={cx(
        'mx-auto w-full max-w-content [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)] px-5 sm:px-8',
        className,
      )}
    >
      <PulseLine
        className="h-12 w-full"
        shape={shape}
        beats={[position]}
        color={color}
        strokeWidth={1.75}
        draw="view"
        drawDuration={1.8}
        loop={false}
      />
    </div>
  )
}
