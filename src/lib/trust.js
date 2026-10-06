import { home } from '@/data/home'
import { site } from '@/data/site'

/** Trust-strip items backed by confirmed data only: accreditations, then the years line. */
export function getTrustItems({
  accreditations = site.accreditations,
  line = home.trustStrip.line,
} = {}) {
  return [
    ...accreditations.map((item) => ({ key: item.id, kind: 'badge', label: item.name })),
    ...(line ? [{ key: 'line', kind: 'line', label: line }] : []),
  ]
}
