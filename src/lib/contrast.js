// WCAG 2.1 contrast helpers (used by /styleguide to label colour pairs).

const channel = (c) => {
  const v = c / 255
  return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4
}

/** Parse "rgb(r, g, b)" / "rgb(r g b)" / "#rrggbb" into [r, g, b]. */
export function parseColour(value) {
  const v = value.trim()
  if (v.startsWith('#')) {
    const hex = v.length === 4 ? [...v.slice(1)].map((c) => c + c).join('') : v.slice(1, 7)
    return [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16))
  }
  return (v.match(/[\d.]+/g) ?? []).slice(0, 3).map(Number)
}

export const toHex = ([r, g, b]) =>
  `#${[r, g, b].map((n) => Math.round(n).toString(16).padStart(2, '0')).join('')}`.toUpperCase()

export function luminance([r, g, b]) {
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b)
}

export function contrastRatio(a, b) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (hi + 0.05) / (lo + 0.05)
}

export function rating(ratio) {
  if (ratio >= 7) return 'AAA'
  if (ratio >= 4.5) return 'AA'
  if (ratio >= 3) return 'AA large / UI'
  return 'Fail'
}
