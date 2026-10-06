// Tiny store: sections that already offer WhatsApp (final CTA band, footer) report when they
// are on screen, and the floating WhatsApp button hides while any of them is.

const blockers = new Set()
const listeners = new Set()

export function setFabBlocker(id, blocking) {
  const had = blockers.has(id)
  if (blocking) blockers.add(id)
  else blockers.delete(id)
  if (had !== blocking) listeners.forEach((listener) => listener())
}

export const subscribeFabBlockers = (listener) => {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export const isFabBlocked = () => blockers.size > 0
