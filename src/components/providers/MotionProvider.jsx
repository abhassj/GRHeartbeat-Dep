import { useLayoutEffect, useMemo, useState } from 'react'
import { MotionConfig, useReducedMotion } from 'motion/react'
import { MotionPreferenceContext } from '@/lib/motion-preference'

/**
 * Resolves reduced motion once for the whole app: the OS setting, unless overridden.
 * Stamps data-motion on <html> so CSS animations (lub-dub, sheen) follow the same switch.
 */
export default function MotionProvider({ children }) {
  const system = Boolean(useReducedMotion())
  const [override, setOverride] = useState(null)
  const reduced = override ? override === 'reduce' : system

  useLayoutEffect(() => {
    document.documentElement.dataset.motion = reduced ? 'reduce' : 'full'
  }, [reduced])

  const value = useMemo(
    () => ({ reduced, system, override, setOverride }),
    [reduced, system, override],
  )

  return (
    <MotionPreferenceContext value={value}>
      <MotionConfig reducedMotion={reduced ? 'always' : 'never'}>{children}</MotionConfig>
    </MotionPreferenceContext>
  )
}
