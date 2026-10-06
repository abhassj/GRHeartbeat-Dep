import { Award } from 'lucide-react'
import Marquee from '@/components/motion/Marquee'
import RevealStagger, { RevealItem } from '@/components/motion/RevealStagger'
import Badge from '@/components/ui/Badge'
import Container from '@/components/ui/Container'
import { home } from '@/data/home'
import { getTrustItems } from '@/lib/trust'

const MIN_ITEMS = 3

/**
 * 4.2 Trust strip (~88px, surface tone). Renders only data-backed items and hides itself
 * entirely when fewer than three qualify — so it never shows as a thin, half-empty band.
 * Desktop: one row (badges stagger in); mobile: a marquee.
 */
export default function TrustStrip({ items = getTrustItems() }) {
  if (items.length < MIN_ITEMS) return null
  const badges = items.filter((item) => item.kind === 'badge')
  const lines = items.filter((item) => item.kind === 'line')

  const renderItem = (item) =>
    item.kind === 'badge' ? (
      <Badge tone="chrome" icon={Award}>
        {item.label}
      </Badge>
    ) : (
      <span className="text-sm font-semibold whitespace-nowrap text-ink">{item.label}</span>
    )

  return (
    <section aria-label={home.trustStrip.accreditedBy} className="border-y border-line bg-surface">
      <Container className="hidden min-h-22 items-center justify-center gap-6 py-4 md:flex">
        {badges.length > 0 && (
          <>
            <p className="text-eyebrow font-bold tracking-[0.12em] text-navy uppercase">
              {home.trustStrip.accreditedBy}
            </p>
            <RevealStagger as="ul" className="flex flex-wrap items-center gap-3">
              {badges.map((item) => (
                <RevealItem as="li" key={item.key}>
                  {renderItem(item)}
                </RevealItem>
              ))}
            </RevealStagger>
          </>
        )}
        {badges.length > 0 && lines.length > 0 && (
          <span aria-hidden className="h-6 w-px bg-chrome" />
        )}
        {lines.map((item) => (
          <p key={item.key}>{renderItem(item)}</p>
        ))}
      </Container>
      <div className="py-4 md:hidden">
        <Marquee duration={30} gap="2rem">
          {items.map((item) => (
            <span key={item.key}>{renderItem(item)}</span>
          ))}
        </Marquee>
      </div>
    </section>
  )
}
