import { cx } from '@/lib/cx'

/** Centred content column: 1240px max, 20px gutters on phones, 32px from sm up. */
export default function Container({ as: Tag = 'div', className, children, ...props }) {
  return (
    <Tag className={cx('mx-auto w-full max-w-content px-5 sm:px-8', className)} {...props}>
      {children}
    </Tag>
  )
}
