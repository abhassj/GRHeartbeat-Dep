import { cx } from '@/lib/cx'

const sizes = {
  1: 'text-h1',
  2: 'text-h2',
  3: 'text-h3',
  4: 'text-h4 font-bold',
}

/**
 * h1–h4 on the type scale. `display` uses the largest hero size. `as` changes the tag
 * without changing the look (e.g. an h2 styled as h3). Colour follows the section tone.
 */
export default function Heading({ level = 2, display = false, as, className, children, ...props }) {
  const Tag = as ?? `h${level}`
  return (
    <Tag
      className={cx(
        'font-display font-extrabold text-balance text-(--heading-color,var(--color-ink))',
        display ? 'text-display' : sizes[level],
        className,
      )}
      {...props}
    >
      {children}
    </Tag>
  )
}
