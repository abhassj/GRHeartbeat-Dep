import { useState } from 'react'
import { AnimatePresence, m, useMotionValueEvent, useScroll } from 'motion/react'
import WhatsAppIcon from '@/components/brand/WhatsAppIcon'
import { whatsappFab as copy } from '@/data/navigation'
import { useFabBlocked } from '@/hooks/useFabVisibility'
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe'
import { whatsappHref } from '@/lib/contact'
import { ease, transition } from '@/lib/motion'

const SHOW_AFTER = 400

/**
 * Floating WhatsApp button (bottom-right). Appears after 400px of scroll with a single
 * pulse the first time, and fades out while the final CTA band or footer is on screen
 * (they already offer WhatsApp, and the footer has the back-to-top button there).
 */
export default function WhatsAppFab() {
  const reduced = useReducedMotionSafe()
  const blocked = useFabBlocked()
  const { scrollY } = useScroll()
  const [past, setPast] = useState(false)
  const [pulsed, setPulsed] = useState(false)

  useMotionValueEvent(scrollY, 'change', (y) => setPast(y > SHOW_AFTER))

  const visible = past && !blocked
  const pulseNow = visible && !pulsed && !reduced

  return (
    <AnimatePresence>
      {visible && (
        <m.a
          key="whatsapp-fab"
          href={whatsappHref(copy.message)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={copy.label}
          className="fixed right-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-30 inline-flex size-14 items-center justify-center rounded-full bg-whatsapp text-white shadow-card-hover sm:right-6 sm:bottom-6"
          initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.6, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.8, y: 8 }}
          transition={reduced ? { duration: 0 } : transition.base}
        >
          {pulseNow && (
            <m.span
              aria-hidden
              className="absolute inset-0 rounded-full bg-whatsapp"
              initial={{ scale: 1, opacity: 0.55 }}
              animate={{ scale: 1.7, opacity: 0 }}
              transition={{ duration: 1.1, ease: ease.out, delay: 0.2 }}
              onAnimationComplete={() => setPulsed(true)}
            />
          )}
          <WhatsAppIcon size={26} className="relative" />
        </m.a>
      )}
    </AnimatePresence>
  )
}
