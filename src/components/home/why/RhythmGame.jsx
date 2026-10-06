import { useEffect, useId, useRef, useState } from 'react'
import { ChevronsDown, ChevronsUp, CircleCheck, RotateCcw } from 'lucide-react'
import { home } from '@/data/home'
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe'
import { rateFromTaps, zoneFor } from '@/lib/ecg-monitor'
import { cx } from '@/lib/cx'

const IDLE_RESET_MS = 3000
const ANNOUNCE_EVERY_MS = 4000
const MAX_TAPS = 7 // keeps the last 6 intervals

// Zone feedback never relies on colour alone: each has its own icon shape and text.
const ZONE_STYLE = {
  slow: { icon: ChevronsDown, chip: 'bg-amber-50 text-amber' },
  good: { icon: CircleCheck, chip: 'bg-success text-white' },
  fast: { icon: ChevronsUp, chip: 'bg-amber-50 text-amber' },
}

/**
 * "Try the rhythm": tap (or click, or press Space/Enter while the button has focus) in time
 * with compressions. The rate is a rolling average of the last 4–6 intervals, shown with a
 * zone (too slow / on target / too fast). Results are announced politely and throttled —
 * on a zone change or every few seconds, never per tap. No sound. Resets after 3 s idle.
 * Keys are never captured globally.
 */
export default function RhythmGame({ tapsRef, onRateChange }) {
  const copy = home.whyItMatters.game
  const target = home.whyItMatters.monitor.targetBpm
  const reduced = useReducedMotionSafe()
  const hintId = useId()
  const button = useRef(null)
  const idleTimer = useRef(0)
  const lastAnnounce = useRef({ zone: null, at: 0 })
  const [reading, setReading] = useState({ bpm: null, zone: null, needed: null })
  const [announcement, setAnnouncement] = useState('')

  const reset = () => {
    clearTimeout(idleTimer.current)
    tapsRef.current = []
    lastAnnounce.current = { zone: null, at: 0 }
    setReading({ bpm: null, zone: null, needed: null })
    setAnnouncement('')
    onRateChange(null)
  }

  useEffect(() => () => clearTimeout(idleTimer.current), [])

  // `at` is the event timestamp (same clock as performance.now()), so taps that queue up
  // behind a busy main thread still keep their real spacing.
  const tap = (at) => {
    const now = at ?? performance.now()
    const taps = tapsRef.current
    if (taps.length && now - taps.at(-1) > IDLE_RESET_MS) taps.length = 0
    taps.push(now)
    if (taps.length > MAX_TAPS) taps.splice(0, taps.length - MAX_TAPS)

    const { bpm, needed } = rateFromTaps(taps)
    const zone = bpm == null ? null : zoneFor(bpm, target)
    setReading({ bpm, zone, needed })
    onRateChange(bpm)

    if (zone) {
      const last = lastAnnounce.current
      if (zone !== last.zone || now - last.at > ANNOUNCE_EVERY_MS) {
        lastAnnounce.current = { zone, at: now }
        setAnnouncement(copy.announce(bpm, copy.zones[zone]))
      }
    }

    if (!reduced) {
      button.current?.animate(
        [{ transform: 'scale(1)' }, { transform: 'scale(0.94)' }, { transform: 'scale(1)' }],
        { duration: 180, easing: 'ease-out' },
      )
    }

    clearTimeout(idleTimer.current)
    idleTimer.current = setTimeout(reset, IDLE_RESET_MS)
  }

  const onPointerDown = (event) => {
    if (event.button !== 0) return
    tap(event.timeStamp)
  }

  const onKeyDown = (event) => {
    if (event.key !== ' ' && event.key !== 'Enter') return
    event.preventDefault() // no page scroll, no synthetic click
    if (!event.repeat) tap(event.timeStamp)
  }

  const zoneCopy = reading.zone ? copy.zones[reading.zone] : null
  const ZoneIcon = reading.zone ? ZONE_STYLE[reading.zone].icon : null
  const status =
    reading.bpm != null ? null : reading.needed != null ? copy.warming(reading.needed) : copy.idle

  return (
    <div className="shrink-0 rounded-card border border-white/10 bg-grey-900/80 p-5 sm:p-6">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
        <button
          ref={button}
          type="button"
          aria-label={copy.tapAriaLabel}
          aria-describedby={hintId}
          onPointerDown={onPointerDown}
          onKeyDown={onKeyDown}
          className="flex size-24 shrink-0 touch-manipulation items-center justify-center self-center rounded-full bg-pulse-red font-display text-xl font-extrabold text-white shadow-card-hover transition-colors select-none hover:bg-red-600 active:bg-crimson sm:self-auto"
        >
          {copy.tapLabel}
        </button>

        <div className="min-w-0 flex-1">
          <h3 className="font-display text-h4 font-bold text-white">{copy.heading}</h3>
          <p id={hintId} className="mt-1 text-sm text-grey-200">
            {copy.hint}
          </p>
          <div className="mt-3 flex min-h-9 flex-wrap items-center gap-3">
            {reading.bpm != null ? (
              <>
                <span className="font-mono text-2xl font-bold text-white tabular-nums">
                  {reading.bpm}
                  <span className="ml-1 text-xs font-semibold text-grey-200">
                    {home.whyItMatters.monitor.bpmUnit}
                  </span>
                </span>
                <span
                  className={cx(
                    'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-semibold',
                    ZONE_STYLE[reading.zone].chip,
                  )}
                >
                  <ZoneIcon aria-hidden size={16} />
                  {zoneCopy.label}: {zoneCopy.advice}
                </span>
              </>
            ) : (
              <span className="text-sm font-medium text-grey-200">{status}</span>
            )}
            <button
              type="button"
              onClick={reset}
              className="ml-auto inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold text-grey-200 hover:bg-white/10 hover:text-white"
            >
              <RotateCcw aria-hidden size={14} />
              {copy.resetLabel}
            </button>
          </div>
        </div>
      </div>
      <p className="mt-4 border-t border-white/10 pt-3 text-xs text-grey-200">{copy.disclaimer}</p>
      <p aria-live="polite" className="sr-only">
        {announcement}
      </p>
    </div>
  )
}
