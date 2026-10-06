// Scroll positions per history entry (location.key), kept for the tab's lifetime so
// back/forward and reloads restore where the visitor was.

const STORAGE_KEY = 'gr:scroll-positions'
const positions = new Map()
let currentKey = null

try {
  const saved = JSON.parse(sessionStorage.getItem(STORAGE_KEY) ?? '[]')
  saved.forEach(([key, y]) => positions.set(key, y))
} catch {
  // Storage unavailable (private mode, blocked): restoring is best-effort.
}

// React Router gives every full page load the key "default", so the URL is part of the id.
export const entryId = (location) => `${location.key}|${location.pathname}${location.search}`

export const setCurrentEntry = (location) => {
  currentKey = entryId(location)
}

export const getSavedPosition = (location) => positions.get(entryId(location))

/** A fresh document only restores scroll when it is a reload or a back/forward load. */
export const isRestoringLoad = () => {
  const type = performance.getEntriesByType?.('navigation')[0]?.type
  return type === 'reload' || type === 'back_forward'
}

export function startTrackingPositions() {
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual'

  let frame = 0
  const onScroll = () => {
    cancelAnimationFrame(frame)
    frame = requestAnimationFrame(() => {
      if (currentKey) positions.set(currentKey, window.scrollY)
    })
  }
  const persist = () => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify([...positions].slice(-50)))
    } catch {
      // ignore
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('pagehide', persist)
  return () => {
    window.removeEventListener('scroll', onScroll)
    window.removeEventListener('pagehide', persist)
    persist()
  }
}

// Development only: lets browser tests inspect saved positions. Stripped from builds.
if (import.meta.env.DEV) window.__scrollPositions = positions
