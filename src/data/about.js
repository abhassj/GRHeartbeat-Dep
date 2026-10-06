import { site, yearsOfHistory } from '@/data/site'

/*
 * About page copy and placeholders. Built in Phase 6; mission and vision also appear on the
 * home page. All wording here is DRAFTED and deliberately generic.
 * TODO(client): review this file and supply the items marked below.
 */

export const about = {
  hero: {
    eyebrow: 'About us',
    title: 'Who we are',
    intro: `${site.name} is a health and safety training academy based in ${site.location.city}, with ${yearsOfHistory()}+ years of experience.`,
    photo: 'cprClass',
  },

  // TODO(client): your mission statement (this is a generic placeholder).
  mission: {
    title: 'Our mission',
    text: 'To give people the practical skills and confidence to keep themselves and others safe.',
  },

  // TODO(client): your vision statement (this is a generic placeholder).
  vision: {
    title: 'Our vision',
    text: 'Safer workplaces and communities, where more people know what to do in an emergency.',
  },

  story: {
    heading: 'Our story',
    intro: `For more than ${yearsOfHistory()} years we have been training people in ${site.location.city}.`,
    // TODO(client): milestones for the timeline: { year, title, text }. Hidden while empty.
    milestones: [],
  },

  // TODO(client): founders' background. The plan mentions emergency care practitioners with
  // 25+ years at the KZN Department of Health, and qualified assessors, facilitators and
  // moderators. Not shown until confirmed.
  founders: { heading: 'Our founders', text: null },

  // Drafted values. TODO(client): review or replace.
  values: [
    {
      title: 'Practical',
      text: 'Skills you can use the moment you need them.',
      icon: 'HeartPulse',
    },
    { title: 'Clear', text: 'Plain language and step-by-step instruction.', icon: 'ShieldCheck' },
    { title: 'Safety first', text: 'Safe habits for work and home.', icon: 'Flame' },
  ],

  team: {
    heading: 'Meet the team',
    // TODO(client): team members: { name, role, photo, alt }. Until then the empty state shows.
    members: [],
    emptyState: {
      title: 'Our team',
      text: 'Team profiles are coming soon. In the meantime, get in touch and we will gladly help.',
      cta: { label: 'Get in touch', to: '/contact' },
    },
  },

  accreditationsHeading: 'Accreditations',
  companyProfileLabel: 'Download our company profile (PDF)',
}
