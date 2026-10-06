import { useEffect, useRef } from 'react'
import MotionPauseButton from '@/components/motion/MotionPauseButton'
import { home } from '@/data/home'
import { useElementSize } from '@/hooks/useElementSize'
import { useLoopGate } from '@/hooks/useLoops'
import { useMotionPaused, useReducedMotionSafe } from '@/hooks/useReducedMotionSafe'
import { steadyBeats, traceAt } from '@/lib/ecg-monitor'

// Seconds for the trace to cross the screen: scaled to the width so beats keep a natural
// spacing (about 110 px of trace per second) on phones and desktops alike.
const sweepFor = (width) => Math.min(4.5, Math.max(2.4, width / 110))
const GAP_PX = 22 // erase bar ahead of the trace, like a bedside monitor
const TAP_MODE_MS = 3000 // follow the visitor's taps until they stop for this long

const traceColour = () =>
  getComputedStyle(document.documentElement).getPropertyValue('--color-red-400').trim() || '#ff5a61'

function setupCanvas(canvas, width, height) {
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  canvas.width = Math.round(width * dpr)
  canvas.height = Math.round(height * dpr)
  const ctx = canvas.getContext('2d')
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  const colour = traceColour()
  ctx.strokeStyle = colour
  ctx.shadowColor = colour
  ctx.shadowBlur = 6
  ctx.lineWidth = 2
  ctx.lineJoin = 'round'
  ctx.lineCap = 'round'
  return ctx
}

/** A full static strip at the auto rate (reduced motion, and the first frame). */
function drawStatic(ctx, width, height, bpm) {
  const baseline = height * 0.6
  const amp = height * 0.42
  const span = sweepFor(width)
  const beats = steadyBeats(0, span, bpm, 0.35)
  ctx.clearRect(0, 0, width, height)
  ctx.beginPath()
  for (let x = 0; x <= width; x += 2) {
    const y = baseline - traceAt((x / width) * span, beats) * amp
    if (x === 0) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
  }
  ctx.stroke()
}

/**
 * CPR rhythm monitor: an ECG trace sweeping across a monitor grid at 110 BPM (or at the
 * visitor's tapped rate while the game is in use), with a chest-and-hands figure that
 * compresses on every beat. A decorative loop: it runs only with the loop turn (on screen,
 * no larger loop visible), never while paused, and is a static strip under reduced motion.
 */
export default function RhythmMonitor({ tapsRef, tapBpm }) {
  const copy = home.whyItMatters.monitor
  const reduced = useReducedMotionSafe()
  const paused = useMotionPaused()
  const frame = useRef(null)
  const area = useRef(null)
  const canvas = useRef(null)
  const figure = useRef(null)
  const { width, height } = useElementSize(area)
  const turn = useLoopGate(frame, { group: 'monitor', active: !reduced })
  const running = turn && !paused && !reduced

  // Static strip whenever the trace is not animating (and as the starting picture).
  useEffect(() => {
    if (running || !width || !height) return
    const ctx = setupCanvas(canvas.current, width, height)
    drawStatic(ctx, width, height, copy.autoBpm)
  }, [running, width, height, copy.autoBpm])

  // The live sweep.
  useEffect(() => {
    if (!running || !width || !height) return
    const ctx = setupCanvas(canvas.current, width, height)
    const baseline = height * 0.6
    const amp = height * 0.42
    const sweep = sweepFor(width)
    const xAt = (t) => ((t % sweep) / sweep) * width
    let lastT = null
    let raf = 0

    const pulseFigure = () =>
      figure.current?.animate(
        [{ transform: 'scaleY(1)' }, { transform: 'scaleY(0.92)' }, { transform: 'scaleY(1)' }],
        { duration: 260, easing: 'ease-out' },
      )

    const tick = (nowMs) => {
      const t = nowMs / 1000
      if (lastT === null) {
        ctx.clearRect(0, 0, width, height)
        lastT = t
        raf = requestAnimationFrame(tick)
        return
      }
      const taps = tapsRef.current
      const tapMode = taps.length > 0 && nowMs - taps.at(-1) < TAP_MODE_MS
      const beats = tapMode ? taps.map((ms) => ms / 1000) : steadyBeats(lastT, t, copy.autoBpm)

      // Erase bar just ahead of the head.
      const head = xAt(t)
      ctx.clearRect(head, 0, GAP_PX, height)
      if (head + GAP_PX > width) ctx.clearRect(0, 0, head + GAP_PX - width, height)

      // New segment since the last frame, sampled every ~2px.
      const dx = (head - xAt(lastT) + width) % width
      const steps = Math.max(1, Math.ceil(dx / 2))
      ctx.beginPath()
      let prevX = xAt(lastT)
      ctx.moveTo(prevX, baseline - traceAt(lastT, beats) * amp)
      for (let i = 1; i <= steps; i += 1) {
        const ti = lastT + ((t - lastT) * i) / steps
        const x = xAt(ti)
        const y = baseline - traceAt(ti, beats) * amp
        if (x < prevX) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
        prevX = x
      }
      ctx.stroke()

      if (beats.some((beat) => beat > lastT && beat <= t)) pulseFigure()
      lastT = t
      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [running, width, height, tapsRef, copy.autoBpm])

  const showTapRate = tapBpm != null
  return (
    <div
      ref={frame}
      data-loop="monitor"
      data-running={String(running)}
      className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-card border border-white/10 bg-grey-900/80 shadow-card-hover"
    >
      <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3 sm:px-5">
        <div className="flex min-w-0 items-center gap-3">
          <svg
            ref={figure}
            aria-hidden
            viewBox="0 0 48 40"
            className="hidden h-9 w-11 shrink-0 origin-bottom text-grey-200 sm:block"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* Torso outline with two stacked hands on the centre of the chest */}
            <path d="M5 38c0-9 8-15 19-15s19 6 19 15" />
            <rect x="16.5" y="16" width="15" height="8" rx="3" stroke="var(--color-red-400)" />
            <rect x="19" y="10" width="10" height="7" rx="3" stroke="var(--color-red-400)" />
          </svg>
          <p className="truncate text-xs font-bold tracking-[0.12em] whitespace-nowrap text-grey-200 uppercase">
            <span
              aria-hidden
              className="mr-2 inline-block size-2 rounded-full bg-red-400 align-middle"
            />
            {showTapRate ? copy.tapModeLabel : copy.label}
          </p>
        </div>
        <p className="shrink-0 text-right whitespace-nowrap">
          {reduced ? (
            <span className="font-mono text-lg font-bold text-red-400 sm:text-2xl">
              {copy.targetLabel}
            </span>
          ) : (
            <>
              <span className="font-mono text-3xl leading-none font-bold text-red-400 tabular-nums sm:text-4xl">
                {showTapRate ? tapBpm : copy.autoBpm}
              </span>
              <span className="ml-1.5 text-xs font-semibold text-grey-200">{copy.bpmUnit}</span>
            </>
          )}
        </p>
      </div>
      <div ref={area} className="relative min-h-0 flex-1 bg-monitor-grid">
        <canvas ref={canvas} aria-hidden className="absolute inset-0 size-full" />
        <p className="sr-only">{copy.ariaLabel}</p>
        {/* Inline pause control (WCAG 2.2.2), so no floating control covers the monitor. */}
        {!reduced && <MotionPauseButton className="absolute right-3 bottom-3 size-10" />}
      </div>
    </div>
  )
}
