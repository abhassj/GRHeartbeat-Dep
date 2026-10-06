import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { m, useInView } from 'motion/react'
import { useElementSize } from '@/hooks/useElementSize'
import { useLoopGate } from '@/hooks/useLoops'
import { useMotionPaused, useReducedMotionSafe } from '@/hooks/useReducedMotionSafe'
import { cx } from '@/lib/cx'
import { beatPositions, buildTrace } from '@/lib/ecg'
import { HEARTBEAT_S, sweepStartDelay } from '@/lib/heartbeat'
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
 * - sync: beat on the shared 5 s heartbeat clock instead (lib/heartbeat.js): the blip crosses
 *   the first spike exactly when the HeartbeatButton glows; sweep (s) sets its travel time
 * Loops go through the loop arbiter (loopGroup names the group; one group animates at a time)
 * and stop while the visitor has paused motion.
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
  sync = false,
  sweep,
  loopGroup,
  className,
  style,
}) {
  const reduced = useReducedMotionSafe()
  const paused = useMotionPaused()
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

  // The blip starts once the line has drawn in. A timer over the known draw time is used
  // rather than onAnimationComplete, which does not fire reliably for this path animation.
  useEffect(() => {
    if (drawn || !startDraw || !trace) return
    const timer = setTimeout(() => setDrawn(true), (delay + drawDuration) * 1000 + 50)
    return () => clearTimeout(timer)
  }, [drawn, startDraw, trace, delay, drawDuration])

  // A repeating blip is a decorative loop: it only runs while the loop arbiter gives its
  // group the turn (lib/loops.js). One-off blips (loop=false, e.g. dividers) are not gated.
  const looping = blip && loop && !reduced && drawn
  const turn = useLoopGate(ref, { group: loopGroup, active: looping })
  const showBlip = blip && !reduced && !paused && drawn && inView && trace && (!loop || turn)
  const period = sync ? HEARTBEAT_S : beatSeconds(bpm)
  const travel = Math.min(sweep ?? period * 0.92, period)
  const spikeAt = sync ? (beatPositions(beats)[0] ?? 0.5) : null

  const stroke = {
    fill: 'none',
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  }

  return (
    <div
      ref={ref}
      data-loop={looping ? (loopGroup ?? 'pulse') : undefined}
      data-running={looping ? String(Boolean(showBlip)) : undefined}
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
            <m.path
              d={trace.d}
              style={{ ...stroke, stroke: color, strokeWidth }}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={startDraw ? { pathLength: 1, opacity: 1 } : undefined}
              transition={{
                pathLength: { duration: drawDuration, ease: ease.inOut, delay },
                opacity: { duration: 0.1, delay },
              }}
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
              travel={travel}
              spikeAt={spikeAt}
              loop={loop}
              stroke={stroke}
            />
          )}
        </svg>
      )}
    </div>
  )
}

function Blip({
  trace,
  color,
  blipColor,
  strokeWidth,
  filterId,
  period,
  travel,
  spikeAt,
  loop,
  stroke,
}) {
  const core = Math.min(BLIP_CORE_PX / trace.length, 0.25)
  const halo = Math.min(BLIP_GLOW_PX / trace.length, 0.4)
  // Synced blips wait until their spike crossing lands on the heartbeat (cycle phase 0).
  // The head covers 1 + halo of the path per sweep, so it reaches `spikeAt` at that share.
  const [startDelay] = useState(() =>
    spikeAt == null ? 0 : sweepStartDelay(travel, (travel * spikeAt) / (1 + halo)),
  )
  // Both segments share one leading edge (the head travels 0 → 1 + halo of the path), so the
  // glow trails behind the bright core like a comet and fully exits before the next beat.
  // Dashes are in px (the trace length is known exactly) and only stroke-dashoffset animates.
  // A dash gap of 3 path lengths means no second dash ever wraps into view, and resting just
  // off each end (EDGE) means no zero-length dash leaves a round-cap dot between sweeps.
  const L = trace.length
  const EDGE = 0.01
  const sweep = (len, style) => ({
    style: { ...stroke, ...style, strokeDasharray: `${len * L} ${3 * L}` },
    initial: { strokeDashoffset: (len + EDGE) * L },
    animate: { strokeDashoffset: -(1 + halo - len + EDGE) * L },
    transition: {
      duration: travel,
      ease: 'linear',
      delay: startDelay,
      repeat: loop ? Infinity : 0,
      repeatDelay: period - travel,
    },
  })

  return (
    <g>
      {filterId && (
        <m.path
          d={trace.d}
          filter={`url(#${filterId})`}
          {...sweep(halo, { stroke: color, strokeWidth: strokeWidth * 4, opacity: 0.7 })}
        />
      )}
      <m.path d={trace.d} {...sweep(core, { stroke: blipColor, strokeWidth: strokeWidth * 1.6 })} />
    </g>
  )
}
