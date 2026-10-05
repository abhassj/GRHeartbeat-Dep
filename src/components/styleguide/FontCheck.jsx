import { useEffect, useState } from 'react'
import Badge from '@/components/ui/Badge'

const CHECKS = [
  { family: 'Montserrat Variable', style: 'normal', label: 'Montserrat upright' },
  { family: 'Montserrat Variable', style: 'italic', label: 'Montserrat italic' },
  { family: 'Inter Variable', style: 'normal', label: 'Inter upright' },
]

/**
 * Confirms the real font files loaded (not a fallback, not a synthesised slant). The page
 * also sets font-synthesis: none, so a missing italic file would render upright, not fake.
 */
export default function FontCheck() {
  const [results, setResults] = useState(null)

  useEffect(() => {
    let active = true
    document.fonts.ready.then(() => {
      if (!active) return
      const faces = [...document.fonts]
      setResults(
        CHECKS.map((check) => ({
          ...check,
          loaded: faces.some(
            (f) =>
              f.family.replace(/"/g, '') === check.family &&
              f.style === check.style &&
              f.status === 'loaded',
          ),
        })),
      )
    })
    return () => {
      active = false
    }
  }, [])

  return (
    <div data-testid="font-check" className="flex flex-wrap gap-2">
      {results?.map((r) => (
        <Badge key={r.label} tone={r.loaded ? 'success' : 'red'} dot>
          {r.label}: {r.loaded ? 'file loaded' : 'not loaded'}
        </Badge>
      )) ?? <Badge tone="navy">Checking fonts…</Badge>}
    </div>
  )
}
