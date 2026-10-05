import { Link } from 'react-router'
import { cx } from '@/lib/cx'

const base =
  'group inline-flex shrink-0 items-center justify-center gap-2 rounded-full font-body font-semibold whitespace-nowrap select-none transition-[background-color,color,border-color,box-shadow] duration-200 ease-out disabled:pointer-events-none aria-disabled:pointer-events-none'

const variants = {
  primary:
    'bg-pulse-red text-white hover:bg-red-600 active:bg-crimson disabled:bg-grey-200 disabled:text-grey-600',
  secondary:
    'border-[1.5px] border-navy bg-white text-navy hover:bg-navy hover:text-white active:bg-ink active:border-ink disabled:border-grey-300 disabled:text-grey-500',
  ghost:
    'px-1! text-pulse-red underline-offset-4 hover:text-crimson hover:underline disabled:text-grey-500',
  white:
    'bg-white text-pulse-red [--pulse-glow:var(--color-white)] hover:bg-red-50 active:bg-red-100 disabled:bg-white/60 disabled:text-crimson',
}

const sizes = {
  sm: 'h-9 px-4 text-sm',
  md: 'h-11 px-6 text-[0.9375rem]',
  lg: 'h-14 px-8 text-base',
}

const iconSizes = { sm: 16, md: 18, lg: 20 }

/**
 * Pill button. Renders a router <Link> when given `to`, an <a> when given `href`,
 * otherwise a <button>. `icon` (a lucide component) sits after the label and nudges
 * right on hover; use `iconStart` for a leading icon.
 */
export default function Button({
  variant = 'primary',
  size = 'md',
  to,
  href,
  icon: Icon,
  iconStart: IconStart,
  pulse = false,
  className,
  children,
  ...props
}) {
  const classes = cx(base, variants[variant], sizes[size], pulse && 'btn-pulse', className)
  const iconSize = iconSizes[size]
  const content = (
    <>
      {IconStart && <IconStart aria-hidden size={iconSize} className="shrink-0" />}
      {children}
      {Icon && (
        <Icon
          aria-hidden
          size={iconSize}
          className="shrink-0 transition-transform duration-200 ease-out group-hover:translate-x-0.5"
        />
      )}
    </>
  )

  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {content}
      </Link>
    )
  }
  if (href) {
    return (
      <a href={href} className={classes} {...props}>
        {content}
      </a>
    )
  }
  return (
    <button type="button" className={classes} {...props}>
      {content}
    </button>
  )
}
