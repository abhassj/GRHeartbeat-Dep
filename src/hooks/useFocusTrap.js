import { useEffect, useLayoutEffect, useRef } from 'react'
import { FOCUSABLE } from '@/lib/focus'

const isVisible = (el) => el.offsetParent !== null || el === document.activeElement

/**
 * While `active`, Tab and Shift+Tab cycle through the focusable elements inside `refs`
 * (in order), and Escape calls onEscape. Used by the mobile drawer.
 */
export function useFocusTrap(active, refs, onEscape) {
  const latest = useRef({ refs, onEscape })
  useLayoutEffect(() => {
    latest.current = { refs, onEscape }
  })

  useEffect(() => {
    if (!active) return

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        latest.current.onEscape?.()
        return
      }
      if (event.key !== 'Tab') return

      const items = latest.current.refs
        .map((ref) => ref.current)
        .filter(Boolean)
        .flatMap((root) => [
          ...(root.matches(FOCUSABLE) ? [root] : []),
          ...root.querySelectorAll(FOCUSABLE),
        ])
        .filter(isVisible)
      if (!items.length) return

      const index = items.indexOf(document.activeElement)
      const next = event.shiftKey
        ? items[index <= 0 ? items.length - 1 : index - 1]
        : items[index === -1 || index === items.length - 1 ? 0 : index + 1]
      event.preventDefault()
      next.focus()
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [active])
}
