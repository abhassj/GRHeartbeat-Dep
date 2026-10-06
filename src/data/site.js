import { brand } from '@/data/brand'

// Business facts used across the site. Only facts stated in the plan / current site.
export const site = {
  name: brand.name,
  fullName: brand.fullName,
  foundedYear: 2013,

  location: {
    city: 'Durban',
    country: 'South Africa',
    label: 'Durban, South Africa',
  },

  phones: [
    { display: '+27 74 461 3719', tel: '+27744613719' },
    { display: '+27 84 011 6596', tel: '+27840116596' },
  ],

  whatsapp: { number: '27744613719', display: '+27 74 461 3719' },

  // From the current site. TODO(client): confirm — the rebrand may change it.
  email: 'heartbeattraining@live.com',

  accreditations: [
    { id: 'merseta', name: 'MerSETA', reference: '17-QA/ACC/2367/21' },
    { id: 'dol', name: 'Department of Labour', reference: 'C.I.NR 286/3/12/1' },
    { id: 'saiosh', name: 'SAIOSH', reference: 'Corporate member' },
  ],

  stats: {
    // A client-supplied figure, not the length of the course list.
    // TODO(client): confirm against the new course list.
    courses: 20,
    peopleTrained: 7000,
  },

  // TODO(client): social media links (none confirmed yet).
  social: [],

  // TODO(client): supply the company profile PDF (hidden in the footer until set).
  companyProfilePdf: null,
}

/** Years since founding, computed so it never goes stale. */
export const yearsOfHistory = () => new Date().getFullYear() - site.foundedYear
