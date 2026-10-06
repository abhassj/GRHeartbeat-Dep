import { useId, useRef, useState } from 'react'
import { Link } from 'react-router'
import { AnimatePresence, m } from 'motion/react'
import { ArrowRight, Globe2, Phone } from 'lucide-react'
import PulseLine from '@/components/brand/PulseLine'
import WhatsAppIcon from '@/components/brand/WhatsAppIcon'
import CourseCard from '@/components/courses/CourseCard'
import RevealStagger, { RevealItem } from '@/components/motion/RevealStagger'
import Reveal from '@/components/motion/Reveal'
import Accent from '@/components/ui/Accent'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Eyebrow from '@/components/ui/Eyebrow'
import Heading from '@/components/ui/Heading'
import IconRing from '@/components/ui/IconRing'
import Section from '@/components/ui/Section'
import { home } from '@/data/home'
import { useLayoutReady, useReducedMotionSafe } from '@/hooks/useReducedMotionSafe'
import { telHref, whatsappHref } from '@/lib/contact'
import { getFindYourCourse } from '@/lib/courses'
import { cx } from '@/lib/cx'
import { getIcon } from '@/lib/icons'
import { ease, transition } from '@/lib/motion'

const REGIONS = ['sa', 'uk']

/** Accessible SA/UK tablist: arrow keys, Home/End, roving tabindex, sliding red indicator. */
function RegionTabs({ active, onChange, ids }) {
  const copy = home.findCourse
  const tabs = useRef([])
  const layoutReady = useLayoutReady()

  const onKeyDown = (event) => {
    const index = REGIONS.indexOf(active)
    const next = {
      ArrowRight: (index + 1) % REGIONS.length,
      ArrowLeft: (index - 1 + REGIONS.length) % REGIONS.length,
      Home: 0,
      End: REGIONS.length - 1,
    }[event.key]
    if (next === undefined) return
    event.preventDefault()
    onChange(REGIONS[next])
    tabs.current[next]?.focus()
  }

  return (
    <div
      role="tablist"
      aria-label={copy.tabsLabel}
      className="inline-flex rounded-full border border-line bg-surface p-1"
    >
      {REGIONS.map((region, index) => {
        const selected = region === active
        return (
          <button
            key={region}
            ref={(node) => (tabs.current[index] = node)}
            type="button"
            role="tab"
            id={ids.tab(region)}
            aria-selected={selected}
            aria-controls={selected ? ids.panel(region) : undefined}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(region)}
            onKeyDown={onKeyDown}
            className={cx(
              'relative inline-flex h-11 items-center gap-2 rounded-full px-5 text-sm font-semibold transition-colors duration-200',
              selected ? 'text-white' : 'text-ink hover:text-pulse-red',
            )}
          >
            {selected && (
              <m.span
                key={String(layoutReady)}
                layoutId="region-tab-indicator"
                aria-hidden
                className="absolute inset-0 rounded-full bg-pulse-red"
                transition={transition.morph}
              />
            )}
            <span className="relative">{copy.regions[region]}</span>
            {region === 'uk' && (
              <span
                className={cx(
                  'relative rounded-full px-2 py-0.5 text-[0.6875rem] font-semibold whitespace-nowrap',
                  selected ? 'bg-white/20 text-white' : 'bg-amber-50 text-amber',
                )}
              >
                {copy.regionBadges.uk}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}

function ContactButtons({ message }) {
  const copy = home.findCourse
  return (
    <div className="flex flex-wrap gap-3">
      <Button href={telHref()} iconStart={Phone}>
        {copy.callLabel}
      </Button>
      <Button
        href={whatsappHref(message)}
        target="_blank"
        rel="noopener noreferrer"
        variant="secondary"
        iconStart={WhatsAppIcon}
      >
        {copy.whatsappLabel}
      </Button>
    </div>
  )
}

/** South Africa: featured course cards, or the categories while no courses are published. */
function SouthAfricaPanel() {
  const copy = home.findCourse
  const data = getFindYourCourse('sa')

  if (data.mode === 'courses') {
    return (
      <>
        <RevealStagger as="ul" className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {data.courses.map((course) => (
            <RevealItem as="li" key={course.slug} className="min-w-0">
              <CourseCard course={course} />
            </RevealItem>
          ))}
        </RevealStagger>
        <div className="mt-10 flex justify-center">
          {/* The label carries the course count, so it may wrap on the narrowest phones. */}
          <Button
            to="/courses/sa"
            variant="secondary"
            size="lg"
            icon={ArrowRight}
            className="max-w-full max-sm:h-auto! max-sm:min-h-14 max-sm:py-3 max-sm:text-center max-sm:whitespace-normal!"
          >
            {copy.viewAll(data.total)}
          </Button>
        </div>
      </>
    )
  }

  return (
    <>
      <RevealStagger as="ul" className="grid gap-5 md:grid-cols-3">
        {data.categories.map((category) => (
          <RevealItem as="li" key={category.id} className="min-w-0">
            <Card
              as={Link}
              to={category.url}
              interactive
              tone="white"
              className="flex h-full flex-col shadow-card"
            >
              <IconRing icon={getIcon(category.icon)} />
              <Heading level={3} className="mt-5 transition-colors group-hover:text-pulse-red">
                {category.title}
              </Heading>
              <p className="mt-2 text-[0.9375rem]">{category.line}</p>
              <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-semibold text-pulse-red">
                {copy.categoryLink}
                <ArrowRight
                  aria-hidden
                  size={16}
                  className="transition-transform group-hover:translate-x-1"
                />
              </span>
            </Card>
          </RevealItem>
        ))}
      </RevealStagger>
      <Reveal className="mt-8 flex flex-col items-start gap-4 rounded-card border border-line bg-surface p-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-xl font-medium text-ink">{copy.emptyLine}</p>
        <ContactButtons message={copy.whatsappMessage} />
      </Reveal>
    </>
  )
}

/** United Kingdom: a calm "coming soon" panel with WhatsApp and contact actions. */
function UnitedKingdomPanel() {
  const uk = home.findCourse.uk
  return (
    <Card
      tone="white"
      padding="none"
      className="overflow-hidden shadow-card md:grid md:grid-cols-[2fr_3fr]"
    >
      <div
        aria-hidden
        className="relative flex min-h-48 items-center justify-center bg-monitor-grid"
      >
        <Globe2 size={88} strokeWidth={1.1} className="text-white/25" />
        <PulseLine
          className="absolute inset-x-6 top-1/2 h-16 -translate-y-1/2"
          shape="spike"
          beats={[0.5]}
          color="var(--color-red-400)"
          blipColor="var(--color-white)"
          draw="view"
          loop={false}
        />
      </div>
      <div className="p-7 sm:p-10">
        <Badge tone="amber" dot>
          {uk.badge}
        </Badge>
        <Heading level={3} className="mt-4 text-h2">
          {uk.heading}
        </Heading>
        <p className="mt-3 max-w-lg">{uk.text}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button
            href={whatsappHref(uk.whatsappMessage)}
            target="_blank"
            rel="noopener noreferrer"
            iconStart={WhatsAppIcon}
          >
            {uk.whatsappLabel}
          </Button>
          <Button to={uk.contactTo} variant="secondary">
            {uk.contactLabel}
          </Button>
        </div>
      </div>
    </Card>
  )
}

/** 4.5 Find your course: region tabs; panels adapt to the course data. */
export default function FindYourCourse() {
  const copy = home.findCourse
  const reduced = useReducedMotionSafe()
  const [region, setRegion] = useState('sa')
  const base = useId()
  const ids = { tab: (r) => `${base}-tab-${r}`, panel: (r) => `${base}-panel-${r}` }

  return (
    <Section tone="white" aria-labelledby="find-course-heading">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <Reveal>
          <Eyebrow marker>{copy.eyebrow}</Eyebrow>
          <Heading id="find-course-heading" level={2} className="mt-3">
            {copy.heading.lead} <Accent>{copy.heading.accent}</Accent>
          </Heading>
        </Reveal>
        <RegionTabs active={region} onChange={setRegion} ids={ids} />
      </div>

      <div className="mt-10">
        <AnimatePresence mode="wait" initial={false}>
          <m.div
            key={region}
            role="tabpanel"
            id={ids.panel(region)}
            aria-labelledby={ids.tab(region)}
            tabIndex={0}
            className="rounded-card"
            initial={reduced ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: ease.out }}
          >
            {region === 'sa' ? <SouthAfricaPanel /> : <UnitedKingdomPanel />}
          </m.div>
        </AnimatePresence>
      </div>
    </Section>
  )
}
