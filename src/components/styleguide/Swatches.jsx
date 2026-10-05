import { useLayoutEffect, useRef, useState } from 'react'
import { contrastRatio, parseColour, rating, toHex } from '@/lib/contrast'
import { cx } from '@/lib/cx'

const WHITE = [255, 255, 255]

/** Reads the token's real computed colour, so a missing or mistyped token shows up here. */
function useTokenColour(token) {
  const ref = useRef(null)
  const [rgb, setRgb] = useState(null)
  useLayoutEffect(() => {
    const value = getComputedStyle(ref.current).backgroundColor
    setRgb(value === 'rgba(0, 0, 0, 0)' ? null : parseColour(value))
  }, [token])
  return [ref, rgb]
}

function Swatch({ token }) {
  const [ref, rgb] = useTokenColour(token)
  const ratio = rgb ? contrastRatio(rgb, WHITE) : null

  return (
    <div className="min-w-0">
      <div
        ref={ref}
        className="h-16 rounded-xl border border-black/5"
        style={{ background: `var(--color-${token})` }}
      />
      <p className="mt-2 truncate font-display text-xs font-bold text-ink">{token}</p>
      <p className="font-mono text-xs text-grey-600">{rgb ? toHex(rgb) : 'missing'}</p>
      {ratio && (
        <p className="font-mono text-[0.6875rem] text-grey-500">{ratio.toFixed(2)}:1 on white</p>
      )}
    </div>
  )
}

export function SwatchGroup({ title, tokens }) {
  return (
    <div>
      <p className="mb-3 text-sm font-semibold text-ink">{title}</p>
      <div className="grid grid-cols-3 gap-x-4 gap-y-5 sm:grid-cols-6 lg:grid-cols-11">
        {tokens.map((token) => (
          <Swatch key={token} token={token} />
        ))}
      </div>
    </div>
  )
}

const ratingColours = {
  AAA: 'text-success',
  AA: 'text-success',
  'AA large / UI': 'text-amber',
  Fail: 'text-crimson',
}

function ContrastRow({ fg, bg }) {
  const [fgRef, fgRgb] = useTokenColour(fg)
  const [bgRef, bgRgb] = useTokenColour(bg)
  const ratio = fgRgb && bgRgb ? contrastRatio(fgRgb, bgRgb) : 0
  const result = rating(ratio)

  return (
    <tr className="border-t border-line">
      <td className="py-2 pr-4">
        <span
          ref={bgRef}
          className="inline-flex h-9 w-24 items-center justify-center rounded-lg border border-black/5 font-display text-sm font-bold"
          style={{ background: `var(--color-${bg})`, color: `var(--color-${fg})` }}
        >
          Aa 123
        </span>
        <span ref={fgRef} hidden style={{ background: `var(--color-${fg})` }} />
      </td>
      <td className="py-2 pr-4 font-mono text-xs whitespace-nowrap text-ink">
        {fg} on {bg}
      </td>
      <td className="py-2 pr-4 font-mono text-xs text-ink tabular-nums">{ratio.toFixed(2)}:1</td>
      <td className={cx('py-2 text-xs font-semibold whitespace-nowrap', ratingColours[result])}>
        {result === 'Fail' ? 'Banned' : result}
      </td>
    </tr>
  )
}

export function ContrastTable({ pairs }) {
  return (
    <div className="overflow-x-auto rounded-card border border-line bg-white px-5 py-3">
      <table className="w-full min-w-120 text-left">
        <thead>
          <tr className="text-xs font-semibold text-grey-600">
            <th className="py-2 pr-4 font-semibold">Sample</th>
            <th className="py-2 pr-4 font-semibold">Pair</th>
            <th className="py-2 pr-4 font-semibold">Ratio</th>
            <th className="py-2 font-semibold">WCAG</th>
          </tr>
        </thead>
        <tbody>
          {pairs.map(([fg, bg]) => (
            <ContrastRow key={`${fg}-${bg}`} fg={fg} bg={bg} />
          ))}
        </tbody>
      </table>
    </div>
  )
}
