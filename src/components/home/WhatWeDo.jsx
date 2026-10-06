import { useRef, useState } from 'react'
import { Link } from 'react-router'
import { AnimatePresence, m, useMotionValueEvent, useScroll, useTransform } from 'motion/react'
import { ArrowRight } from 'lucide-react'
import landscapePlaceholder from '@/assets/placeholders/photo-landscape.svg'
import portraitPlaceholder from '@/assets/placeholders/photo-portrait.svg'
import ImageReveal from '@/components/motion/ImageReveal'
import Reveal from '@/components/motion/Reveal'
import Accent from '@/components/ui/Accent'
import Card from '@/components/ui/Card'
import Eyebrow from '@/components/ui/Eyebrow'
import Heading from '@/components/ui/Heading'
import IconRing from '@/components/ui/IconRing'
import Section from '@/components/ui/Section'
import { home } from '@/data/home'
import { getPhoto } from '@/data/photos'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe'
import { courseUrl, getPillars } from '@/lib/courses'
import { getIcon } from '@/lib/icons'
import { ease } from '@/lib/motion'

const number = (index) => String(index + 1).padStart(2, '0')

/** A pillar's photo, or the neutral placeholder SVG when the category has none yet. */
const pillarImage = (pillar, shape) => {
  const photo = getPhoto(pillar.image)
  if (photo)
    return {
      src: photo.src,
      srcSet: photo.srcSet,
      alt: photo.alt,
      width: photo.width,
      height: photo.height,
    }
  return shape === 'portrait'
    ? { src: portraitPlaceholder, alt: '', width: 800, height: 1000 }
    : { src: landscapePlaceholder, alt: '', width: 1600, height: 1000 }
}

function PillarText({ pillar, index }) {
  const Icon = getIcon(pillar.icon)
  const copy = home.whatWeDo
  return (
    <>
      <div className="flex items-center gap-4">
        <IconRing icon={Icon} size="sm" />
        <Eyebrow>{number(index)}</Eyebrow>
      </div>
      <Heading level={3} className="mt-5 text-h2">
        {pillar.title}
      </Heading>
      <p className="mt-4 max-w-lg text-lead">{pillar.description}</p>
      {pillar.courses.length > 0 && (
        <div className="mt-6">
          <p className="text-xs font-semibold tracking-[0.12em] text-navy uppercase">
            {copy.chipsLabel}
          </p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {pillar.courses.map((course) => (
              <li key={course.slug} className="max-w-full min-w-0">
                <Link
                  to={courseUrl(course)}
                  className="inline-flex max-w-full rounded-full border border-line bg-white px-4 py-2 text-sm font-medium text-ink transition-colors hover:border-grey-300 hover:text-pulse-red"
                >
                  <span className="truncate">{course.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
      <Link
        to={pillar.url}
        className="group mt-7 inline-flex items-center gap-2 font-semibold text-pulse-red hover:text-crimson"
      >
        {copy.seeCourses}
        <span className="sr-only">: {pillar.title}</span>
        <ArrowRight
          aria-hidden
          size={18}
          className="transition-transform group-hover:translate-x-1"
        />
      </Link>
    </>
  )
}

/** Desktop: sticky image frame on the left, pillar blocks scroll past on the right. */
function StickyPillars({ pillars }) {
  const track = useRef(null)
  const [active, setActive] = useState(0)
  const { scrollYProgress } = useScroll({ target: track, offset: ['start center', 'end center'] })
  const blipY = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])

  useMotionValueEvent(scrollYProgress, 'change', (value) => {
    setActive(Math.min(pillars.length - 1, Math.max(0, Math.floor(value * pillars.length))))
  })

  const current = pillars[active]
  const image = pillarImage(current, 'portrait')

  return (
    <div ref={track} className="relative mt-16 grid grid-cols-2 gap-16">
      <div className="sticky top-[calc(var(--nav-offset)+1rem)] h-[70vh] self-start">
        <div className="relative size-full overflow-hidden rounded-panel bg-grey-100 shadow-card">
          <AnimatePresence initial={false}>
            <m.img
              key={current.id}
              src={image.src}
              srcSet={image.srcSet}
              sizes="50vw"
              alt={image.alt}
              width={image.width}
              height={image.height}
              loading="lazy"
              className="absolute inset-0 size-full object-cover"
              initial={{ opacity: 0, scale: 1.06 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: ease.out }}
            />
          </AnimatePresence>

          {/* Progress rail with an ECG blip that travels down to the active pillar */}
          <div
            aria-hidden
            className="absolute top-8 bottom-8 left-6 w-0.5 rounded-full bg-white/50"
          >
            <m.div
              className="absolute inset-0 origin-top rounded-full bg-pulse-red"
              style={{ scaleY: scrollYProgress }}
            />
            <m.div className="absolute inset-x-0 top-0 h-full" style={{ y: blipY }}>
              <svg
                viewBox="0 0 16 24"
                className="absolute -top-3 -left-[7px] h-6 w-4 text-pulse-red"
                fill="none"
              >
                <path
                  d="M8 0v7l-4 3 7 4-3 3v7"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </m.div>
          </div>

          {/* Glass label naming the active pillar */}
          <div className="absolute bottom-6 left-12 overflow-hidden rounded-full border border-white/60 bg-white/80 px-5 py-2.5 shadow-card backdrop-blur-md">
            <AnimatePresence mode="wait" initial={false}>
              <m.p
                key={current.id}
                className="font-display text-sm font-bold text-ink"
                initial={{ y: 14, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -14, opacity: 0 }}
                transition={{ duration: 0.25, ease: ease.out }}
              >
                {current.title}
              </m.p>
            </AnimatePresence>
          </div>
        </div>
      </div>

      <ol>
        {pillars.map((pillar, index) => (
          <m.li
            key={pillar.id}
            className="flex min-h-[90svh] flex-col justify-center py-10"
            animate={{ opacity: index === active ? 1 : 0.4 }}
            transition={{ duration: 0.4, ease: ease.out }}
          >
            <PillarText pillar={pillar} index={index} />
          </m.li>
        ))}
      </ol>
    </div>
  )
}

/** Mobile, tablet and reduced motion: stacked image + text cards, no pinning. */
function StackedPillars({ pillars }) {
  return (
    <ol className="mt-12 grid grid-cols-1 gap-6">
      {pillars.map((pillar, index) => {
        const image = pillarImage(pillar, 'landscape')
        return (
          <li key={pillar.id} className="min-w-0">
            <Card
              tone="white"
              padding="none"
              className="overflow-hidden shadow-card md:grid md:grid-cols-2"
            >
              <ImageReveal
                src={image.src}
                srcSet={image.srcSet}
                sizes="(min-width: 768px) 50vw, 100vw"
                alt={image.alt}
                width={image.width}
                height={image.height}
                rounded=""
                className="aspect-4/3 md:aspect-auto md:h-full"
              />
              <Reveal className="min-w-0 p-6 sm:p-8">
                <PillarText pillar={pillar} index={index} />
              </Reveal>
            </Card>
          </li>
        )
      })}
    </ol>
  )
}

/** 4.4 What we do: one pillar per category (from categories.js), chips from the course data. */
export default function WhatWeDo() {
  const reduced = useReducedMotionSafe()
  const desktop = useMediaQuery('(min-width: 1024px)')
  const pillars = getPillars('sa')
  const copy = home.whatWeDo
  if (!pillars.length) return null

  return (
    <Section tone="surface" aria-labelledby="what-we-do-heading">
      <Reveal className="max-w-2xl">
        <Eyebrow marker>{copy.eyebrow}</Eyebrow>
        <Heading id="what-we-do-heading" level={2} className="mt-3">
          {copy.heading.lead} <Accent>{copy.heading.accent}</Accent>
        </Heading>
      </Reveal>
      {desktop && !reduced ? (
        <StickyPillars pillars={pillars} />
      ) : (
        <StackedPillars pillars={pillars} />
      )}
    </Section>
  )
}
