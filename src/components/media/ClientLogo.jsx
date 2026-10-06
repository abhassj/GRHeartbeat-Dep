import { cx } from '@/lib/cx'

/**
 * One client logo: greyscale at 60%, full colour on hover. Development placeholders (no logo
 * file) render as a neutral dashed tile with the generic label — never a company name.
 */
export default function ClientLogo({ client, className }) {
  if (!client.logo) {
    return (
      <span
        className={cx(
          'inline-flex h-12 w-36 shrink-0 items-center justify-center rounded-xl border border-dashed border-grey-300 text-xs font-semibold text-grey-500',
          className,
        )}
      >
        {client.name}
      </span>
    )
  }

  const image = (
    <img
      src={client.logo}
      alt={client.alt}
      loading="lazy"
      decoding="async"
      className={cx(
        'h-12 w-auto max-w-40 object-contain opacity-60 grayscale transition-[opacity,filter] duration-300 hover:opacity-100 hover:grayscale-0',
        className,
      )}
    />
  )
  return client.url ? (
    <a href={client.url} target="_blank" rel="noopener noreferrer" className="shrink-0">
      {image}
    </a>
  ) : (
    image
  )
}
