// Learning videos for the "Why it matters" section (Phase 4).
// This file must not import anything: the Node content check reads it.
//
// Null-ID contract (lib/videos.js + components/media/VideoFacade.jsx): while youtubeId is
// null the player shows the poster with a "Video coming soon" chip — no iframe, no play
// button, nothing clickable. Never invent an ID.
//
// - poster: a photo id from src/data/photos.js, or null (neutral placeholder)
// - relatedCategory: a category id from categories.js (links to that course list)
// - captions: TODO(client) — a .vtt captions file or a transcript, required before a video
//   is published (accessibility)
// Titles and descriptions are drafted copy. TODO(client): review wording.

export const videoLabels = {
  comingSoon: 'Video coming soon',
  play: (title) => `Play video: ${title}`,
  relatedCourses: 'Related courses',
}

export const videos = [
  {
    id: 'first-aid',
    title: 'Why first aid matters',
    description: 'What first aid is, and why knowing the basics helps at work and at home.',
    relatedCategory: 'first-aid',
    poster: 'cprClass',
    captions: null, // TODO(client): captions (.vtt) or transcript
    youtubeId: null, // TODO(client): YouTube video ID (AI-generated video, client-reviewed)
  },
  {
    id: 'ohs',
    title: 'Why workplace health and safety matters',
    description: 'How everyday safety habits protect people at work.',
    relatedCategory: 'compliance',
    poster: 'firstAidKit',
    captions: null, // TODO(client): captions (.vtt) or transcript
    youtubeId: null, // TODO(client): YouTube video ID (AI-generated video, client-reviewed)
  },
  {
    id: 'fire',
    title: 'Why fire safety matters',
    description: 'Why preparing for a fire before it happens makes a difference.',
    relatedCategory: 'emergency-response',
    poster: null, // TODO(client): a poster photo for this video
    captions: null, // TODO(client): captions (.vtt) or transcript
    youtubeId: null, // TODO(client): YouTube video ID (AI-generated video, client-reviewed)
  },
]
