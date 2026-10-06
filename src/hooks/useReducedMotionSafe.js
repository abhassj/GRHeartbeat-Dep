import { use } from 'react'
import { useReducedMotion } from 'motion/react'
import { MotionPreferenceContext } from '@/lib/motion-preference'

/**
 * True when animations should be static. Prefer this over motion's useReducedMotion:
 * it also honours the manual override from the /styleguide toggle.
 */
export function useReducedMotionSafe() {
  const system = useReducedMotion()
  const preference = use(MotionPreferenceContext)
  return preference ? preference.reduced : Boolean(system)
}

/** True when the visitor has paused decorative loops (WCAG 2.2.2). */
export function useMotionPaused() {
  return Boolean(use(MotionPreferenceContext)?.paused)
}

/**
 * True once layout animation (layoutId) is available: it arrives after the page has loaded
 * (lib/motion-features.js). An element with a layoutId that mounted before then cannot
 * animate its first move, so key it on `String(layoutReady)` to remount it once, in place.
 */
export function useLayoutReady() {
  return Boolean(use(MotionPreferenceContext)?.layoutReady)
}

/** Read and change the override ('reduce' | 'full' | null for "follow the system"). */
export function useMotionPreference() {
  return use(MotionPreferenceContext)
}
