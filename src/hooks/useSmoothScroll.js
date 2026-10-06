import { use } from 'react'
import { createScrollApi, getActiveLenis, SmoothScrollContext } from '@/lib/smooth-scroll'

const nativeApi = createScrollApi(getActiveLenis, { reduced: false })

/** scrollTo(target, { immediate }), lock(), unlock() — via Lenis when it is running. */
export function useSmoothScroll() {
  return use(SmoothScrollContext) ?? nativeApi
}
