/*
 * One shared heartbeat clock. Every decorative loop that "beats" (the hero ECG seam, the
 * HeartbeatButton lub-dub glow, the scroll cue) aligns to the same 5 s cycle, so a screen
 * beats once — never several times out of step.
 *
 * Phase 0 of the cycle is the beat itself: the glow's first pulse and the moment the ECG
 * blip crosses its spike.
 */
export const HEARTBEAT_S = 5
const CYCLE_MS = HEARTBEAT_S * 1000

/** Milliseconds into the current cycle (0 … 4999), on the page's shared timeline. */
export const cyclePhaseMs = () => performance.now() % CYCLE_MS

/** Negative CSS animation-delay that lines a 5 s CSS animation up with the shared cycle. */
export const cssCycleDelay = () => `${-Math.round(cyclePhaseMs())}ms`

/**
 * Seconds to wait before starting a repeating sweep of `sweepS` seconds so that, `atS`
 * seconds into each sweep (when the blip reaches the spike), the cycle is at phase 0.
 */
export function sweepStartDelay(sweepS, atS) {
  const target = (CYCLE_MS - atS * 1000 + CYCLE_MS) % CYCLE_MS
  return ((((target - cyclePhaseMs()) % CYCLE_MS) + CYCLE_MS) % CYCLE_MS) / 1000
}
