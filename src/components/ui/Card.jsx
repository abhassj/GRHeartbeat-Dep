import { cx } from '@/lib/cx'

const paddings = {
  none: '',
  sm: 'p-5',
  md: 'p-6 sm:p-7',
  lg: 'p-7 sm:p-10',
}

const tones = {
  surface: 'bg-surface border-line',
  white: 'bg-white border-line',
  navy: 'bg-navy border-navy text-white [--eyebrow-color:var(--color-grey-200)] [--heading-color:var(--color-white)]',
}

/**
 * Rounded 16px card. `interactive` adds the hover lift (4px), stronger border and shadow;
 * it also sets `group` so children can react (e.g. group-hover:text-pulse-red).
 */
export default function Card({
  as: Tag = 'div',
  tone = 'surface',
  padding = 'md',
  interactive = false,
  className,
  children,
  ...props
}) {
  return (
    <Tag
      className={cx(
        'relative rounded-card border',
        tones[tone],
        paddings[padding],
        interactive &&
          'group transition-[translate,box-shadow,border-color] duration-300 ease-out focus-within:-translate-y-1 focus-within:shadow-card-hover hover:-translate-y-1 hover:border-grey-300 hover:shadow-card-hover',
        className,
      )}
      {...props}
    >
      {children}
    </Tag>
  )
}
