import { useLayoutEffect, useState } from 'react'

/** Live content-box size of an element, via ResizeObserver. */
export function useElementSize(ref) {
  const [size, setSize] = useState({ width: 0, height: 0 })

  useLayoutEffect(() => {
    const node = ref.current
    if (!node) return
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      setSize((prev) => (prev.width === width && prev.height === height ? prev : { width, height }))
    })
    observer.observe(node)
    return () => observer.disconnect()
  }, [ref])

  return size
}
