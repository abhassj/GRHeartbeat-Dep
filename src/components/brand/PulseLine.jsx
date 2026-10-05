import { useId, useMemo, useRef, useState } from 'react'
import { motion, useInView } from 'motion/react'
import { useElementSize } from '@/hooks/useElementSize'
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe'
import { cx } from '@/lib/cx'
import { beatPositions, buildTrace } from '@/lib/ecg'
import { beatSeconds, ease, revealMargin } from '@/lib/motion'

const BLIP_CORE_PX = 22
const BLIP_GLOW_PX = 72

/**
 * The brand's ECG line. It draws itself in, then a bright blip with a soft glow travels
 * along it once per heartbeat (60 BPM by default, a resting heart rate).
 *
 * Size it with className (e.g. "h-16 w-full"); the trace is rebuilt for the real pixel
 * size so spikes keep their proportions at any width. Off-screen, the blip stops.
 * Under reduced motion the line renders fully drawn with no blip.
 *
 * Props
 * - shape: 'ecg' (PQRST) | 'spike' (the logo's trace) | 'edge' (flat, one downward spike)
 * - beats: how many complexes (evenly spaced), or an array of 0–1 positions
 * - beatWidth: px width of one complex (defaults to a size based on the line's height)
 * - amplitude: 0–1 share of the available height the spike uses
 * - baseline: 'center' | 'start' | 'end' (edge traces run along one side of the box)
 * - color, blipColor, strokeWidth, glow
 * - bpm: blip speed in beats per minute (one sweep per beat)
 * - loop: keep beating (false = one blip after drawing); blip: show the blip at all
 * - draw: 'mount' | 'view' (when scrolled into view) | 'none' (start fully drawn)
 * - drawDuration, delay (s), vertical (trace runs top → bottom)
 */
export default function PulseLine({
  shape = 'ecg',
  beats = 1,
  beatWidth,
  amplitude = 0.9,
  baseline = 'center',
  color = 'var(--color-pulse-red)',
  blipColor = 'var(--color-red-400)',
  strokeWidth = 2,
  glow = true,
  bpm = 60,
  loop = true,
  blip = true,
  draw = 'mount',
  drawDuration = 1.6,
  delay = 0,
  vertical = false,
  className,
  style,
}) {
  const reduced = useReducedMotionSafe()
  const ref = useRef(null)
  const { width, height } = useElementSize(ref)
  const inView = useInView(ref, { amount: 0 })
  const seen = useInView(ref, { once: true, amount: 0.4, margin: revealMargin })
  const [drawn, setDrawn] = useState(draw === 'none')
  const filterId = `pulse-glow-${useId().replace(/[^\w-]/g, '')}`

  const length = vertical ? height : width
  const thickness = vertical ? width : height

  const trace = useMemo(() => {
    if (!length || !thickness) return null
    // Centred traces keep the stroke inside the box; edge traces sit exactly on the edge.
    const reach = baseline === 'center' ? thickness / 2 - strokeWidth : thickness
    const origin = { center: thickness / 2, start: 0, end: thickness }[baseline]
    const positions = beatPositions(beats)
    // Auto width scales with the line's height but shrinks so beats never overlap on
    // narrow screens. An explicit beatWidth is kept (EcgEdge must match its mask).
    const autoWidth = Math.min(Math.max(56, thickness * 1.6), (length / positions.length) * 0.8)
    return buildTrace({
      length,
      positions,
      beatWidth: Math.min(beatWidth ?? autoWidth, length),
      baseline: origin,
      amplitude: reach * amplitude * (baseline === 'end' ? -1 : 1),
      shape,
      vertical,
    })
  }, [length, thickness, strokeWidth, baseline, beats, beatWidth, amplitude, shape, vertical])

  const startDraw = draw === 'mount' || (draw === 'view' && seen)
  const showBlip = blip && !reduced && drawn && inView && trace
  const period = beatSeconds(bpm)

  const stroke = {
    fill: 'none',
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  }

  return (
    <div
      ref={ref}
      aria-hidden
      className={cx('pointer-events-none relative', className)}
      style={style}
    >
      {trace && (
        <svg
          className="absolute inset-0 size-full overflow-visible"
          viewBox={`0 0 ${width} ${height}`}
          focusable="false"
        >
          {glow && (
            <defs>
              <filter id={filterId} x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation={strokeWidth * 1.6} />
              </filter>
            </defs>
          )}

          {reduced || draw === 'none' ? (
            <path d={trace.d} style={{ ...stroke, stroke: color, strokeWidth }} />
          ) : (
            <motion.path
              d={trace.d}
              style={{ ...stroke, stroke: color, strokeWidth }}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={startDraw ? { pathLength: 1, opacity: 1 } : undefined}
              transition={{
                pathLength: { duration: drawDuration, ease: ease.inOut, delay },
                opacity: { duration: 0.1, delay },
              }}
              onAnimationComplete={() => setDrawn(true)}
            />
          )}

          {showBlip && (
            <Blip
              trace={trace}
              color={color}
              blipColor={blipColor}
              strokeWidth={strokeWidth}
              filterId={glow ? filterId : null}
              period={period}
              loop={loop}
              stroke={stroke}
            />
          )}
        </svg>
      )}
    </div>
  )
}

function Blip({ trace, color, blipColor, strokeWidth, filterId, period, loop, stroke }) {
  const core = Math.min(BLIP_CORE_PX / trace.length, 0.25)
  const halo = Math.min(BLIP_GLOW_PX / trace.length, 0.4)
  // Both segments share one leading edge (the head travels 0 → 1 + halo), so the glow
  // trails behind the bright core like a comet and fully exits before the next beat.
  // It rests just off each end (EDGE) with a wide dash gap, so no zero-length dash
  // leaves a round-cap dot on the line between sweeps.
  const EDGE = 0.01
  const sweep = (len) => ({
    initial: { pathLength: len, pathSpacing: 3, pathOffset: -len - EDGE },
    animate: { pathOffset: 1 + halo - len + EDGE },
    transition: {
      duration: period * 0.92,
      ease: 'linear',
      repeat: loop ? Infinity : 0,
      repeatDelay: period * 0.08,
    },
  })

  return (
    <g>
      {filterId && (
        <motion.path
          d={trace.d}
          filter={`url(#${filterId})`}
          style={{ ...stroke, stroke: color, strokeWidth: strokeWidth * 4, opacity: 0.7 }}
          {...sweep(halo)}
        />
      )}
      <motion.path
        d={trace.d}
        style={{ ...stroke, stroke: blipColor, strokeWidth: strokeWidth * 1.6 }}
        {...sweep(core)}
      />
    </g>
  )
}
