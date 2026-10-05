import { useEffect } from 'react'
import Lenis from 'lenis'
import { useFinePointer } from '@/hooks/useMediaQuery'
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe'

/**
 * Lenis smooth scrolling for mouse/trackpad users. Off under reduced motion and on
 * touch devices, where native scrolling is better. Renders no wrapper, so turning it
 * on or off never remounts the page.
 */
export default function SmoothScroll({ children }) {
  const reduced = useReducedMotionSafe()
  const finePointer = useFinePointer()
  const enabled = finePointer && !reduced

  useEffect(() => {
    if (!enabled) return
    const lenis = new Lenis({ autoRaf: true, anchors: true, lerp: 0.1 })
    return () => lenis.destroy()
  }, [enabled])

  return children
}
