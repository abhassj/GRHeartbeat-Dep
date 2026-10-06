import EcgDivider from '@/components/brand/EcgDivider'
import Clients from '@/components/home/Clients'
import FindYourCourse from '@/components/home/FindYourCourse'
import Hero from '@/components/home/Hero'
import HowItWorks from '@/components/home/HowItWorks'
import TrustStrip from '@/components/home/TrustStrip'
import WhatWeDo from '@/components/home/WhatWeDo'
import WhoWeAre from '@/components/home/WhoWeAre'
import WhyItMatters from '@/components/home/why/WhyItMatters'
import { home } from '@/data/home'
import { hasClients } from '@/lib/clients'

/*
 * Home page, sections 4.1–4.8. Background rhythm: white hero → surface trust strip → white →
 * surface → white → dark monitor panel (inset) → white → surface clients → red CTA band →
 * slate footer. At most three EcgDividers (4.9), each drawing once, never looping.
 */
export default function Home() {
  const clients = hasClients()
  return (
    <>
      <title>{home.meta.title}</title>
      <meta name="description" content={home.meta.description} />
      <Hero />
      <TrustStrip />
      <WhoWeAre />
      <EcgDivider className="-mt-6 mb-0 bg-white" />
      <WhatWeDo />
      <FindYourCourse />
      <EcgDivider className="bg-white pb-6" />
      <WhyItMatters />
      <HowItWorks />
      {clients && <EcgDivider className="bg-white pb-6" />}
      <Clients />
    </>
  )
}
