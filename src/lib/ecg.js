// ECG trace geometry shared by PulseLine, EcgDivider and EcgEdge.
// Shapes are points in unit space: x runs 0 → 1 across one beat, y runs −1 (up) → 1 (down).

const wave = (from, to, peak, steps = 8) =>
  Array.from({ length: steps + 1 }, (_, i) => {
    const t = i / steps
    return [from + (to - from) * t, -peak * Math.sin(Math.PI * t)]
  })

export const SHAPES = {
  // Clinical PQRST complex.
  ecg: [
    [0, 0],
    ...wave(0.14, 0.3, 0.14),
    [0.36, 0],
    [0.4, 0.14],
    [0.46, -1],
    [0.52, 0.42],
    [0.56, 0],
    [0.62, 0],
    ...wave(0.62, 0.86, 0.24, 10),
    [1, 0],
  ],
  // The logo's trace: a small flick, one tall spike up, one deep spike down.
  spike: [
    [0, 0],
    [0.18, 0],
    [0.26, -0.28],
    [0.32, 0.22],
    [0.46, -1],
    [0.6, 0.9],
    [0.7, 0],
    [1, 0],
  ],
  // Edge of a band: flat, one sharp spike downward, flat. y stays in 0 → 1.
  edge: [
    [0, 0],
    [0.3, 0],
    [0.44, 1],
    [0.58, 0],
    [1, 0],
  ],
}

const dist = ([x1, y1], [x2, y2]) => Math.hypot(x2 - x1, y2 - y1)

/** Evenly spaced beat centres for a count, or pass an array of 0–1 positions through. */
export const beatPositions = (beats) =>
  Array.isArray(beats) ? beats : Array.from({ length: beats }, (_, i) => (i + 0.5) / beats)

/**
 * Build a trace across `length` px with beats centred at `positions` (0–1).
 * `baseline` and `amplitude` are in px across the trace's thickness.
 * Returns the SVG path, its exact length and its points.
 */
export function buildTrace({
  length,
  positions,
  beatWidth,
  baseline,
  amplitude,
  shape = 'ecg',
  vertical = false,
}) {
  const unit = SHAPES[shape]
  const points = [[0, baseline]]

  for (const centre of [...positions].sort((a, b) => a - b)) {
    const start = Math.min(Math.max(centre * length - beatWidth / 2, 0), length - beatWidth)
    for (const [ux, uy] of unit) points.push([start + ux * beatWidth, baseline + uy * amplitude])
  }
  points.push([length, baseline])

  const ordered = points.map(([a, b]) => (vertical ? [b, a] : [a, b]))
  const d = ordered.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(2)} ${y.toFixed(2)}`).join(' ')
  const total = ordered.reduce((sum, p, i) => (i ? sum + dist(ordered[i - 1], p) : 0), 0)

  return { d, length: total, points: ordered }
}

/** Filled spike for EcgEdge masks: the region between the edge line and the trace. */
export function edgeSpikeSvg({ width, depth, side = 'bottom' }) {
  const pts = SHAPES.edge.map(([ux, uy]) => [ux * width, uy * depth])
  const oriented = side === 'left' ? pts.map(([a, b]) => [depth - b, a]) : pts
  const [w, h] = side === 'left' ? [depth, width] : [width, depth]
  const poly = oriented.map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`).join(' ')
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><polygon points="${poly}" fill="black"/></svg>`
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`
}
