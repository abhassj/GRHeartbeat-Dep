import { motion } from 'motion/react'
import Accent from '@/components/ui/Accent'
import Heading from '@/components/ui/Heading'
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe'
import { dur, ease } from '@/lib/motion'

const WORD_STAGGER = 0.06

/**
 * The hero's display headline: `motto.lead` in ink, `motto.accent` in Pulse Red italic.
 * Each word slides up out of a mask, 0.06 s apart. Static under reduced motion.
 */
export default function HeroHeadline({ id, motto }) {
  const reduced = useReducedMotionSafe()
  const words = [
    ...motto.lead.split(' ').map((word) => ({ word, accent: false })),
    ...motto.accent.split(' ').map((word) => ({ word, accent: true })),
  ]

  return (
    <Heading id={id} level={1} display className="mt-5">
      {words.map(({ word, accent }, index) => {
        const inner = accent ? <Accent>{word}</Accent> : word
        return (
          <span key={index}>
            <span className="-mb-[0.12em] inline-block overflow-hidden pr-[0.04em] pb-[0.12em] align-bottom">
              {reduced ? (
                <span className="inline-block">{inner}</span>
              ) : (
                <motion.span
                  className="inline-block"
                  initial={{ y: '110%' }}
                  animate={{ y: '0%' }}
                  transition={{
                    duration: dur.slow,
                    ease: ease.out,
                    delay: 0.15 + index * WORD_STAGGER,
                  }}
                >
                  {inner}
                </motion.span>
              )}
            </span>
            {index < words.length - 1 && ' '}
          </span>
        )
      })}
    </Heading>
  )
}
