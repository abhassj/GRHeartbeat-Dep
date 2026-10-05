import { cx } from '@/lib/cx'
import Container from '@/components/ui/Container'

/*
 * Each tone sets the background plus CSS variables that Heading, Eyebrow and Accent read,
 * so text inside a section picks the right colour without per-component props.
 */
const tones = {
  white:
    'bg-white text-body [--accent-color:var(--color-pulse-red)] [--eyebrow-color:var(--color-navy)] [--heading-color:var(--color-ink)]',
  surface:
    'bg-surface text-body [--accent-color:var(--color-pulse-red)] [--eyebrow-color:var(--color-navy)] [--heading-color:var(--color-ink)]',
  monitor:
    'bg-monitor-grid text-grey-200 [--accent-color:var(--color-red-400)] [--eyebrow-color:var(--color-red-400)] [--heading-color:var(--color-white)]',
  red: 'bg-pulse-red text-white [--accent-color:var(--color-white)] [--eyebrow-color:var(--color-white)] [--heading-color:var(--color-white)]',
  slate:
    'bg-slate text-grey-200 [--accent-color:var(--color-red-100)] [--eyebrow-color:var(--color-grey-200)] [--heading-color:var(--color-white)]',
}

const darkTones = new Set(['monitor', 'red', 'slate'])

const spacings = {
  default: 'py-16 sm:py-20 lg:py-28 xl:py-32',
  compact: 'py-12 sm:py-16 lg:py-20',
  none: '',
}

/**
 * Page section. `panel` turns it into a 24px-radius block inset from the page edges
 * (used for the dark monitor section). Children sit in a Container unless `bleed`.
 */
export default function Section({
  as: Tag = 'section',
  tone = 'white',
  spacing = 'default',
  panel = false,
  bleed = false,
  className,
  containerClassName,
  children,
  ...props
}) {
  const inner = bleed ? children : <Container className={containerClassName}>{children}</Container>
  const toneProps = {
    'data-tone': darkTones.has(tone) ? 'dark' : 'light',
    className: cx(tones[tone], spacings[spacing]),
  }

  if (panel) {
    return (
      <Tag className={cx('px-3 sm:px-4', className)} {...props}>
        <div {...toneProps} className={cx(toneProps.className, 'overflow-hidden rounded-panel')}>
          {inner}
        </div>
      </Tag>
    )
  }

  return (
    <Tag {...toneProps} className={cx(toneProps.className, className)} {...props}>
      {inner}
    </Tag>
  )
}
