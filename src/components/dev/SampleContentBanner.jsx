import { useLayoutEffect } from 'react'
import { FlaskConical } from 'lucide-react'
import { sampleBannerText } from '@/data/dev'
import { isUsingSampleCourses, SAMPLES_ENABLED } from '@/lib/courses'

const HEIGHT = '28px'

/**
 * Thin amber bar shown whenever sample course fixtures stand in for the real list.
 * Never renders in production builds (samples are compiled out there).
 */
export default function SampleContentBanner() {
  const show = SAMPLES_ENABLED && isUsingSampleCourses()

  useLayoutEffect(() => {
    if (!show) return
    document.documentElement.style.setProperty('--banner-h', HEIGHT)
    return () => document.documentElement.style.removeProperty('--banner-h')
  }, [show])

  if (!show) return null
  return (
    <div
      role="note"
      className="fixed inset-x-0 top-0 z-[60] flex items-center justify-center gap-2 border-b border-amber/20 bg-amber-50 px-4 text-xs font-semibold text-amber"
      style={{ height: HEIGHT }}
    >
      <FlaskConical aria-hidden size={14} />
      {sampleBannerText}
    </div>
  )
}
