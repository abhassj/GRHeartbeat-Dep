import { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react'
import { LazyMotion, MotionConfig, useReducedMotion } from 'motion/react'
import { initialMotionFeatures, loadFullMotionFeatures } from '@/lib/motion-features'
import { MotionPreferenceContext } from '@/lib/motion-preference'

const PAUSED_KEY = 'gr:motion-paused'

const readPaused = () => {
  try {
    return sessionStorage.getItem(PAUSED_KEY) === '1'
  } catch {
    return false
  }
}

/**
 * Resolves motion once for the whole app:
 * - reduced: the OS setting, unless overridden (styleguide). Stamps data-motion on <html>.
 * - paused: the visitor pressed a pause control (WCAG 2.2.2). Stamps data-motion-paused on
 *   <html> so CSS loops stop; Motion loops and videos read it via useMotionPaused().
 *   Remembered for the tab's session.
 */
export default function MotionProvider({ children }) {
  const system = Boolean(useReducedMotion())
  const [override, setOverride] = useState(null)
  const [paused, setPausedState] = useState(readPaused)
  const reduced = override ? override === 'reduce' : system
  const [features, setFeatures] = useState(initialMotionFeatures)

  // Upgrade to the full feature set (layout animations) once the page has loaded.
  useEffect(() => {
    let active = true
    const load = () => loadFullMotionFeatures().then((full) => active && setFeatures(full))
    if (document.readyState === 'complete') load()
    else window.addEventListener('load', load, { once: true })
    return () => {
      active = false
      window.removeEventListener('load', load)
    }
  }, [])

  useLayoutEffect(() => {
    document.documentElement.dataset.motion = reduced ? 'reduce' : 'full'
  }, [reduced])

  useLayoutEffect(() => {
    if (paused) document.documentElement.setAttribute('data-motion-paused', '')
    else document.documentElement.removeAttribute('data-motion-paused')
  }, [paused])

  const setPaused = useCallback((next) => {
    setPausedState(next)
    try {
      sessionStorage.setItem(PAUSED_KEY, next ? '1' : '0')
    } catch {
      // Storage unavailable: the pause still applies to this page view.
    }
  }, [])

  const layoutReady = features !== initialMotionFeatures
  const value = useMemo(
    () => ({ reduced, system, override, setOverride, paused, setPaused, layoutReady }),
    [reduced, system, override, paused, setPaused, layoutReady],
  )

  return (
    <MotionPreferenceContext value={value}>
      <LazyMotion features={features} strict>
        <MotionConfig reducedMotion={reduced ? 'always' : 'never'}>{children}</MotionConfig>
      </LazyMotion>
    </MotionPreferenceContext>
  )
}
