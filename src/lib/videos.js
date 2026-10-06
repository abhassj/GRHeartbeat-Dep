import { videos } from '@/data/videos'

// YouTube IDs are 11 characters of letters, digits, "-" and "_".
const YOUTUBE_ID = /^[\w-]{11}$/

/** True only when a real YouTube ID is set. A null (or malformed) ID means "coming soon". */
export const hasVideo = (video) =>
  typeof video?.youtubeId === 'string' && YOUTUBE_ID.test(video.youtubeId)

/** Privacy-enhanced embed URL, or null when there is no video yet (never a broken iframe). */
export const embedUrl = (video) =>
  hasVideo(video)
    ? `https://www.youtube-nocookie.com/embed/${video.youtubeId}?autoplay=1&rel=0&modestbranding=1`
    : null

export const getVideos = () => videos

export const getVideo = (id) => videos.find((video) => video.id === id) ?? null
