import { cx } from '@/lib/cx'

const sizes = {
  sm: { box: 'size-10', icon: 18, text: 'text-sm' },
  md: { box: 'size-14', icon: 24, text: 'text-lg' },
  lg: { box: 'size-18', icon: 30, text: 'text-2xl' },
}

const colours = {
  navy: 'text-navy',
  red: 'text-pulse-red',
  ink: 'text-ink',
}

/**
 * Icon (or a short label like a step number) inside a 2px chrome-gradient ring.
 * Decorative by default; pass `label` when the icon carries meaning.
 */
export default function IconRing({
  icon: Icon,
  size = 'md',
  colour = 'navy',
  label,
  className,
  children,
}) {
  const s = sizes[size]
  return (
    <span
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={cx(
        'inline-flex shrink-0 rounded-full bg-chrome p-0.5 shadow-card',
        s.box,
        className,
      )}
    >
      <span
        className={cx(
          'flex size-full items-center justify-center rounded-full bg-white font-display font-extrabold',
          colours[colour],
          s.text,
        )}
      >
        {Icon ? <Icon size={s.icon} strokeWidth={1.75} /> : children}
      </span>
    </span>
  )
}
