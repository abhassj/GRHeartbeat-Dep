import {
  ArrowRight,
  Award,
  CalendarCheck,
  Flame,
  HeartPulse,
  Mail,
  MessageCircle,
  Phone,
  ShieldCheck,
  Users,
} from 'lucide-react'

import landscape from '@/assets/placeholders/photo-landscape.svg'
import portrait from '@/assets/placeholders/photo-portrait.svg'
import EcgDivider from '@/components/brand/EcgDivider'
import EcgEdge from '@/components/brand/EcgEdge'
import HeartbeatButton from '@/components/brand/HeartbeatButton'
import Logo from '@/components/brand/Logo'
import PulseLine from '@/components/brand/PulseLine'
import ChromeText from '@/components/motion/ChromeText'
import CountUp from '@/components/motion/CountUp'
import ImageReveal from '@/components/motion/ImageReveal'
import Parallax from '@/components/motion/Parallax'
import Reveal from '@/components/motion/Reveal'
import RevealStagger, { RevealItem } from '@/components/motion/RevealStagger'
import ScrollProgress from '@/components/motion/ScrollProgress'
import TiltCard from '@/components/motion/TiltCard'
import Demo from '@/components/styleguide/Demo'
import FontCheck from '@/components/styleguide/FontCheck'
import MotionToggle from '@/components/styleguide/MotionToggle'
import SgSection from '@/components/styleguide/SgSection'
import { ContrastTable, SwatchGroup } from '@/components/styleguide/Swatches'
import Accent from '@/components/ui/Accent'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Container from '@/components/ui/Container'
import Eyebrow from '@/components/ui/Eyebrow'
import Heading from '@/components/ui/Heading'
import IconRing from '@/components/ui/IconRing'
import Section from '@/components/ui/Section'

import { styleguide } from '@/data/styleguide'
import { dur, ease, stagger } from '@/lib/motion'

const { sample } = styleguide

const chapters = [
  ['brand', 'Brand'],
  ['colour', 'Colour'],
  ['type', 'Typography'],
  ['buttons', 'Buttons'],
  ['elements', 'Elements'],
  ['tones', 'Section tones'],
  ['pulse', 'Pulse line'],
  ['motion', 'Motion'],
]

const icons = [HeartPulse, ShieldCheck, Flame, Award, Users, CalendarCheck]

export default function Styleguide() {
  return (
    <div className="pb-32">
      <title>Design system | GR Heartbeat</title>
      <meta name="robots" content="noindex, nofollow" />
      <ScrollProgress />
      <MotionToggle />

      <header className="pt-16 pb-12 sm:pt-24">
        <Container>
          <Eyebrow marker>Internal · not linked</Eyebrow>
          <Heading level={1} className="mt-3">
            {styleguide.title}
          </Heading>
          <p className="mt-4 max-w-2xl text-lead">{styleguide.intro}</p>
          <nav aria-label="Styleguide sections" className="mt-8 flex flex-wrap gap-2">
            {chapters.map(([id, label]) => (
              <a
                key={id}
                href={`#${id}`}
                className="rounded-full border border-line bg-surface px-4 py-2 text-sm font-semibold text-ink transition-colors hover:border-grey-300 hover:text-pulse-red"
              >
                {label}
              </a>
            ))}
          </nav>
        </Container>
      </header>

      <SgSection id="brand" index={1} title="Brand">
        <div className="grid gap-6 lg:grid-cols-2">
          <Demo title="Logo on white" note="Cropped and resized from the master; WebP, 34 KB.">
            <Logo className="w-full max-w-md" />
          </Demo>
          <Demo
            title="Logo chip on slate"
            note="Footer treatment until a reversed SVG exists."
            bodyClassName="bg-slate"
          >
            <span className="inline-flex rounded-2xl bg-white px-5 py-3 shadow-card">
              <Logo className="h-12 w-auto" />
            </span>
          </Demo>
        </div>
      </SgSection>

      <SgSection id="colour" index={2} title="Colour">
        <div className="space-y-10">
          {styleguide.colourGroups.map((group) => (
            <SwatchGroup key={group.title} {...group} />
          ))}
          <div>
            <p className="mb-3 text-sm font-semibold text-ink">
              Contrast (computed live from the tokens)
            </p>
            <ContrastTable pairs={styleguide.contrastPairs} />
          </div>
          <div className="grid gap-6 sm:grid-cols-3">
            <Demo title="Chrome gradient" note="Thin things only: rings, numbers, 1px rules.">
              <div className="h-2 rounded-full bg-chrome" />
              <div className="mt-4 h-px bg-chrome" />
            </Demo>
            <Demo title="Red gradient" note="Final CTA band accents.">
              <div className="h-12 rounded-xl bg-(image:--gradient-red)" />
            </Demo>
            <Demo title="Monitor grid" bodyClassName="bg-monitor-grid h-28">
              <span className="sr-only">Monitor grid sample</span>
            </Demo>
          </div>
        </div>
      </SgSection>

      <SgSection id="type" index={3} title="Typography">
        <div className="space-y-6">
          <Demo
            title="Display · Montserrat 800, clamp 40 → 72px, leading 1.05"
            note="One phrase in Pulse Red, set in true 800 italic like the logo."
          >
            <Heading level={1} display>
              {sample.displayLead} <Accent>{sample.displayAccent}</Accent>
            </Heading>
          </Demo>
          <Demo title="Headings h1–h4">
            <div className="space-y-4">
              <Heading level={1}>Heading one</Heading>
              <Heading level={2}>Heading two</Heading>
              <Heading level={3}>Heading three</Heading>
              <Heading level={4}>Heading four</Heading>
            </div>
          </Demo>
          <Demo title="Eyebrow, lead, body">
            <Eyebrow marker>{sample.eyebrow}</Eyebrow>
            <p className="mt-3 max-w-2xl text-lead text-ink">{sample.lead}</p>
            <p className="mt-4 max-w-2xl">{sample.body}</p>
          </Demo>
          <Demo
            title="Font files"
            note="Upright vs italic at 800. With font-synthesis: none, the italic can only slant if the real italic file loaded (look at the a, e and t)."
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <p className="font-display text-5xl font-extrabold text-ink">Heartbeat</p>
              <p className="font-display text-5xl font-extrabold text-ink italic">Heartbeat</p>
            </div>
            <div className="mt-6">
              <FontCheck />
            </div>
          </Demo>
        </div>
      </SgSection>

      <SgSection id="buttons" index={4} title="Buttons">
        <div className="space-y-6">
          {['primary', 'secondary', 'ghost'].map((variant) => (
            <Demo key={variant} title={`${variant[0].toUpperCase()}${variant.slice(1)}`}>
              <div className="flex flex-wrap items-center gap-3">
                {['sm', 'md', 'lg'].map((size) => (
                  <Button key={size} variant={variant} size={size} icon={ArrowRight}>
                    Button {size}
                  </Button>
                ))}
                <Button variant={variant} iconStart={Phone}>
                  Leading icon
                </Button>
                <Button variant={variant} disabled>
                  Disabled
                </Button>
                <Button variant={variant} to="/styleguide#buttons">
                  As router link
                </Button>
              </div>
            </Demo>
          ))}
          <Demo title="White on red" bodyClassName="bg-pulse-red">
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="white" iconStart={Phone}>
                Call
              </Button>
              <Button variant="white" iconStart={MessageCircle}>
                WhatsApp
              </Button>
              <Button variant="white" iconStart={Mail} size="lg">
                Email
              </Button>
            </div>
          </Demo>
          <Demo
            title="HeartbeatButton"
            note="Lub-dub glow (two beats, then rest) + magnetic pull ≤ 6px with a mouse. Hero and final CTA only."
          >
            <div className="flex flex-wrap items-center gap-6">
              <HeartbeatButton to="/styleguide#buttons" icon={ArrowRight}>
                Explore courses
              </HeartbeatButton>
            </div>
          </Demo>
          <Demo
            title="HeartbeatButton · white on red"
            bodyClassName="bg-pulse-red"
            note="The glow switches to white on red bands."
          >
            <HeartbeatButton variant="white" iconStart={Phone}>
              Call us
            </HeartbeatButton>
          </Demo>
        </div>
      </SgSection>

      <SgSection id="elements" index={5} title="Elements">
        <div className="space-y-6">
          <Demo title="Badges">
            <div className="flex flex-wrap items-center gap-3">
              <Badge tone="red">First aid</Badge>
              <Badge tone="red">NQF 2</Badge>
              <Badge tone="amber" dot>
                Coming soon
              </Badge>
              <Badge tone="navy">1 day</Badge>
              <Badge tone="success" icon={ShieldCheck}>
                Accredited
              </Badge>
              <Badge tone="chrome" icon={Award}>
                Accreditation badge
              </Badge>
            </div>
          </Demo>
          <Demo
            title="IconRing"
            note="2px chrome ring. Navy by default; numbers for process steps."
          >
            <div className="flex flex-wrap items-center gap-4">
              <IconRing icon={HeartPulse} size="sm" />
              <IconRing icon={ShieldCheck} />
              <IconRing icon={Flame} size="lg" colour="red" />
              <IconRing size="md">1</IconRing>
              <IconRing size="lg">02</IconRing>
            </div>
          </Demo>
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <IconRing icon={HeartPulse} />
              <Heading level={3} className="mt-5">
                {sample.cardTitle}
              </Heading>
              <p className="mt-2">{sample.cardText}</p>
            </Card>
            <Card interactive as="a" href="#elements" className="block">
              <Badge tone="red">Interactive</Badge>
              <Heading level={3} className="mt-4 transition-colors group-hover:text-pulse-red">
                {sample.cardTitle}
              </Heading>
              <p className="mt-2">{sample.cardText}</p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-pulse-red">
                View{' '}
                <ArrowRight
                  aria-hidden
                  size={16}
                  className="transition-transform group-hover:translate-x-1"
                />
              </span>
            </Card>
            <Card tone="navy">
              <Eyebrow>Navy card</Eyebrow>
              <Heading level={3} className="mt-3">
                {sample.cardTitle}
              </Heading>
              <p className="mt-2 text-grey-200">The only navy block on a page (the Vision card).</p>
            </Card>
          </div>
        </div>
      </SgSection>

      <SgSection id="tones" index={6} title="Section tones" flush>
        <p className="mb-6 max-w-2xl">
          Each tone sets the background and the colours of headings, eyebrows and accents inside it.
          Monitor is shown as an inset 24px panel.
        </p>
      </SgSection>
      <div className="space-y-4">
        {['white', 'surface', 'monitor', 'red', 'slate'].map((tone) => (
          <Section key={tone} tone={tone} spacing="compact" panel={tone === 'monitor'}>
            <Eyebrow marker>Tone · {tone}</Eyebrow>
            <Heading level={2} className="mt-3">
              Section heading with <Accent>an accent</Accent>
            </Heading>
            <p className="mt-3 max-w-2xl">{sample.lead}</p>
          </Section>
        ))}
      </div>

      <SgSection id="pulse" index={7} title="Pulse line">
        <div className="space-y-6">
          <Demo
            title="PulseLine · ecg (PQRST), 3 beats, 60 BPM"
            note="Draws in, then a glowing blip sweeps once per beat. Pauses off-screen."
            replay
          >
            <PulseLine className="h-24 w-full" beats={3} strokeWidth={2.5} />
          </Demo>
          <Demo title="PulseLine · spike (logo trace)" replay>
            <PulseLine className="h-28 w-full" shape="spike" beats={[0.35]} strokeWidth={3} />
          </Demo>
          <Demo title="On the monitor · red-400 at 110 BPM" bodyClassName="bg-monitor-grid" replay>
            <PulseLine
              className="h-32 w-full"
              beats={4}
              bpm={110}
              color="var(--color-red-400)"
              blipColor="var(--color-white)"
              strokeWidth={2.5}
            />
          </Demo>
          <div className="grid items-start gap-6 md:grid-cols-2">
            <Demo title="Navy, no loop (one blip)" replay>
              <PulseLine
                className="h-20 w-full"
                beats={2}
                color="var(--color-navy)"
                blipColor="var(--color-grey-400)"
                loop={false}
              />
            </Demo>
            <Demo title="Vertical (for rails and seams)" replay bodyClassName="flex justify-center">
              <PulseLine className="h-64 w-24" vertical beats={[0.5]} shape="spike" />
            </Demo>
          </div>
          <Demo title="EcgDivider" note="Draws once when scrolled into view.">
            <EcgDivider />
          </Demo>
          <div className="grid gap-6 lg:grid-cols-2">
            <Demo title="EcgEdge · bottom (final CTA band)" bodyClassName="bg-white p-0! sm:p-0!">
              <EcgEdge
                depth={44}
                spikeWidth={110}
                pulse
                pulseProps={{ color: 'var(--color-crimson)', loop: false }}
              >
                <div className="bg-pulse-red px-8 pt-10 pb-22 text-white">
                  <p className="font-display text-2xl font-extrabold">Band with an ECG edge</p>
                  <p className="mt-1 text-white/90">The spike pokes into the next section.</p>
                </div>
              </EcgEdge>
            </Demo>
            <Demo title="EcgEdge · left (hero video seam)" bodyClassName="p-0! sm:p-0!">
              <EcgEdge side="left" depth={36} spikeWidth={120} pulse className="h-72">
                <img src={landscape} alt="" className="size-full object-cover" />
              </EcgEdge>
            </Demo>
          </div>
        </div>
      </SgSection>

      <SgSection id="motion" index={8} title="Motion">
        <div className="space-y-6">
          <Demo title="Presets · src/lib/motion.js">
            <dl className="grid gap-4 font-mono text-sm sm:grid-cols-3">
              <div>
                <dt className="text-grey-600">ease.out</dt>
                <dd className="text-ink">[{ease.out.join(', ')}]</dd>
              </div>
              <div>
                <dt className="text-grey-600">ease.inOut</dt>
                <dd className="text-ink">[{ease.inOut.join(', ')}]</dd>
              </div>
              <div>
                <dt className="text-grey-600">stagger</dt>
                <dd className="text-ink">{stagger}s</dd>
              </div>
              <div>
                <dt className="text-grey-600">dur.fast</dt>
                <dd className="text-ink">{dur.fast}s</dd>
              </div>
              <div>
                <dt className="text-grey-600">dur.base</dt>
                <dd className="text-ink">{dur.base}s</dd>
              </div>
              <div>
                <dt className="text-grey-600">dur.slow</dt>
                <dd className="text-ink">{dur.slow}s</dd>
              </div>
            </dl>
          </Demo>
          <Demo title="Reveal" note="Fade + 24px rise at 20% in view, once." replay>
            <Reveal>
              <Eyebrow>{sample.eyebrow}</Eyebrow>
              <Heading level={2} className="mt-2">
                Revealed heading
              </Heading>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-3 max-w-2xl">{sample.body}</p>
            </Reveal>
          </Demo>
          <Demo title="RevealStagger" note="Children 0.08s apart." replay>
            <RevealStagger as="ul" className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
              {icons.map((Icon, i) => (
                <RevealItem as="li" key={i}>
                  <Card padding="sm" className="flex justify-center">
                    <IconRing icon={Icon} />
                  </Card>
                </RevealItem>
              ))}
            </RevealStagger>
          </Demo>
          <div className="grid gap-6 md:grid-cols-2">
            <Demo title="ImageReveal" note="Clip wipe + 1.15 → 1 settle." replay>
              <ImageReveal
                src={portrait}
                alt="Placeholder photo"
                className="aspect-4/5"
                width={800}
                height={1000}
              />
            </Demo>
            <Demo title="ImageReveal + parallax" note="Drifts ±8% while scrolling." replay>
              <ImageReveal
                src={portrait}
                alt="Placeholder photo"
                parallax
                className="aspect-4/5"
                width={800}
                height={1000}
              />
            </Demo>
          </div>
          <Demo title="Parallax" note="Child moves −8% → +8% of its height with scroll.">
            <div className="grid grid-cols-3 items-center gap-4">
              <Card padding="sm">
                <p className="text-sm">Static</p>
              </Card>
              <Parallax offset={20}>
                <Card padding="sm" tone="white" className="shadow-card">
                  <p className="text-sm">Parallax 20%</p>
                </Card>
              </Parallax>
              <Card padding="sm">
                <p className="text-sm">Static</p>
              </Card>
            </div>
          </Demo>
          <Demo
            title="CountUp + ChromeText"
            note="Counts over 1.6s at 40% in view; the chrome sheen sweeps once."
            replay
          >
            <RevealStagger className="grid gap-8 sm:grid-cols-3">
              {sample.stats.map((stat, i) => (
                <RevealItem key={stat.label} className="flex items-center gap-4">
                  <IconRing icon={icons[i]} />
                  <div>
                    <ChromeText className="font-display text-5xl font-extrabold tracking-tight">
                      <CountUp value={stat.value} suffix={stat.suffix} />
                    </ChromeText>
                    <p className="mt-1 text-sm">{stat.label}</p>
                  </div>
                </RevealItem>
              ))}
            </RevealStagger>
          </Demo>
          <Demo
            title="TiltCard"
            note="≤ 4° tilt and glare with a mouse; flat on touch and reduced motion."
          >
            <div className="grid gap-6 sm:grid-cols-2">
              {['South Africa', 'United Kingdom'].map((name, i) => (
                <TiltCard key={name} className="rounded-card">
                  <Card interactive tone="white" className="shadow-card">
                    <Badge tone={i ? 'amber' : 'success'} dot>
                      {i ? 'Coming soon' : 'Live'}
                    </Badge>
                    <Heading level={3} className="mt-4">
                      {name}
                    </Heading>
                    <p className="mt-2">{sample.cardText}</p>
                  </Card>
                </TiltCard>
              ))}
            </div>
          </Demo>
          <Demo
            title="ScrollProgress"
            note="Pinned to the top of this page: a 2px red line with an ECG blip at its leading edge."
          >
            <p>Scroll the page and watch the top edge of the viewport.</p>
          </Demo>
        </div>
      </SgSection>
    </div>
  )
}
