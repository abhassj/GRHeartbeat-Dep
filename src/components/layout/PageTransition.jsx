import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useLocation, useNavigationType, useOutlet } from 'react-router'
import { AnimatePresence, m, PresenceContext } from 'motion/react'
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe'
import { useSmoothScroll } from '@/hooks/useSmoothScroll'
import { focusElement, focusPageStart } from '@/lib/focus'
import { ease } from '@/lib/motion'
import {
  getSavedPosition,
  isRestoringLoad,
  setCurrentEntry,
  startTrackingPositions,
} from '@/lib/scroll-positions'

const EXIT = 0.12
const ENTER = 0.25

/**
 * Route content fades out, then the next page fades in with one red ECG sweep across the
 * top. Between the two, ScrollManager logic runs:
 * - new page: scroll to top, or to the #hash target (offset by the navbar);
 * - back/forward: restore the saved position;
 * - then move focus to the new page's <h1> (or <main>) so screen readers announce it.
 * Same-page #hash links scroll smoothly to the target and focus it.
 */
export default function PageTransition() {
  const location = useLocation()
  const reduced = useReducedMotionSafe()
  const outlet = useOutlet()
  const [firstPath] = useState(location.pathname)

  useEffect(() => startTrackingPositions(), [])
  useSameRouteHash(location)

  return (
    <>
      {!reduced && location.pathname !== firstPath && <RouteSweep key={location.pathname} />}
      <AnimatePresence mode="wait" initial={false}>
        <m.div
          key={location.pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: reduced ? 0 : ENTER, ease: ease.out } }}
          exit={{ opacity: 0, transition: { duration: reduced ? 0 : EXIT, ease: ease.out } }}
        >
          <RouteEntry />
          {/* Pages get a fresh presence context: AnimatePresence initial={false} only means
              "no fade on first load" and must not stop the page's own mount animations
              (otherwise every animate-on-mount inside the first page snaps to its end). */}
          <PresenceContext value={null}>
            <FrozenOutlet outlet={outlet} />
          </PresenceContext>
        </m.div>
      </AnimatePresence>
    </>
  )
}

/** Keeps the exiting page's content while it fades out. */
function FrozenOutlet({ outlet }) {
  const [frozen] = useState(outlet)
  return frozen
}

// History entry already handled (guards StrictMode's double effect run in development).
let handledKey = null

/** Mounts with each new page (after the previous one has faded out): scroll, then focus. */
function RouteEntry() {
  const currentLocation = useLocation()
  const currentType = useNavigationType()
  // Pinned to the navigation this page mounted for: the exiting page also sees the next
  // location, and query-only changes (filters) must not reset scroll.
  const [{ location, navigationType }] = useState({
    location: currentLocation,
    navigationType: currentType,
  })
  const { scrollTo } = useSmoothScroll()

  useLayoutEffect(() => {
    if (handledKey === location.key) return
    const isInitial = handledKey === null
    // Read before scrolling to the top below, which is itself recorded for this entry.
    const restore = isInitial ? isRestoringLoad() : navigationType === 'POP'
    const saved = restore ? getSavedPosition(location) : undefined
    setCurrentEntry(location)
    // Leave the page at the top until it has settled: content that sizes itself in its own
    // effects would otherwise shift a restored position (via the browser's scroll
    // anchoring). The new page is still fading in, so the one-frame wait is invisible.
    if (!isInitial) scrollTo(0, { immediate: true })

    const frame = requestAnimationFrame(() => {
      handledKey = location.key
      const hashTarget = location.hash && document.getElementById(location.hash.slice(1))

      if (saved != null) scrollTo(saved, { immediate: true })
      else if (hashTarget) scrollTo(hashTarget, { immediate: true })

      // Initial page load keeps the browser's natural focus (start of document).
      if (isInitial) return
      if (hashTarget && navigationType !== 'POP') focusElement(hashTarget)
      else focusPageStart()
    })
    return () => cancelAnimationFrame(frame)
  }, [location, navigationType, scrollTo])

  return null
}

/** #hash changes on the current page: smooth scroll to the target and focus it. */
function useSameRouteHash(location) {
  const { scrollTo } = useSmoothScroll()
  const navigationType = useNavigationType()
  const previous = useRef(location)

  useEffect(() => {
    const before = previous.current
    previous.current = location
    if (before.key === location.key || before.pathname !== location.pathname) return
    setCurrentEntry(location)

    if (navigationType === 'POP') {
      const saved = getSavedPosition(location)
      if (saved != null) scrollTo(saved)
      return
    }
    if (location.hash === before.hash || !location.hash) return
    const target = document.getElementById(location.hash.slice(1))
    if (target && scrollTo(target)) focusElement(target)
  }, [location, navigationType, scrollTo])
}

/** One red ECG trace sweeping across the top of the viewport on route change. */
function RouteSweep() {
  return (
    <m.svg
      aria-hidden
      viewBox="0 0 240 24"
      className="pointer-events-none fixed left-0 z-[55] h-6 w-60 text-pulse-red"
      style={{ top: 'calc(var(--banner-h) + 2px)' }}
      initial={{ x: '-100%', opacity: 1 }}
      animate={{ x: '100vw', opacity: [1, 1, 0] }}
      transition={{ duration: 0.9, ease: ease.inOut }}
      fill="none"
    >
      <path
        d="M0 12h150l8-9 10 18 10-14 6 5h56"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </m.svg>
  )
}
