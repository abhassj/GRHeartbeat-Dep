import { useEffect, useMemo } from 'react'
import Lenis from 'lenis'
import { useFinePointer } from '@/hooks/useMediaQuery'
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe'
import {
  createScrollApi,
  getActiveLenis,
  setActiveLenis,
  SmoothScrollContext,
} from '@/lib/smooth-scroll'

/**
 * Lenis smooth scrolling for mouse/trackpad users. Off under reduced motion and on
 * touch devices, where native scrolling is better. Renders no wrapper, so turning it
 * on or off never remounts the page. useSmoothScroll() gives scrollTo / lock / unlock,
 * which fall back to native scrolling when Lenis is off.
 */
export default function SmoothScroll({ children }) {
  const reduced = useReducedMotionSafe()
  const finePointer = useFinePointer()
  const enabled = finePointer && !reduced

  useEffect(() => {
    if (!enabled) return
    // Hash links are handled by PageTransition (with the navbar offset), not by Lenis.
    const instance = new Lenis({ autoRaf: true, anchors: false, lerp: 0.1 })
    setActiveLenis(instance)
    return () => {
      instance.destroy()
      setActiveLenis(null)
    }
  }, [enabled])

  const api = useMemo(() => createScrollApi(getActiveLenis, { reduced }), [reduced])

  return <SmoothScrollContext value={api}>{children}</SmoothScrollContext>
}
