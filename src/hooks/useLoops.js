import { useEffect, useId, useState, useSyncExternalStore } from 'react'
import {
  anyLoopVisible,
  needsFloatingControl,
  setControlVisible,
  setLoopVisible,
  subscribeLoops,
} from '@/lib/loops'

/*
 * Visibility is tracked with a dedicated native IntersectionObserver, not motion's useInView:
 * components here often call useInView on the same element themselves, and two motion
 * observers with identical options on one element would replace each other's callback.
 */
function useOnScreen(ref, threshold) {
  const [onScreen, setOnScreen] = useState(false)
  useEffect(() => {
    const node = ref.current
    if (!node) return
    const observer = new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting), {
      threshold,
    })
    observer.observe(node)
    return () => observer.disconnect()
  }, [ref, threshold])
  return onScreen
}

/** Report a decorative loop: registered while `ref` is on screen and `active` is true. */
export function useRegisterLoop(ref, active = true) {
  const id = useId()
  const visible = useOnScreen(ref, 0) && active
  useEffect(() => {
    setLoopVisible(id, visible)
    return () => setLoopVisible(id, false)
  }, [id, visible])
}

/** Report an inline pause control that is on screen. */
export function useRegisterPauseControl(ref, active = true) {
  const id = useId()
  const visible = useOnScreen(ref, 0.5) && active
  useEffect(() => {
    setControlVisible(id, visible)
    return () => setControlVisible(id, false)
  }, [id, visible])
}

export const useNeedsFloatingControl = () =>
  useSyncExternalStore(subscribeLoops, needsFloatingControl, () => false)

export const useAnyLoopVisible = () =>
  useSyncExternalStore(subscribeLoops, anyLoopVisible, () => false)
