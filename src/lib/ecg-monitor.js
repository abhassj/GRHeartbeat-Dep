// Cardiac-monitor trace maths for the CPR rhythm monitor (canvas). Times are in seconds.

// One PQRST complex as a sum of Gaussians: [offset from the R peak (s), amplitude, width (s)].
// Positive amplitude = upwards on screen.
const COMPLEX = [
  [-0.17, 0.12, 0.025], // P
  [-0.035, -0.14, 0.009], // Q
  [0, 1, 0.012], // R
  [0.035, -0.32, 0.011], // S
  [0.22, 0.26, 0.04], // T
]

/** Height (-0.35 … 1) of the trace `dt` seconds after a beat's R peak. */
export function complexAt(dt) {
  if (dt < -0.3 || dt > 0.4) return 0
  let y = 0
  for (const [offset, amp, width] of COMPLEX) {
    const x = (dt - offset) / width
    y += amp * Math.exp(-0.5 * x * x)
  }
  return y
}

/** Trace height at time `t` for the given beat times (only nearby beats matter). */
export function traceAt(t, beats) {
  let y = 0
  for (const beat of beats) {
    const dt = t - beat
    if (dt > -0.3 && dt < 0.4) y += complexAt(dt)
  }
  return y
}

/** Beat times for a steady rate between t0 and t1 (inclusive margins for the waveform). */
export function steadyBeats(t0, t1, bpm, origin = 0) {
  const interval = 60 / bpm
  const first = Math.floor((t0 - 0.4 - origin) / interval)
  const last = Math.ceil((t1 + 0.3 - origin) / interval)
  const beats = []
  for (let k = first; k <= last; k += 1) beats.push(origin + k * interval)
  return beats
}

/** Average rate (BPM) from the last `max` intervals of a list of tap times (ms). */
export function rateFromTaps(taps, { min = 4, max = 6 } = {}) {
  const intervals = []
  for (let i = taps.length - 1; i > 0 && intervals.length < max; i -= 1) {
    intervals.push(taps[i] - taps[i - 1])
  }
  if (intervals.length < min) return { bpm: null, needed: min - intervals.length }
  const avg = intervals.reduce((sum, ms) => sum + ms, 0) / intervals.length
  return { bpm: Math.round(60000 / avg), needed: 0 }
}

/** 'slow' | 'good' | 'fast' for a rate against the target range [low, high]. */
export const zoneFor = (bpm, [low, high]) => (bpm < low ? 'slow' : bpm > high ? 'fast' : 'good')
