import { useEffect, useId, useSyncExternalStore } from 'react'
import { useInView } from 'motion/react'
import { isFabBlocked, setFabBlocker, subscribeFabBlockers } from '@/lib/fab-visibility'

/** Hide the floating WhatsApp button while this element is on screen. */
export function useHidesFab(ref) {
  const id = useId()
  const inView = useInView(ref, { amount: 0 })
  useEffect(() => {
    setFabBlocker(id, inView)
    return () => setFabBlocker(id, false)
  }, [id, inView])
}

export const useFabBlocked = () =>
  useSyncExternalStore(subscribeFabBlockers, isFabBlocked, () => false)
