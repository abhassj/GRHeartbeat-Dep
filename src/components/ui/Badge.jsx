import { cx } from '@/lib/cx'

const tones = {
  red: 'bg-red-tint text-crimson',
  amber: 'bg-amber-50 text-amber',
  navy: 'bg-grey-50 text-navy',
  success: 'bg-success/8 text-success',
}

const dots = {
  red: 'bg-pulse-red',
  amber: 'bg-amber',
  navy: 'bg-navy',
  success: 'bg-success',
}

const shape = 'inline-flex items-center gap-1.5 rounded-full text-xs font-semibold tracking-wide'

/**
 * Small pill label. Tones: red (category / NQF), amber (coming soon), navy (meta),
 * success (accredited), chrome (accreditation badge: white with a chrome hairline ring).
 */
export default function Badge({ tone = 'red', dot = false, icon: Icon, className, children }) {
  const content = (
    <>
      {dot && <span aria-hidden className={cx('size-1.5 rounded-full', dots[tone])} />}
      {Icon && <Icon aria-hidden size={14} className="shrink-0" />}
      {children}
    </>
  )

  if (tone === 'chrome') {
    return (
      <span className={cx('inline-flex rounded-full bg-chrome p-px', className)}>
        <span className={cx(shape, 'bg-white px-3 py-1.5 text-body')}>{content}</span>
      </span>
    )
  }

  return <span className={cx(shape, 'px-2.5 py-1', tones[tone], className)}>{content}</span>
}
