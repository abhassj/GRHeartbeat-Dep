import { cx } from '@/lib/cx'

/** Small uppercase label above a heading. `marker` adds a tiny ECG tick before it. */
export default function Eyebrow({ as: Tag = 'p', marker = false, className, children, ...props }) {
  return (
    <Tag
      className={cx(
        'inline-flex items-center gap-2.5 font-display text-eyebrow font-bold text-(--eyebrow-color,var(--color-navy)) uppercase',
        className,
      )}
      {...props}
    >
      {marker && (
        <svg
          aria-hidden
          viewBox="0 0 22 12"
          className="h-3 w-5.5 shrink-0 text-(--accent-color,var(--color-pulse-red))"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M1 6.5h5l2-3 3 7 3-9.5 2 5.5h5" />
        </svg>
      )}
      {children}
    </Tag>
  )
}
