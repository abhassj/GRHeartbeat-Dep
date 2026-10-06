import { useRef } from 'react'
import { m, useScroll, useTransform } from 'motion/react'
import { ArrowRight, Check } from 'lucide-react'
import EcgEdge from '@/components/brand/EcgEdge'
import HeartbeatButton from '@/components/brand/HeartbeatButton'
import HeroHeadline from '@/components/home/HeroHeadline'
import HeroVideo from '@/components/home/HeroVideo'
import ScrollCue from '@/components/home/ScrollCue'
import MotionPauseButton from '@/components/motion/MotionPauseButton'
import Button from '@/components/ui/Button'
import Container from '@/components/ui/Container'
import Eyebrow from '@/components/ui/Eyebrow'
import { home } from '@/data/home'
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe'
import { transition } from '@/lib/motion'

const SEAM_DEPTH = 36

/**
 * 4.1 Hero: text left, video right on ≥ 1024px (stacked below on mobile, 16:10). The video
 * panel's left edge is an ECG trace with a PulseLine along the seam that draws in, then
 * beats on the shared heartbeat clock (in step with the HeartbeatButton glow).
 * Scrolling away gently shrinks the panel and lifts/fades the text (transforms only).
 */
export default function Hero() {
  const { hero, heroVideo } = home
  const reduced = useReducedMotionSafe()
  const section = useRef(null)
  const { scrollYProgress } = useScroll({ target: section, offset: ['start start', 'end start'] })
  const textY = useTransform(scrollYProgress, [0, 1], [0, -60])
  const textOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])
  const panelScale = useTransform(scrollYProgress, [0, 1], [1, 0.94])
  const radius = useTransform(scrollYProgress, [0, 1], [24, 40])
  const clipPath = useTransform(radius, (r) => `inset(0 round 0 ${r}px ${r}px 0)`)

  const hasVideoOrPoster =
    heroVideo.sources.length > 0 || heroVideo.poster || heroVideo.fallbackPhoto

  return (
    <section ref={section} aria-labelledby="hero-heading" className="relative">
      <Container className="grid min-h-[calc(100svh-var(--nav-offset))] items-center gap-10 pt-6 pb-12 lg:grid-cols-2 lg:gap-14 lg:pb-20">
        <m.div style={reduced ? undefined : { y: textY, opacity: textOpacity }}>
          <Eyebrow marker>{hero.eyebrow}</Eyebrow>
          <HeroHeadline id="hero-heading" motto={hero.motto} />
          <m.div
            initial={reduced ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...transition.slow, delay: reduced ? 0 : 0.55 }}
          >
            <p className="mt-6 max-w-xl text-lead">{hero.subline}</p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <HeartbeatButton to={hero.primaryCta.to} icon={ArrowRight} loopGroup="hero">
                {hero.primaryCta.label}
              </HeartbeatButton>
              <Button to={hero.secondaryCta.to} variant="secondary" size="lg">
                {hero.secondaryCta.label}
              </Button>
            </div>
            {hero.trustItems.length > 0 && (
              <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium text-ink">
                {hero.trustItems.map((item) => (
                  <li key={item} className="inline-flex items-center gap-2">
                    <Check aria-hidden size={16} className="text-success" strokeWidth={2.5} />
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </m.div>
        </m.div>

        {hasVideoOrPoster && (
          <m.div
            className="relative origin-center"
            style={reduced ? undefined : { scale: panelScale }}
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={transition.slow}
          >
            <EcgEdge
              side="left"
              depth={SEAM_DEPTH}
              spikeWidth={150}
              position={0.5}
              pulse
              pulseProps={{
                loopGroup: 'hero',
                sync: true,
                sweep: 1.4,
                strokeWidth: 2.5,
                drawDuration: 1.4,
                delay: 0.3,
              }}
              className="aspect-[16/10] w-full lg:aspect-[4/5] lg:max-h-[calc(100svh-var(--nav-offset)-4rem)]"
            >
              <m.div
                className="size-full overflow-hidden rounded-r-panel"
                style={reduced ? undefined : { clipPath }}
              >
                <HeroVideo config={heroVideo} />
              </m.div>
            </EcgEdge>
            {!reduced && <MotionPauseButton className="absolute right-4 bottom-4 z-10" />}
          </m.div>
        )}
      </Container>
      <ScrollCue label={hero.scrollCue} />
    </section>
  )
}
