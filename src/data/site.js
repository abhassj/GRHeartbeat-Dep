import { brand } from '@/data/brand'

/*
 * Business facts used across the site. Content rule: only facts the client has confirmed
 * (12+ years, 20+ courses (unconfirmed), Durban, SA live / UK coming soon, the email) or
 * that come from the plan's contact details. Everything else is null / [] with
 * TODO(client) and is simply not rendered until supplied.
 */
export const site = {
  name: brand.name,
  fullName: brand.fullName,

  // TODO(client): confirm the founding year (the plan says 2013). While null, "years" below
  // is used as given; once set, years are computed from it.
  foundedYear: null,

  location: {
    city: 'Durban',
    country: 'South Africa',
    label: 'Durban, South Africa',
  },

  // From the plan / current site. TODO(client): confirm both numbers for the rebrand.
  phones: [
    { display: '+27 74 461 3719', tel: '+27744613719' },
    { display: '+27 84 011 6596', tel: '+27840116596' },
  ],

  // TODO(client): confirm the WhatsApp number (the plan uses the first phone number).
  whatsapp: { number: '27744613719', display: '+27 74 461 3719' },

  // From the current site. TODO(client): confirm — the rebrand may change it.
  email: 'heartbeattraining@live.com',

  // TODO(client): confirm accreditations, numbers and the registered name they are held
  // under. The plan lists MerSETA 17-QA/ACC/2367/21, Department of Labour
  // C.I.NR 286/3/12/1 and SAIOSH corporate membership. Shape: { id, name, reference }.
  // Nothing is shown until confirmed.
  accreditations: [],

  stats: {
    // Client-supplied figures, shown with a "+". Not the length of the course list.
    // TODO(client): confirm the course count against the new course list (given as 20+).
    courses: 20,
    years: 12,
    // TODO(client): number of people trained, if they want it shown (left out until given).
    peopleTrained: null,
  },

  // TODO(client): social media links (none confirmed yet).
  social: [],

  // TODO(client): supply the company profile PDF (hidden in the footer until set).
  companyProfilePdf: null,
}

/** Years of history: computed from the founding year once confirmed, else the given figure. */
export const yearsOfHistory = () =>
  site.foundedYear ? new Date().getFullYear() - site.foundedYear : site.stats.years
