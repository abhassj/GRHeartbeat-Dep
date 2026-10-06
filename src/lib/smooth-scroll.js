import { createContext } from 'react'

export const SmoothScrollContext = createContext(null)

// The single running Lenis instance (set by SmoothScroll), or null when it is off.
let activeLenis = null
export const setActiveLenis = (instance) => {
  activeLenis = instance
}
export const getActiveLenis = () => activeLenis

const resolveTarget = (target) =>
  typeof target === 'string' ? document.getElementById(target.replace(/^#/, '')) : target

/** Top offset for an element: its scroll-margin-top (set globally to the navbar height). */
export const scrollMarginOf = (element) =>
  element instanceof Element ? parseFloat(getComputedStyle(element).scrollMarginTop) || 0 : 0

/** Absolute document Y for a number, element or "#id", minus the element's scroll margin. */
export function targetY(target) {
  if (typeof target === 'number') return target
  const element = resolveTarget(target)
  if (!element) return null
  return element.getBoundingClientRect().top + window.scrollY - scrollMarginOf(element)
}

/** Builds the scroll API around getLenis(), which returns the running Lenis instance or null. */
export function createScrollApi(getLenis, { reduced }) {
  return {
    scrollTo(target, { immediate = false } = {}) {
      const lenis = getLenis()
      const y = targetY(target)
      if (y == null) return false
      const instant = immediate || reduced
      // Lenis caches the page height; refresh it first, or a jump right after a route
      // change would be clamped to the previous (often shorter) page.
      lenis?.resize()
      if (lenis) lenis.scrollTo(Math.max(0, y), { immediate: instant, force: true })
      else window.scrollTo({ top: Math.max(0, y), behavior: instant ? 'auto' : 'smooth' })
      return true
    },
    lock() {
      getLenis()?.stop()
      document.documentElement.style.overflow = 'hidden'
    },
    unlock() {
      document.documentElement.style.overflow = ''
      getLenis()?.start()
    },
  }
}
