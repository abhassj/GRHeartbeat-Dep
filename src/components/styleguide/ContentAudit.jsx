import { getClients, isUsingSampleClients } from '@/lib/clients'
import {
  getCourseSelectOptions,
  getCoursesByRegion,
  getFeaturedCourses,
  getFindYourCourse,
  getPillars,
  hasCourses,
  isUsingSampleCourses,
} from '@/lib/courses'
import { getVideos, hasVideo } from '@/lib/videos'

/** Live readout of what each content consumer receives in this build (empty-state audit). */
export default function ContentAudit() {
  const live = hasCourses('sa')
  const find = getFindYourCourse('sa')
  const select = getCourseSelectOptions('sa')
  const clients = getClients()

  const rows = [
    [
      'Course source (SA)',
      live
        ? `${getCoursesByRegion('sa').length} courses${isUsingSampleCourses() ? ' (samples)' : ''}`
        : 'none (empty state)',
    ],
    [
      'Navbar menu, SA card',
      live
        ? `count + ${getFeaturedCourses('sa', 3).length} featured links`
        : '3 category links, no count',
    ],
    ['Footer', 'SA, UK and category links (no course data needed)'],
    [
      'Find your course',
      find.mode === 'courses'
        ? `${find.courses.length} featured cards, "view all ${find.total}"`
        : '3 category cards + call/WhatsApp line',
    ],
    [
      'What we do chips',
      getPillars('sa')
        .map((p) => `${p.id}: ${p.courses.length}`)
        .join(' · ') + (live ? '' : ' (chip rows hidden)'),
    ],
    [
      'Video related links',
      getVideos()
        .map((v) => `${v.id} → ${v.relatedCategory}`)
        .join(' · '),
    ],
    [
      'Videos published',
      `${getVideos().filter(hasVideo).length} of ${getVideos().length} (others: coming soon)`,
    ],
    [
      'Contact select',
      `${select.kind} select, ${select.options.length} options incl. "${select.options.at(-1).label}"`,
    ],
    [
      'Clients',
      clients.length
        ? `${clients.length}${isUsingSampleClients() ? ' placeholders (dev only)' : ''}`
        : 'none: section not rendered',
    ],
  ]

  return (
    <div className="overflow-x-auto rounded-card border border-line bg-white px-5 py-3">
      <table className="w-full min-w-120 text-left text-sm">
        <tbody>
          {rows.map(([label, value]) => (
            <tr key={label} className="border-t border-line first:border-t-0">
              <th scope="row" className="py-2.5 pr-6 font-semibold whitespace-nowrap text-ink">
                {label}
              </th>
              <td className="py-2.5 font-mono text-xs text-grey-600">{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
