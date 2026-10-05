import { brand } from '@/data/brand'

/** The brand lockup. Size it by height (e.g. h-10 w-auto). Pass alt="" when a link labels it. */
export default function Logo({ alt = brand.logo.alt, className, ...props }) {
  return (
    <img
      src={brand.logo.src}
      alt={alt}
      width={brand.logo.width}
      height={brand.logo.height}
      decoding="async"
      className={className}
      {...props}
    />
  )
}
