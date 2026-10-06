import { site, yearsOfHistory } from '@/data/site'

// Copy for the layout shell: navbar, courses menu, mobile drawer, final CTA band, footer.

export const skipLinkLabel = 'Skip to content'

export const mainNav = [
  { id: 'home', label: 'Home', to: '/' },
  { id: 'courses', label: 'Courses', menu: 'courses', match: '/courses' },
  { id: 'about', label: 'About Us', to: '/about' },
]

export const navCta = { label: 'Get in touch', to: '/contact' }

// Pre-filled WhatsApp message. TODO(client): review wording.
export const whatsappMessage = `Hi ${site.name}, I'd like to enquire about your training.`

export const navLabels = {
  primary: 'Main',
  whatsapp: 'Chat with us on WhatsApp',
  openMenu: 'Open menu',
  closeMenu: 'Close menu',
  mobileMenu: 'Site menu',
  homeLink: `${site.name} home`,
}

export const coursesMenu = {
  label: 'Courses',
  sa: {
    title: 'South Africa',
    badge: 'Live',
    count: (n) => `${n} ${n === 1 ? 'course' : 'courses'}`,
    featuredHeading: 'Popular courses',
    categoriesHeading: 'Browse by category',
    viewAll: 'View all courses',
    to: '/courses/sa',
  },
  uk: {
    title: 'United Kingdom',
    badge: 'Coming soon',
    line: `We're bringing ${site.name} to the UK.`,
    cta: 'Register interest',
    to: '/courses/uk',
  },
}

export const mobileMenu = {
  callLabel: 'Call',
  whatsappLabel: 'WhatsApp',
  coursesHeading: 'Courses',
  contactLink: { label: 'Contact', to: '/contact' },
}

// Drafted copy. TODO(client): review the heading and text.
export const finalCta = {
  heading: 'Training for your team?',
  text: `Call, WhatsApp or email us and we'll plan training around your people and your site.`,
  callLabel: 'Call us',
  whatsappLabel: 'WhatsApp',
  emailLabel: 'Email us',
  emailSubject: 'Training enquiry',
}

export const footer = {
  // Drafted copy. TODO(client): confirm wording for the rebrand.
  about: `A Durban-based health and safety training academy with ${yearsOfHistory()}+ years of experience.`,
  logoLabel: `${site.name} home`,
  accreditationsHeading: 'Accreditations',
  columns: {
    courses: 'Courses',
    company: 'Company',
    contact: 'Contact',
  },
  courseLinks: {
    sa: { label: 'South Africa', to: '/courses/sa' },
    uk: { label: 'United Kingdom', to: '/courses/uk', badge: 'Coming soon' },
  },
  companyLinks: [
    { label: 'About us', to: '/about' },
    { label: 'Contact', to: '/contact' },
    { label: 'Privacy', to: '/privacy' },
  ],
  companyProfileLabel: 'Company profile (PDF)',
  whatsappLabel: 'WhatsApp',
  privacy: { label: 'Privacy', to: '/privacy' },
  backToTop: 'Back to top',
  copyright: (year) => `© ${year} ${site.fullName}`,
}

export const whatsappFab = {
  label: 'Chat with us on WhatsApp',
  message: whatsappMessage,
}

export const pageTitles = {
  suffix: ` | ${site.name}`,
}
