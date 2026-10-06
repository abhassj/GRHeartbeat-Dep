import { useRef } from 'react'
import { m, useScroll, useSpring, useTransform } from 'motion/react'
import { MessageCircle } from 'lucide-react'
import WhatsAppIcon from '@/components/brand/WhatsAppIcon'
import Reveal from '@/components/motion/Reveal'
import RevealStagger, { RevealItem } from '@/components/motion/RevealStagger'
import Accent from '@/components/ui/Accent'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Eyebrow from '@/components/ui/Eyebrow'
import Heading from '@/components/ui/Heading'
import IconRing from '@/components/ui/IconRing'
import Section from '@/components/ui/Section'
import { home } from '@/data/home'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe'
import { whatsappHref } from '@/lib/contact'

const number = (index) => String(index + 1).padStart(2, '0')

/** Connector that fills as the section scrolls through, with an ECG blip at its head. */
function Connector({ target, vertical }) {
  const reduced = useReducedMotionSafe()
  const { scrollYProgress } = useScroll({ target, offset: ['start 80%', 'end 60%'] })
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 })
  const fill = reduced ? 1 : progress
  // The blip rides a full-size layer translated by the progress (transform only).
  const head = useTransform(progress, (v) => `${v * 100}%`)

  return (
    <div
      aria-hidden
      className={
        vertical
          ? 'absolute top-7 bottom-7 left-7 w-0.5 bg-line'
          : 'absolute top-7 right-[12.5%] left-[12.5%] h-0.5 bg-line'
      }
    >
      <m.div
        className={
          vertical ? 'size-full origin-top bg-pulse-red' : 'size-full origin-left bg-pulse-red'
        }
        style={vertical ? { scaleY: fill } : { scaleX: fill }}
      />
      {!reduced && (
        <m.div className="absolute inset-0" style={vertical ? { y: head } : { x: head }}>
          <m.svg
            viewBox="0 0 20 12"
            className={
              vertical
                ? 'absolute top-0 -left-[9px] h-3 w-5 -translate-y-1/2 rotate-90 text-pulse-red'
                : 'absolute -top-[5px] left-0 h-3 w-5 -translate-x-1/2 text-pulse-red'
            }
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M0 6h6l2-4.5 3 9 2.5-6 1.5 1.5H20" />
          </m.svg>
        </m.div>
      )}
    </div>
  )
}

/** 4.7 How training works: four steps, then group specials (hidden while there are none). */
export default function HowItWorks() {
  const copy = home.howItWorks
  const specials = home.groupSpecials
  const steps = useRef(null)
  const desktop = useMediaQuery('(min-width: 768px)')

  return (
    <Section tone="white" aria-labelledby="how-it-works-heading">
      <Reveal className="max-w-2xl">
        <Eyebrow marker>{copy.eyebrow}</Eyebrow>
        <Heading id="how-it-works-heading" level={2} className="mt-3">
          {copy.heading.lead} <Accent>{copy.heading.accent}</Accent>
        </Heading>
      </Reveal>

      <div ref={steps} className="relative mt-14">
        <Connector target={steps} vertical={!desktop} />
        <RevealStagger as="ol" className="relative grid gap-10 md:grid-cols-4 md:gap-6">
          {copy.steps.map((step, index) => (
            <RevealItem
              as="li"
              key={step.title}
              className="flex gap-5 md:flex-col md:items-center md:text-center"
            >
              <IconRing size="md" colour="red" className="bg-white">
                {number(index)}
              </IconRing>
              <div>
                <Heading level={3} className="md:mt-2">
                  {step.title}
                </Heading>
                <p className="mt-2 max-w-xs text-[0.9375rem]">{step.text}</p>
              </div>
            </RevealItem>
          ))}
        </RevealStagger>
      </div>

      {specials.items.length > 0 && (
        <div className="mt-20">
          <Heading level={3}>{specials.heading}</Heading>
          <RevealStagger as="ul" className="mt-6 grid gap-5 md:grid-cols-3">
            {specials.items.map((item) => (
              <RevealItem as="li" key={item.offer}>
                <Card tone="surface" className="flex h-full flex-col">
                  <IconRing icon={MessageCircle} size="sm" />
                  <p className="mt-4 font-display text-h4 font-bold text-ink">{item.offer}</p>
                  <p className="mt-2 text-[0.9375rem]">{item.detail}</p>
                  {item.validity && <p className="mt-2 text-sm text-navy">{item.validity}</p>}
                  <Button
                    href={whatsappHref(specials.whatsappMessage(item.offer))}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="secondary"
                    size="sm"
                    iconStart={WhatsAppIcon}
                    className="mt-auto self-start"
                  >
                    {specials.enquireLabel}
                  </Button>
                </Card>
              </RevealItem>
            ))}
          </RevealStagger>
        </div>
      )}
    </Section>
  )
}
