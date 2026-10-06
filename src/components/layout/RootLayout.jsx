import { useMatches } from 'react-router'
import SampleContentBanner from '@/components/dev/SampleContentBanner'
import FinalCta from '@/components/layout/FinalCta'
import Footer from '@/components/layout/Footer'
import Navbar from '@/components/layout/Navbar'
import PageTransition from '@/components/layout/PageTransition'
import SkipLink from '@/components/layout/SkipLink'
import WhatsAppFab from '@/components/layout/WhatsAppFab'
import ScrollProgress from '@/components/motion/ScrollProgress'
import SmoothScroll from '@/components/providers/SmoothScroll'

/**
 * App shell: skip link, floating navbar, routed page (with transitions, scroll and focus
 * management), the final CTA band (unless a route opts out with handle.finalCta = false),
 * footer and the floating WhatsApp button.
 */
export default function RootLayout() {
  const matches = useMatches()
  const showFinalCta = matches.every((match) => match.handle?.finalCta !== false)

  return (
    <SmoothScroll>
      <SkipLink />
      <SampleContentBanner />
      <ScrollProgress />
      <Navbar />

      <div className="flex min-h-dvh flex-col">
        <main id="main" tabIndex={-1} className="flex-1 pt-(--nav-offset)">
          <PageTransition />
        </main>
        {showFinalCta && <FinalCta />}
        <Footer overlap={showFinalCta} />
      </div>

      <WhatsAppFab />
    </SmoothScroll>
  )
}
