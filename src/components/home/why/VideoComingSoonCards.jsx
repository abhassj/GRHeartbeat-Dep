import { Link } from 'react-router'
import { ArrowRight, Clapperboard } from 'lucide-react'
import { getPhoto } from '@/data/photos'
import { home } from '@/data/home'
import { videoLabels } from '@/data/videos'
import { categoryUrl } from '@/lib/courses'

/**
 * Compact cards shown while no learning video has a YouTube ID yet: a small poster, the
 * title and description, a "Video coming soon" chip and the related-courses link. No large
 * empty player box; the monitor and game carry the section.
 */
export default function VideoComingSoonCards({ videos }) {
  const copy = home.whyItMatters.videos
  return (
    <ul className="grid gap-4 md:grid-cols-3">
      {videos.map((video) => {
        const poster = getPhoto(video.poster)
        return (
          <li
            key={video.id}
            className="flex min-w-0 gap-4 rounded-card border border-white/10 bg-grey-900/60 p-4"
          >
            <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-xl bg-monitor-grid">
              {poster && (
                <img
                  src={poster.src}
                  srcSet={poster.srcSet}
                  sizes="112px"
                  alt=""
                  width={poster.width}
                  height={poster.height}
                  loading="lazy"
                  decoding="async"
                  className="size-full object-cover opacity-70"
                />
              )}
              <Clapperboard
                aria-hidden
                size={20}
                className="absolute right-2 bottom-2 text-white"
              />
            </div>
            <div className="min-w-0">
              <h4 className="font-display text-base font-bold text-white">{video.title}</h4>
              <p className="mt-1 line-clamp-2 text-sm text-grey-200">{video.description}</p>
              <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
                <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs font-semibold text-white">
                  {videoLabels.comingSoon}
                </span>
                <Link
                  to={categoryUrl('sa', video.relatedCategory)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-red-400 hover:text-red-100"
                >
                  {copy.relatedLabel}
                  <ArrowRight aria-hidden size={13} />
                </Link>
              </div>
            </div>
          </li>
        )
      })}
    </ul>
  )
}
