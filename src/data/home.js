import { about } from '@/data/about'
import { site, yearsOfHistory } from '@/data/site'

/*
 * Home page copy, sections 4.1–4.8 of the plan. Built in Phase 4.
 * All wording here is DRAFTED and deliberately generic. TODO(client): review this file.
 * Facts used: Durban, 12+ years, 20+ courses (unconfirmed). Courses, pillars and chips come
 * from lib/courses.js; photos are ids from data/photos.js.
 */

const stat = (key, value, label) => (value == null ? null : { key, value, suffix: '+', label })

export const home = {
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
    // Shown until the hero video exists (and always under reduced motion / save-data).
    poster: 'cprCompressions',
    // TODO: AI-generated hero loop (≤ 3 MB) in /public/media/hero/; client to review.
    video: { mp4: null, webm: null },
    videoLabels: { pause: 'Pause background video', play: 'Play background video' },
    scrollCue: 'Scroll to explore',
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
      stat('courses', site.stats.courses, 'Courses'),
      stat('years', yearsOfHistory(), 'Years of experience'),
      stat('people', site.stats.peopleTrained, 'People trained'),
    ].filter(Boolean),
    moreLink: { label: 'More about us', to: '/about' },
  },

  // 4.4 What we do (pillars = categories, via getPillars())
  whatWeDo: {
    eyebrow: 'What we do',
    heading: { lead: 'Three areas of', accent: 'training' },
    chipsLabel: 'Courses include',
    seeCourses: 'See courses',
  },

  // 4.5 Find your course (via getFindYourCourse())
  findCourse: {
    eyebrow: 'Courses',
    heading: { lead: 'Find your', accent: 'course' },
    regions: { sa: 'South Africa', uk: 'United Kingdom' },
    viewAll: (n) => `View all ${n} South African courses`,
    // Shown while no courses are published (plan wording).
    emptyLine: 'Our full course list is being updated — call or WhatsApp us for current courses.',
    uk: {
      heading: `We're bringing ${site.name} to the UK`,
      text: 'Register your interest and we will let you know when UK training opens.',
      cta: 'Register interest',
      emailSubject: 'UK training: register interest',
    },
  },

  // 4.6 Why it matters: CPR monitor + learning videos (videos.js)
  whyItMatters: {
    eyebrow: 'Why it matters',
    heading: 'Why it matters',
    monitor: {
      // Rate guidance from the plan. TODO(client): confirm the CPR wording.
      lead: 'Hands-only CPR: push hard and fast in the centre of the chest, 100–120 compressions per minute.',
      tie: 'Training lets you practise this rhythm with an instructor before you ever need it.',
      cta: { label: 'Explore first aid training', category: 'first-aid' },
      targetBpm: [100, 120],
      autoBpm: 110,
      bpmUnit: 'BPM',
      tryLabel: 'Try the rhythm',
      tapLabel: 'Tap',
      hint: 'Tap the button (or press Space) in time with compressions.',
      feedback: {
        slow: 'Too slow, push faster',
        good: 'Perfect rhythm',
        fast: 'Too fast, slow down',
      },
      note: 'Practice tool only — not a substitute for certified training.',
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
