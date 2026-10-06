import { sampleAccreditations } from '@/data/fixtures/trust.sample'
import { home } from '@/data/home'
import { site } from '@/data/site'
import { SAMPLES_ENABLED } from '@/lib/samples'

/** Confirmed accreditations; neutral placeholders in development only while none exist. */
const accreditationSource = () => {
  if (site.accreditations.length) return site.accreditations
  if (SAMPLES_ENABLED) return sampleAccreditations
  return []
}

export const isUsingSampleTrust = () => accreditationSource().some((item) => item.sample)

/** Trust-strip items backed by data only: accreditations, then the years line. */
export function getTrustItems({
  accreditations = accreditationSource(),
  line = home.trustStrip.line,
} = {}) {
  return [
    ...accreditations.map((item) => ({ key: item.id, kind: 'badge', label: item.name })),
    ...(line ? [{ key: 'line', kind: 'line', label: line }] : []),
  ]
}
