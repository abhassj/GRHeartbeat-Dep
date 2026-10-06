import { useEffect, useState } from 'react'

/** True (and stays true) once `ref` comes within `margin` of the viewport. */
export function useNearViewport(ref, margin = '600px') {
  const [near, setNear] = useState(false)
  useEffect(() => {
    const node = ref.current
    if (!node || near) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNear(true)
          observer.disconnect()
        }
      },
      { rootMargin: `${margin} 0px ${margin} 0px` },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [ref, margin, near])
  return near
}
