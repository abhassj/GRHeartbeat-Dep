import { useState } from 'react'
import { Link } from 'react-router'
import { ArrowRight } from 'lucide-react'
import VideoFacade from '@/components/media/VideoFacade'
import { home } from '@/data/home'
import { categoryUrl } from '@/lib/courses'
import { cx } from '@/lib/cx'
import { hasVideo } from '@/lib/videos'

/**
 * Lazy-loaded player for when at least one learning video has a YouTube ID: one large
 * click-to-load facade plus chapter cards. Videos without an ID still show as "coming soon"
 * inside the facade (no iframe, nothing clickable).
 */
export default function VideoChapters({ videos }) {
  const copy = home.whyItMatters.videos
  const [activeId, setActiveId] = useState((videos.find(hasVideo) ?? videos[0]).id)
  const active = videos.find((video) => video.id === activeId)

  return (
    <div className="grid gap-5 lg:grid-cols-[2fr_1fr]">
      <VideoFacade key={active.id} video={active} />
      <ul aria-label={copy.chaptersLabel} className="flex snap-x gap-3 overflow-x-auto lg:flex-col">
        {videos.map((video) => {
          const selected = video.id === activeId
          return (
            <li key={video.id} className="w-64 shrink-0 snap-start lg:w-auto">
              <button
                type="button"
                aria-pressed={selected}
                onClick={() => setActiveId(video.id)}
                className={cx(
                  'w-full rounded-card border border-white/10 bg-grey-900/60 p-4 text-left transition-colors hover:bg-grey-900',
                  selected && 'border-l-4 border-l-pulse-red',
                )}
              >
                <span className="block font-display font-bold text-white">{video.title}</span>
                <span className="mt-1 block text-sm text-grey-200">{video.description}</span>
              </button>
              <Link
                to={categoryUrl('sa', video.relatedCategory)}
                className="mt-1 inline-flex items-center gap-1 px-4 text-xs font-semibold text-red-400 hover:text-red-100"
              >
                {copy.relatedLabel}
                <ArrowRight aria-hidden size={13} />
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
