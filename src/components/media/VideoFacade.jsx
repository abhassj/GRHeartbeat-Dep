import { useState } from 'react'
import { Clapperboard, Play } from 'lucide-react'
import { getPhoto } from '@/data/photos'
import { videoLabels } from '@/data/videos'
import { cx } from '@/lib/cx'
import { embedUrl } from '@/lib/videos'

/**
 * Click-to-load YouTube facade (youtube-nocookie). The iframe only loads after a click.
 *
 * Null-ID contract: when a video has no YouTube ID yet, it renders the poster with a
 * "Video coming soon" chip — no iframe, no play button, nothing clickable. Phase 4 builds the
 * chapter list and crossfades on top of this.
 */
export default function VideoFacade({ video, className }) {
  const [playing, setPlaying] = useState(false)
  const url = embedUrl(video)
  const poster = getPhoto(video.poster)

  return (
    <div
      className={cx('relative aspect-video overflow-hidden rounded-card bg-monitor', className)}
      role={url ? undefined : 'img'}
      aria-label={url ? undefined : `${video.title}: ${videoLabels.comingSoon}`}
    >
      {playing && url ? (
        <iframe
          src={url}
          title={video.title}
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
          className="absolute inset-0 size-full"
        />
      ) : (
        <>
          {poster ? (
            <img
              src={poster.src}
              srcSet={poster.srcSet}
              sizes="(min-width: 1024px) 66vw, 100vw"
              alt=""
              width={poster.width}
              height={poster.height}
              loading="lazy"
              decoding="async"
              className="absolute inset-0 size-full object-cover"
            />
          ) : (
            <div aria-hidden className="absolute inset-0 bg-monitor-grid" />
          )}
          <div
            aria-hidden
            className="absolute inset-0 bg-linear-to-t from-monitor/75 via-monitor/10 to-transparent"
          />

          {url ? (
            <button
              type="button"
              onClick={() => setPlaying(true)}
              aria-label={videoLabels.play(video.title)}
              className="group absolute inset-0 flex items-center justify-center"
            >
              <span className="flex size-18 items-center justify-center rounded-full bg-white/90 text-ink shadow-card-hover transition-colors duration-200 group-hover:bg-pulse-red group-hover:text-white">
                <Play aria-hidden size={28} className="translate-x-0.5" fill="currentColor" />
              </span>
            </button>
          ) : (
            <span className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full bg-white/95 px-3.5 py-1.5 text-xs font-semibold text-ink shadow-card">
              <Clapperboard aria-hidden size={14} className="text-navy" />
              {videoLabels.comingSoon}
            </span>
          )}
        </>
      )}
    </div>
  )
}
