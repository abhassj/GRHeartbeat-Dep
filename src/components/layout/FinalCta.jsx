import { useRef } from 'react'
import { Mail, Phone } from 'lucide-react'
import EcgEdge from '@/components/brand/EcgEdge'
import HeartbeatButton from '@/components/brand/HeartbeatButton'
import WhatsAppIcon from '@/components/brand/WhatsAppIcon'
import Reveal from '@/components/motion/Reveal'
import Button from '@/components/ui/Button'
import Heading from '@/components/ui/Heading'
import { finalCta as copy, whatsappMessage } from '@/data/navigation'
import { useHidesFab } from '@/hooks/useFabVisibility'
import { mailtoHref, telHref, whatsappHref } from '@/lib/contact'

// The band's bottom `EDGE_DEPTH` px is the ECG edge; it overlaps the footer by OVERLAP.
const EDGE_DEPTH = 44
export const FINAL_CTA_OVERLAP = 'calc(44px + 3rem)'

/**
 * Pulse Red band above the footer with an ECG-trace bottom edge, overlapping into the
 * footer. Call, WhatsApp and Email actions. Hidden on pages that opt out (route handle).
 */
export default function FinalCta() {
  const ref = useRef(null)
  useHidesFab(ref)

  return (
    <section
      ref={ref}
      aria-labelledby="final-cta-heading"
      className="relative z-10 px-3 sm:px-4"
      style={{ marginBottom: `calc(-1 * ${FINAL_CTA_OVERLAP})` }}
    >
      <EcgEdge depth={EDGE_DEPTH} spikeWidth={128} position={0.5} className="mx-auto max-w-content">
        <div
          data-tone="dark"
          className="rounded-t-panel bg-pulse-red px-6 pt-14 pb-24 text-white [--heading-color:var(--color-white)] sm:px-12 sm:pt-16 lg:px-16"
        >
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <Reveal className="max-w-xl">
              <Heading id="final-cta-heading" level={2}>
                {copy.heading}
              </Heading>
              <p className="mt-3 text-lead text-white/95">{copy.text}</p>
            </Reveal>
            <div className="flex flex-wrap gap-3">
              <HeartbeatButton variant="white" href={telHref()} iconStart={Phone}>
                {copy.callLabel}
              </HeartbeatButton>
              <Button
                variant="white"
                size="lg"
                href={whatsappHref(whatsappMessage)}
                target="_blank"
                rel="noopener noreferrer"
                iconStart={WhatsAppIcon}
              >
                {copy.whatsappLabel}
              </Button>
              <Button
                variant="white"
                size="lg"
                href={mailtoHref({ subject: copy.emailSubject })}
                iconStart={Mail}
              >
                {copy.emailLabel}
              </Button>
            </div>
          </div>
        </div>
      </EcgEdge>
    </section>
  )
}
