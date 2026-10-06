import { about } from '@/data/about'
import { motionControl } from '@/data/navigation'
import { site, yearsOfHistory } from '@/data/site'

/*
 * Home page copy, sections 4.1–4.8 of the plan. Built in Phase 4.
 * All wording here is DRAFTED and deliberately generic. TODO(client): review this file.
 * Facts used: Durban, 12+ years, 20+ courses (unconfirmed). Courses, pillars and chips come
 * from lib/courses.js; photos are ids from data/photos.js.
 */

const stat = (key, value, label, icon) =>
  value == null ? null : { key, value, suffix: '+', label, icon }

export const home = {
  meta: {
    title: `${site.name} | First aid, health and safety training in ${site.location.city}`,
    description: `First aid, health and safety, and emergency response training in ${site.location.city}, ${site.location.country}.`,
  },

  // 4.1 Hero
  hero: {
    eyebrow: `${site.location.city} · ${yearsOfHistory()}+ years of training`,
    // TODO(client): choose the final motto. This is a draft placeholder (plan option 1).
    motto: { lead: 'Ready when', accent: 'it matters.' },
    mottoAlternates: ['Train today. Save a life tomorrow.', 'Skills that keep hearts beating.'],
    subline:
      'Practical first aid, health and safety, and emergency response training for people and teams.',
    primaryCta: { label: 'Explore courses', to: '/courses/sa' },
    secondaryCta: { label: 'Book group training', to: '/contact' },
    trustItems: [
      'Practical, hands-on sessions',
      'For teams and individuals',
      `Based in ${site.location.city}`,
    ],
    // One control pauses the video and every decorative loop (WCAG 2.2.2).
    motionLabels: motionControl,
    scrollCue: 'Scroll to explore',
  },

  // Hero video. Decorative (muted, no audio track); the poster is the LCP image.
  // AI-generated; TODO(client): review the CPR technique shown before launch (the instructor's
  // shoulders are not directly over her hands). Encoded from docs/media-src (not committed):
  // an 8.4 s seamless-as-possible loop, 1280×720, audio stripped.
  // If sources is empty, the poster (or fallbackPhoto) shows with a slow zoom instead.
  heroVideo: {
    sources: [
      { src: '/media/hero/hero.webm', type: 'video/webm' },
      { src: '/media/hero/hero.mp4', type: 'video/mp4' },
    ],
    poster: { src: '/media/hero/hero-poster.webp', width: 1280, height: 720 },
    fallbackPhoto: 'cprCompressions',
    // Keeps the instructor, her hands and the manikin in frame at each crop.
    objectPosition: { desktop: '25% 50%', mobile: '40% 50%' },
    // The loop seam (a small head turn) is hidden with a crossfade in the player.
    loopCrossfadeMs: 300,
  },

  // 4.2 Trust strip — the accreditation badges render only once site.accreditations is confirmed.
  trustStrip: {
    accreditedBy: 'Accredited by',
    line: `${yearsOfHistory()}+ years of health and safety training in ${site.location.city}`,
  },

  // 4.3 Who we are
  whoWeAre: {
    eyebrow: 'Who we are',
    heading: { lead: 'Health and safety training,', accent: 'made practical' },
    mission: about.mission,
    vision: about.vision,
    // Bento photos (ids). TODO(client): a hi-vis / workplace photo for the second slot.
    photos: { tall: 'cprClass', wide: null, square: 'cprCompressions' },
    // Only figures the client has given. peopleTrained appears once supplied in site.js.
    stats: [
      stat('courses', site.stats.courses, 'Courses', 'BookOpen'),
      stat('years', yearsOfHistory(), 'Years of experience', 'CalendarCheck'),
      stat('people', site.stats.peopleTrained, 'People trained', 'Users'),
    ].filter(Boolean),
    moreLink: { label: 'More about us', to: '/about' },
  },

  // 4.4 What we do (pillars = categories, via getPillars())
  whatWeDo: {
    eyebrow: 'What we do',
    heading: { lead: 'Areas of', accent: 'training' },
    chipsLabel: 'Courses include',
    seeCourses: 'See courses',
  },

  // 4.5 Find your course (via getFindYourCourse())
  findCourse: {
    eyebrow: 'Courses',
    heading: { lead: 'Find your', accent: 'course' },
    tabsLabel: 'Choose a region',
    regions: { sa: 'South Africa', uk: 'United Kingdom' },
    regionBadges: { sa: 'Live', uk: 'Coming soon' },
    viewAll: (n) => `View all ${n} South African courses`,
    // Shown while no courses are published (plan wording).
    emptyLine: 'Our full course list is being updated — call or WhatsApp us for current courses.',
    categoryLink: 'See courses',
    callLabel: 'Call us',
    whatsappLabel: 'WhatsApp us',
    whatsappMessage: `Hi ${site.name}, I'd like to know which courses you currently offer.`,
    uk: {
      badge: 'Coming soon',
      heading: `We're bringing ${site.name} to the UK`,
      text: 'UK training is on its way. Get in touch and we will let you know when it opens.',
      whatsappLabel: 'Ask on WhatsApp',
      whatsappMessage: `Hi ${site.name}, please let me know when UK training opens.`,
      contactLabel: 'Contact us',
      contactTo: '/contact',
    },
  },

  // 4.6 Why it matters: CPR rhythm monitor + "Try the rhythm" + learning videos (videos.js)
  whyItMatters: {
    eyebrow: 'Why it matters',
    heading: { lead: 'Every second', accent: 'counts' },
    monitor: {
      // Rate guidance from the plan. TODO(client): confirm the CPR wording.
      lead: 'Hands-only CPR: push hard and fast in the centre of the chest, 100–120 compressions per minute.',
      tie: 'Training lets you practise this rhythm with an instructor before you ever need it.',
      cta: { label: 'Explore first aid training', category: 'first-aid' },
      label: 'Rhythm monitor',
      autoBpm: 110,
      targetBpm: [100, 120],
      bpmUnit: 'BPM',
      targetLabel: 'Target 100–120',
      tapModeLabel: 'Your rhythm',
      ariaLabel: 'Animated heart-rhythm trace at 110 beats per minute',
    },
    game: {
      heading: 'Try the rhythm',
      hint: 'Tap the button in time with compressions. With the button focused, Space or Enter works too.',
      tapLabel: 'Tap',
      tapAriaLabel: 'Tap in rhythm',
      resetLabel: 'Reset',
      idle: 'Start tapping to see your rate.',
      warming: (n) => `Keep going… ${n} more ${n === 1 ? 'tap' : 'taps'}`,
      zones: {
        slow: { label: 'Too slow', advice: 'Push faster' },
        good: { label: 'On target', advice: 'Perfect rhythm' },
        fast: { label: 'Too fast', advice: 'Slow down a little' },
      },
      announce: (bpm, zone) => `${bpm} per minute. ${zone.label}. ${zone.advice}.`,
      // TODO(client): confirm the emergency numbers and the wording of this disclaimer.
      disclaimer:
        'Rhythm practice only, not CPR training. In an emergency call 10177 or 112 from a mobile.',
    },
    videos: {
      heading: 'Learn why it matters',
      comingSoonIntro: 'Short explainer videos are on their way.',
      relatedLabel: 'Related courses',
      chaptersLabel: 'Choose a video',
    },
  },

  // 4.7 How training works + group specials
  howItWorks: {
    eyebrow: 'How it works',
    heading: { lead: 'How training', accent: 'works' },
    // Step names from the plan. TODO(client): confirm, especially what "Certified" covers.
    steps: [
      { title: 'Enquire', text: 'Tell us who needs training and what you need.' },
      { title: 'We tailor it', text: 'We plan the right course, dates and venue with you.' },
      { title: 'Hands-on training', text: 'Practical sessions led by an instructor.' },
      { title: 'Certified', text: 'Learners who complete the course receive a certificate.' },
    ],
  },
  groupSpecials: {
    heading: 'Group booking specials',
    enquireLabel: 'Enquire',
    whatsappMessage: (offer) =>
      `Hi ${site.name}, I'd like to enquire about the "${offer}" group special.`,
    // TODO(client): current group specials as text: { offer, detail, validity }.
    // The subsection is hidden while this list is empty.
    items: [],
  },

  // 4.8 Clients marquee (lib/clients.js); hidden in production while there are no clients.
  clients: { heading: "Companies we've worked with" },
}
