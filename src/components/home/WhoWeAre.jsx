import { ArrowRight, Eye, Target } from 'lucide-react'
import ChromeText from '@/components/motion/ChromeText'
import CountUp from '@/components/motion/CountUp'
import ImageReveal from '@/components/motion/ImageReveal'
import RevealStagger, { RevealItem } from '@/components/motion/RevealStagger'
import Reveal from '@/components/motion/Reveal'
import Accent from '@/components/ui/Accent'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Eyebrow from '@/components/ui/Eyebrow'
import Heading from '@/components/ui/Heading'
import IconRing from '@/components/ui/IconRing'
import Section from '@/components/ui/Section'
import { home } from '@/data/home'
import { getPhoto } from '@/data/photos'
import { cx } from '@/lib/cx'
import { getIcon } from '@/lib/icons'

/*
 * Desktop bento (4 columns × 2 rows). Each slot only renders when its data exists; a missing
 * photo hands its columns to the card beside it, so the grid never shows a dead gap.
 *   row 1: [ tall ][ mission ][   wide   ]
 *   row 2: [ tall ][     vision    ][ sq ]
 */
function bentoLayout({ tall, wide, square, mission, vision }) {
  const start = tall ? 2 : 1
  const span = (n) =>
    ({ 1: 'lg:col-span-1', 2: 'lg:col-span-2', 3: 'lg:col-span-3', 4: 'lg:col-span-4' })[n]
  const colStart = { 1: 'lg:col-start-1', 2: 'lg:col-start-2' }[start]
  const free = 5 - start
  return {
    tall: 'lg:col-span-1 lg:col-start-1 lg:row-span-2 lg:row-start-1',
    mission: cx(colStart, 'lg:row-start-1', span(wide ? free - 2 : free)),
    wide: cx('lg:row-start-1', span(2)),
    vision: cx(colStart, 'lg:row-start-2', span(square ? free - 1 : free)),
    square: 'lg:row-start-2 lg:col-span-1',
    rows:
      mission || wide ? (vision || square ? 'lg:grid-rows-2' : 'lg:grid-rows-1') : 'lg:grid-rows-1',
  }
}

// Tablet (2 columns): the tall photo spans the row; an odd last item spans both columns.
function tabletSpans(present) {
  const order = ['mission', 'wide', 'vision', 'square'].filter((key) => present[key])
  const last = order.length % 2 === 1 ? order.at(-1) : null
  return Object.fromEntries(order.map((key) => [key, key === last ? 'sm:col-span-2' : '']))
}

function BentoPhoto({ photo, className, parallax = false }) {
  return (
    <div className={cx('group overflow-hidden rounded-card', className)}>
      <ImageReveal
        src={photo.src}
        srcSet={photo.srcSet}
        sizes="(min-width: 1024px) 25vw, 100vw"
        alt={photo.alt}
        width={photo.width}
        height={photo.height}
        parallax={parallax}
        className="aspect-4/3 size-full sm:aspect-video lg:aspect-auto"
        imgClassName="transition-transform duration-700 ease-out group-hover:scale-105"
      />
    </div>
  )
}

/** 4.3 Who we are: bento of photos + mission/vision cards, then the stats row. */
export default function WhoWeAre() {
  const content = home.whoWeAre
  const photos = {
    tall: getPhoto(content.photos.tall),
    wide: getPhoto(content.photos.wide),
    square: getPhoto(content.photos.square),
  }
  const mission = content.mission?.text ? content.mission : null
  const vision = content.vision?.text ? content.vision : null
  const layout = bentoLayout({ ...photos, mission, vision })
  const tablet = tabletSpans({ ...photos, mission, vision })

  return (
    <Section tone="white" aria-labelledby="who-we-are-heading">
      <Reveal className="max-w-2xl">
        <Eyebrow marker>{content.eyebrow}</Eyebrow>
        <Heading id="who-we-are-heading" level={2} className="mt-3">
          {content.heading.lead} <Accent>{content.heading.accent}</Accent>
        </Heading>
      </Reveal>

      <div
        className={cx(
          'mt-12 grid gap-4 sm:grid-cols-2 lg:auto-rows-[minmax(15rem,1fr)] lg:grid-cols-4 lg:gap-5',
          layout.rows,
        )}
      >
        {photos.tall && (
          <BentoPhoto photo={photos.tall} parallax className={cx('sm:col-span-2', layout.tall)} />
        )}

        {mission && (
          <Reveal className={cx(tablet.mission, layout.mission)}>
            <Card
              tone="white"
              padding="lg"
              interactive
              className="flex h-full flex-col shadow-card"
            >
              <IconRing icon={Target} size="sm" />
              <Eyebrow className="mt-5">{mission.title}</Eyebrow>
              <p className="mt-3 font-display text-h3 font-bold text-ink">{mission.text}</p>
            </Card>
          </Reveal>
        )}

        {photos.wide && <BentoPhoto photo={photos.wide} className={cx(tablet.wide, layout.wide)} />}

        {vision && (
          <Reveal className={cx(tablet.vision, layout.vision)}>
            <Card tone="navy" padding="lg" interactive className="flex h-full flex-col">
              <span className="inline-flex size-10 items-center justify-center rounded-full bg-white/10 text-white">
                <Eye aria-hidden size={18} />
              </span>
              <Eyebrow className="mt-5">{vision.title}</Eyebrow>
              <p className="mt-3 font-display text-h3 font-bold text-white">{vision.text}</p>
            </Card>
          </Reveal>
        )}

        {photos.square && (
          <BentoPhoto photo={photos.square} className={cx(tablet.square, layout.square)} />
        )}
      </div>

      {content.stats.length > 0 && (
        <RevealStagger className="mt-14 flex flex-wrap gap-x-12 gap-y-8 border-t border-line pt-10">
          {content.stats.map((stat) => (
            <RevealItem key={stat.key} className="flex min-w-56 flex-1 items-center gap-5">
              <IconRing icon={getIcon(stat.icon)} size="lg" />
              <div>
                <ChromeText className="font-display text-[clamp(2.5rem,2rem+2vw,3.5rem)] leading-none font-extrabold tracking-tight">
                  <CountUp value={stat.value} suffix={stat.suffix} />
                </ChromeText>
                <p className="mt-2 text-sm font-semibold text-body">{stat.label}</p>
              </div>
            </RevealItem>
          ))}
          <RevealItem className="flex items-center">
            <Button to={content.moreLink.to} variant="ghost" icon={ArrowRight}>
              {content.moreLink.label}
            </Button>
          </RevealItem>
        </RevealStagger>
      )}
    </Section>
  )
}
