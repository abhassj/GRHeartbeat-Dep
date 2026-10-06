import { useLayoutEffect } from 'react'
import { FlaskConical } from 'lucide-react'
import { sampleBannerText } from '@/data/dev'
import { isUsingSampleClients } from '@/lib/clients'
import { isUsingSampleCourses } from '@/lib/courses'
import { SAMPLES_ENABLED } from '@/lib/samples'

const HEIGHT = '28px'

/**
 * Thin amber bar shown whenever sample fixtures (courses, client logos) stand in for real content.
 * Never renders in production builds (samples are compiled out there).
 */
export default function SampleContentBanner() {
  const using = SAMPLES_ENABLED && {
    courses: isUsingSampleCourses(),
    clients: isUsingSampleClients(),
  }
  const show = Boolean(using && (using.courses || using.clients))

  useLayoutEffect(() => {
    if (!show) return
    document.documentElement.style.setProperty('--banner-h', HEIGHT)
    return () => document.documentElement.style.removeProperty('--banner-h')
  }, [show])

  if (!show) return null
  return (
    <div
      role="note"
      className="fixed inset-x-0 top-0 z-[60] flex items-center justify-center gap-2 overflow-hidden border-b border-amber/20 bg-amber-50 px-4 text-xs font-semibold text-amber"
      style={{ height: HEIGHT }}
    >
      <FlaskConical aria-hidden size={14} className="shrink-0" />
      <span className="min-w-0 truncate">{sampleBannerText(using)}</span>
    </div>
  )
}
