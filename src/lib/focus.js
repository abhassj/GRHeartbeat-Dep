export const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

/** Focus any element without scrolling; non-focusable ones get tabIndex -1 (and no ring). */
export function focusElement(element) {
  if (!element) return false
  if (!element.matches(FOCUSABLE) && !element.hasAttribute('tabindex')) {
    element.setAttribute('tabindex', '-1')
    element.setAttribute('data-route-focus', '')
  }
  element.focus({ preventScroll: true })
  return document.activeElement === element
}

/** After a route change: focus the page's first <h1>, else <main>, so screen readers announce it. */
export function focusPageStart() {
  const main = document.getElementById('main')
  return focusElement(main?.querySelector('h1') ?? main)
}
