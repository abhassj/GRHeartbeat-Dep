import Hero from '@/components/home/Hero'
import TrustStrip from '@/components/home/TrustStrip'
import WhatWeDo from '@/components/home/WhatWeDo'
import WhoWeAre from '@/components/home/WhoWeAre'
import { home } from '@/data/home'

// Phase 4a: sections 4.1–4.4. Sections 4.5–4.9 follow in Phase 4b.
export default function Home() {
  return (
    <>
      <title>{home.meta.title}</title>
      <meta name="description" content={home.meta.description} />
      <Hero />
      <TrustStrip />
      <WhoWeAre />
      <WhatWeDo />
    </>
  )
}
