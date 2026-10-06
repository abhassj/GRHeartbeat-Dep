import { useEffect, useId, useState, useSyncExternalStore } from 'react'
import {
  anyLoopVisible,
  getWinningGroup,
  needsFloatingControl,
  setControlVisible,
  setLoop,
  subscribeLoops,
} from '@/lib/loops'

const THRESHOLDS = Array.from({ length: 21 }, (_, i) => i / 20)

/*
 * Visible area via a dedicated native IntersectionObserver (not motion's useInView:
 * components often observe the same element themselves).
 */
function useVisibleArea(ref) {
  const [area, setArea] = useState(0)
  useEffect(() => {
    const node = ref.current
    if (!node) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        const { width, height } = entry.intersectionRect
        setArea(entry.isIntersecting ? Math.round(width * height) : 0)
      },
      { threshold: THRESHOLDS },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [ref])
  return area
}

/**
 * Register a decorative loop and ask whether it may animate right now. Returns true only
 * while it is on screen, `active`, and its `group` has the largest visible area of all
 * loops on screen (see lib/loops.js). Loops sharing a group run together.
 */
export function useLoopGate(ref, { group, active = true } = {}) {
  const id = useId()
  const name = group ?? id
  const area = useVisibleArea(ref)
  const visibleArea = active ? area : 0

  useEffect(() => {
    setLoop(id, { group: name, area: visibleArea })
  }, [id, name, visibleArea])
  useEffect(() => () => setLoop(id, null), [id])

  const winner = useSyncExternalStore(subscribeLoops, getWinningGroup, () => null)
  return visibleArea > 0 && winner === name
}

/** Report an inline pause control that is on screen. */
export function useRegisterPauseControl(ref, active = true) {
  const id = useId()
  const area = useVisibleArea(ref)
  const visible = active && area > 0
  useEffect(() => {
    setControlVisible(id, visible)
    return () => setControlVisible(id, false)
  }, [id, visible])
}

export const useNeedsFloatingControl = () =>
  useSyncExternalStore(subscribeLoops, needsFloatingControl, () => false)

export const useAnyLoopVisible = () =>
  useSyncExternalStore(subscribeLoops, anyLoopVisible, () => false)
