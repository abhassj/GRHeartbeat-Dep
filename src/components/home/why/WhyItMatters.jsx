import { lazy, Suspense, useRef } from 'react'
import { Link } from 'react-router'
import { ArrowRight } from 'lucide-react'
import VideoComingSoonCards from '@/components/home/why/VideoComingSoonCards'
import Reveal from '@/components/motion/Reveal'
import Accent from '@/components/ui/Accent'
import Eyebrow from '@/components/ui/Eyebrow'
import Heading from '@/components/ui/Heading'
import Section from '@/components/ui/Section'
import { home } from '@/data/home'
import { useNearViewport } from '@/hooks/useNearViewport'
import { categoryUrl } from '@/lib/courses'
import { getVideos, hasVideo } from '@/lib/videos'

// Code-split: the canvas monitor + tap game, and the video player (only when a video exists).
const WhyItMattersInteractive = lazy(() => import('@/components/home/why/WhyItMattersInteractive'))
const VideoChapters = lazy(() => import('@/components/home/why/VideoChapters'))

// Fixed height reserved for the interactive half, shared by the skeleton: no layout shift.
const SLOT = 'h-[44rem] sm:h-[38rem] lg:h-[34rem]'

function InteractiveSkeleton() {
  return (
    <div aria-hidden className="flex size-full flex-col gap-4">
      <div className="flex-1 rounded-card border border-white/10 bg-grey-900/60" />
      <div className="h-56 shrink-0 rounded-card border border-white/10 bg-grey-900/60 sm:h-44" />
    </div>
  )
}

function PlayerSkeleton() {
  return (
    <div aria-hidden className="aspect-video rounded-card border border-white/10 bg-grey-900/60" />
  )
}

/**
 * 4.6 Why it matters — the dark monitor panel. Copy on the left; the CPR rhythm monitor and
 * "Try the rhythm" game on the right (lazy-loaded within ~600px of the viewport into a
 * fixed-height slot); learning videos below — compact "coming soon" cards while no video
 * has an ID, the click-to-load player once one does.
 */
export default function WhyItMatters() {
  const copy = home.whyItMatters
  const slot = useRef(null)
  const near = useNearViewport(slot, '600px')
  const videos = getVideos()
  const anyVideo = videos.some(hasVideo)

  return (
    <Section tone="monitor" panel aria-labelledby="why-it-matters-heading">
      <div className="grid gap-10 lg:grid-cols-[5fr_7fr] lg:items-center lg:gap-14">
        <Reveal>
          <Eyebrow marker>{copy.eyebrow}</Eyebrow>
          <Heading id="why-it-matters-heading" level={2} className="mt-3">
            {copy.heading.lead} <Accent>{copy.heading.accent}</Accent>
          </Heading>
          <p className="mt-5 text-lead font-medium text-white">{copy.monitor.lead}</p>
          <p className="mt-3">{copy.monitor.tie}</p>
          <Link
            to={categoryUrl('sa', copy.monitor.cta.category)}
            className="group mt-6 inline-flex items-center gap-2 font-semibold text-red-400 hover:text-red-100"
          >
            {copy.monitor.cta.label}
            <ArrowRight
              aria-hidden
              size={18}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </Reveal>

        <div ref={slot} className={`min-w-0 ${SLOT}`}>
          {near ? (
            <Suspense fallback={<InteractiveSkeleton />}>
              <WhyItMattersInteractive />
            </Suspense>
          ) : (
            <InteractiveSkeleton />
          )}
        </div>
      </div>

      <div className="mt-16 border-t border-white/10 pt-12">
        <Heading level={3}>{copy.videos.heading}</Heading>
        {!anyVideo && <p className="mt-2 text-sm">{copy.videos.comingSoonIntro}</p>}
        <div className="mt-6">
          {anyVideo ? (
            <Suspense fallback={<PlayerSkeleton />}>
              {near ? <VideoChapters videos={videos} /> : <PlayerSkeleton />}
            </Suspense>
          ) : (
            <VideoComingSoonCards videos={videos} />
          )}
        </div>
      </div>
    </Section>
  )
}
