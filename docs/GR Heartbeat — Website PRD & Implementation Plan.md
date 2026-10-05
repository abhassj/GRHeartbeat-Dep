# GR Heartbeat — Website PRD & Implementation Plan

Oct 5, 2026 · @siddh

## Overview

We are rebuilding heartbeattraining.net from scratch as **GR Heartbeat**: a frontend-only React + Vite (JavaScript) site deployed on Vercel. It replaces the current WordPress/Elementor site. The new site has a rebranded identity, a region split (South Africa live, UK coming soon) and an animated heartbeat motif that makes the site feel alive.

**Goals**

- Rebrand to GR Heartbeat with the new logo and a consistent red / navy / chrome identity on a clean white base.
- Make courses easy to browse: every SA course gets its own detail page (description, requirements, duration, accreditation, how to book).
- Set up a region structure so the UK can launch later without a rebuild.
- Turn visitors into enquiries via call, WhatsApp, email and a contact form.
- Feel alive: a heartbeat / ECG motion language used with restraint.

**In scope**

- Home page, including health and safety awareness videos
- Courses with a SA / UK region dropdown, the SA course listing, individual course detail pages, and a UK coming-soon page
- About Us (Who we are) as a dedicated page
- Contact / enquiry path (see Open questions on whether it gets its own page)
- New logo integration and an animated SVG version of the pulse line
- Responsive layout, accessibility, basic SEO, and deployment on Vercel with a custom domain

**Not in scope (for now)**

- Backend, database, CMS, user accounts
- Online booking or payments
- Student portal and certificate verification
- Full UK course catalogue (coming-soon page only)

## Current site audit

The current [heartbeattraining.net](https://heartbeattraining.net/) is a 4-page WordPress + Elementor site (Home, About Us, Courses, Contact). It has solid trust content and a weak course experience.

| Area | What exists today | Action in redesign |
| --- | --- | --- |
| Business | Durban-based health and safety training academy, founded 2013, serving the public and corporate sectors | Keep. Becomes the SA region story |
| Contact | +27 74 461 3719, +27 84 011 6596 (call / WhatsApp), email | Keep. Add click-to-call and WhatsApp buttons |
| Accreditations | MerSETA 17-QA/ACC/2367/21, Dept of Labour C.I.NR 286/3/12/1, SAIOSH corporate member | Keep. Show prominently on home, courses and about |
| Courses page | 19 course titles listed with no descriptions, no detail pages and no links. "Fall protection plan" appears twice | Rebuild as cards linking to individual detail pages. De-duplicate |
| Course directory | A [PDF course list](https://heartbeattraining.net/wp-content/uploads/2024/08/Course-Directory-1.pdf) holds the real details | Mine it for detail-page content |
| Company profile | [Heartbeat-Profile.pdf](https://heartbeattraining.net/wp-content/uploads/2024/08/Heartbeat-Profile.pdf) | Mine it for About page content; keep it as a download |
| Home | Hero, About teaser, Vision & Mission, stats (courses / years / individuals trained), 3 specialisation areas, group booking specials (3 flyer images), client logos, accreditations | Keep the structure. Redesign all of it. Add videos |
| About | Generic paragraphs + Vision & Mission | Expand into a full Who we are page (team, story, values) |
| Client logos | 10 logos named "Copy of 1-10" | Get original files and company names from the client |

**Bugs and debt on the current site (don't carry these over)**

- The About page CTA shows a placeholder phone number, "(+021) 582 198", left over from the Elementor template.
- Stats render as "0+" without JavaScript, so the real numbers are unknown. Confirm them with the client.
- Image filenames like "Copy of 12.jpg" and no alt text hurt both SEO and accessibility.
- Group booking specials are flyer images with no text, so they are unreadable on mobile and invisible to search engines.
- Grammar issues in the copy ("comprises of", "up skilling", "Qualified Fitting Engineer"). Rewrite during content work.

## Brand & design direction

The site is white and clean, with the logo's red as the single action colour, navy for structure, and the ECG pulse line as the recurring motif.

**Logo assets needed (from the Gemini work)**

- Full horizontal lockup, transparent PNG + SVG (vectorised)
- Lockup without the pulse line, which we redraw as an animated SVG in code
- Square icon (GR + pulse) for the favicon, app icon and social share image

**Colour tokens**

| Token | Hex | Use |
| --- | --- | --- |
| `--red` | #E31B23 | Primary CTAs, pulse line, key highlights |
| `--crimson` | #9B111E | Hover/pressed states, gradient end |
| `--navy` | #1B2A6B | Headings, nav, footer, secondary buttons |
| `--ink` | #111827 | Body text |
| `--muted` | #6B7280 | Secondary text |
| `--surface` | #F5F7FA | Alternating section backgrounds |
| `--white` | #FFFFFF | Page background |
| `--chrome` | #C0C4CC | Dividers and subtle metallic accents only |

**Typography (proposed)**: a bold geometric sans for headings (e.g. Montserrat or Plus Jakarta Sans, matching the logo's heavy italic feel) and Inter for body text. Load both with `font-display: swap` and self-host via Fontsource.

**Making it alive: motion principles**

1. **Signature pulse:** the hero ECG line draws itself on load (SVG stroke-dashoffset), then beats on a loop roughly 1x per second, close to a resting heart rate.
2. **Section dividers:** a thin ECG trace separates major sections and draws in as it scrolls into view.
3. **Heartbeat CTA:** primary buttons get a subtle double-pulse glow (lub-dub) every few seconds, never constant.
4. **CPR rhythm cue:** an optional small detail, e.g. a 100-120 BPM beat indicator near the CPR / First Aid course cards, linking the motion to real CPR compression rate.
5. **Count-up stats and scroll reveals:** fade/slide-up, 300-500 ms, eased, staggered.
6. **Restraint rules:** at most one looping animation in view at a time. Everything respects `prefers-reduced-motion` (static line, no loops). Nothing blocks reading or delays content.

## Sitemap & navigation

&#91;embedded content: sitemap · 3 main pages + region split\]

The Courses nav item is a dropdown with two options. South Africa opens the live course grid, and each course has its own detail page. United Kingdom opens a coming-soon page built on the same template, so launching the UK later is a data change, not a rebuild.

## Page requirements

Every page shares the same header (logo, Home, Courses ▾ SA / UK, About Us, a "Get in touch" CTA) and footer (contact details, accreditations, quick links, WhatsApp). A floating WhatsApp button appears on every page on mobile.

### Home `/`

1. **Hero:** headline + subline, animated ECG pulse line, two CTAs ("Explore SA courses", "Get in touch"). The primary audience is SA, so the SA path leads.
2. **Region selector strip:** "Training in South Africa" (live) / "United Kingdom" (coming soon badge).
3. **Trust bar:** accreditation logos (MerSETA, Dept of Labour, SAIOSH) + "Since 2013".
4. **Why it matters (videos):** 2-3 short videos on why first aid, CPR and workplace safety matter. Lazy-loaded embeds with poster images and captions; no autoplay with sound.
5. **Areas of specialisation:** 3 category cards (First Aid & Emergency Care, Health & Safety Compliance, Emergency Response & Preparedness) linking to filtered course lists.
6. **Stats:** count-up numbers (courses, years, people trained). Real figures come from the client.
7. **About teaser:** short story + vision/mission + link to About Us.
8. **Group booking specials:** text-based cards rebuilt from the flyers, each with an enquire CTA.
9. **Clients:** logo marquee.
10. **Final CTA band:** call / WhatsApp / email.

### Courses: South Africa `/courses/sa`

- Course card grid. Client says 11 courses; the current site lists 18 unique titles (see Open questions).
- Filter chips by category, plus a text search box.
- Card shows title, category, duration, NQF level / accreditation badge and a "View course" link.

### Course detail `/courses/sa/:slug`

- Title, category, short summary, accreditation / unit standard numbers.
- Key facts panel: duration, delivery mode (on-site / in-house), NQF level, certificate validity, group size.
- Sections: who it's for, what you'll learn (outcomes), entry requirements, what to bring, assessment and certification.
- CTAs: "Enquire about this course" (pre-fills the course name in WhatsApp / email / form) and "Book a group".
- Related courses (same category) + breadcrumbs (Courses › South Africa › Course).
- Unknown slug shows a friendly 404 with a link back to SA courses.

### Courses: United Kingdom `/courses/uk`

- Coming-soon page: branded hero with the pulse line, "We're bringing GR Heartbeat to the UK", a short status line ("in progress"), and a "Register interest" CTA (email link or form).
- Built on the same layout as the SA page so it can be switched on later by adding data, with no new components.

### About Us (Who we are) `/about`

- Story since 2013, the founders' background (emergency care practitioners with 25+ years at the KZN Dept of Health), qualified assessors, facilitators and moderators.
- Vision, Mission and Values cards.
- Team section (photos + roles, if the client provides them).
- Accreditations in full + company profile PDF download.
- Clients + CTA band.

### Contact `/contact` (pending decision)

- Contact form (name, phone, email, course of interest, region, message) sent via a form service (no backend).
- Click-to-call, WhatsApp deep link, email, Durban location (embedded map optional).

## Tech stack & architecture

The site is a static single-page app: all content lives in JS data files in the repo, so adding a course is a one-object change with no backend.

| Concern | Choice | Why |
| --- | --- | --- |
| Build | Vite + React, JavaScript | Agreed stack; fast dev server and builds |
| Routing | React Router (data router, `createBrowserRouter`) | Nested routes for `/courses/:region/:slug`; lazy-loaded pages |
| Styling | Tailwind CSS (via `@tailwindcss/vite`) with brand tokens as CSS variables | Fast to build consistently; tokens in one place |
| Animation | Motion (`motion/react`, formerly Framer Motion) + hand-written SVG for the ECG line | Scroll reveals and `useReducedMotion` built in; the pulse stays a lightweight SVG |
| Icons | lucide-react | Tree-shakeable, consistent stroke style |
| SEO / meta | React 19 native `<title>` / `<meta>` in components | Per-page titles and descriptions without an extra library |
| Forms | Web3Forms or Formspree (free tier) | Email delivery with no backend |
| Videos | YouTube (privacy-enhanced) or Vimeo embeds with a lite facade | Keeps heavy video off Vercel bandwidth; fast first load |
| Quality | ESLint + Prettier | Consistent code |
| Hosting | Vercel (Git-connected, preview deploy per branch/PR) | Agreed; free previews for client review |

**Folder structure**

```
src/
  assets/         logos, images, svg
  components/
    layout/       Header, Footer, MobileMenu, WhatsAppFab
    ui/           Button, Card, Badge, Section, Container
    brand/        PulseLine, HeartbeatButton, EcgDivider
    courses/      CourseCard, CourseFilters, CourseFacts
  data/
    courses.sa.js
    courses.uk.js
    site.js       contact details, accreditations, stats, clients
  hooks/          useCountUp, useInView
  pages/          Home, CoursesRegion, CourseDetail, About, Contact, NotFound
  routes.jsx
  styles/         index.css (tokens, Tailwind)
  main.jsx
vercel.json       SPA rewrite: all routes → /index.html
```

**Course data model**

```js
{
  slug: 'first-aid-level-1',
  region: 'sa',                 // 'sa' | 'uk'
  title: 'First Aid Level 1',
  category: 'first-aid',        // first-aid | compliance | emergency-response
  summary: 'One or two sentences.',
  duration: '1 day',
  nqfLevel: 1,                  // optional
  unitStandards: ['119567'],    // optional, from course directory
  accreditation: 'SAIOSH',      // optional
  certificateValidity: '3 years',
  audience: ['...'],
  outcomes: ['...'],
  requirements: ['...'],
  whatToBring: ['...'],
  assessment: '...',
  featured: false,
}
```

The region route reads a `regions` config (`{ sa: { status: 'live' }, uk: { status: 'coming-soon' } }`). Launching the UK later means flipping its status and filling `courses.uk.js`.

**Vercel gotcha:** SPA deep links (e.g. refreshing `/courses/sa/first-aid-level-1`) return 404 without a rewrite in `vercel.json`. This is set up in Phase 0.

## Non-functional requirements

The bar: Lighthouse 90+ on all four categories on mobile, fully usable from 360 px wide, and readable with animations off.

| Area | Requirement |
| --- | --- |
| Performance | LCP < 2.5 s on 4G, JS bundle < 200 KB gzipped for the initial route, route-level code splitting, images in WebP/AVIF with explicit width/height, videos load only on click |
| Responsiveness | Mobile-first; breakpoints at 640 / 768 / 1024 / 1280 px. Most SA visitors will likely be on phones |
| Accessibility | WCAG 2.1 AA: semantic landmarks, keyboard-operable nav dropdown, visible focus rings, alt text on every image, 4.5:1 contrast (check red-on-white text sizes), `prefers-reduced-motion` honoured |
| SEO | Unique title + meta description per page, Open Graph image, `sitemap.xml` + `robots.txt`, descriptive slugs, course pages with real text (not images) |
| Browser support | Last 2 versions of Chrome, Safari (incl. iOS), Edge, Firefox; Samsung Internet |
| Maintainability | All copy and course data in `src/data`; no hard-coded course content inside components |
| Analytics | Vercel Web Analytics (privacy-friendly, no cookie banner needed) |

SPA limitation: search engines render JS fine today, but SEO is weaker than a pre-rendered site. If organic search becomes a priority, add pre-rendering of the routes later (e.g. `vite-plugin-prerender` or a move to a static framework). Flag this to the client.

## Implementation plan

There are nine phases. Each phase ends with a Vercel preview URL, so the client can review continuously. Phases 3-5 can overlap once Phase 1 is done, but a phase isn't "done" until its done-criteria pass.

### Phase 0: Setup & foundations

Goal: an empty but production-shaped app, deployed to Vercel, with routing, tokens and tooling in place.

- [ ] Create the GitHub repo (`gr-heartbeat-web`) with a `main` branch + feature-branch workflow
- [ ] Scaffold: `npm create vite@latest gr-heartbeat-web -- --template react`
- [ ] Install core deps: `react-router`, `motion`, `lucide-react`
- [ ] Install Tailwind: `tailwindcss @tailwindcss/vite`, register the plugin in `vite.config.js`, `@import "tailwindcss"` in `index.css`
- [ ] Define brand tokens (colours, fonts, radii, shadows) as CSS variables + Tailwind `@theme`
- [ ] Self-host fonts via Fontsource (heading font + Inter)
- [ ] ESLint (Vite default) + Prettier + `prettier-plugin-tailwindcss`; add `lint` and `format` scripts
- [ ] Create the folder structure from the architecture section; add a path alias `@/` → `src/`
- [ ] Router skeleton: `/`, `/courses/:region`, `/courses/:region/:slug`, `/about`, `/contact`, `*` (404), each a placeholder page, lazy-loaded
- [ ] `ScrollToTop` on route change
- [ ] `vercel.json` with the SPA rewrite to `/index.html`
- [ ] Connect the repo to Vercel, confirm production deploy from `main` and preview deploys on PRs
- [ ] Placeholder favicon + `<title>`; `.env.example` for the form service key
- [ ] README: setup, scripts, how to add a course

Done when: the live Vercel URL loads, every route renders its placeholder, refreshing a deep link doesn't 404, and lint passes.

### Phase 1: Design system & brand components

- [ ] UI primitives: `Button` (primary red, secondary navy, ghost), `Container`, `Section`, `Card`, `Badge`, `Heading`
- [ ] `PulseLine` SVG component: draws in, then loops; props for speed, colour and loop on/off; static under reduced motion
- [ ] `EcgDivider`, the scroll-triggered draw-in variant
- [ ] `HeartbeatButton`, the primary CTA with the lub-dub glow
- [ ] Header: logo, nav, Courses dropdown (SA / UK with a "Coming soon" badge), keyboard + hover + click support, sticky on scroll
- [ ] Mobile menu (drawer) + floating WhatsApp button
- [ ] Footer: contacts, accreditations, quick links, © year
- [ ] Drop in the final logo (SVG) once vectorised
- [ ] A hidden `/styleguide` route showing every component, for quick review

Done when: header, footer and all primitives are on the preview, and the dropdown works by keyboard and on mobile.

### Phase 2: Content & data layer

- [ ] Extract course details from the Course Directory PDF + company profile PDF
- [ ] Send the client the content checklist (below) and resolve the 11 vs 18 course list
- [ ] Write `courses.sa.js` (all fields), `courses.uk.js` (empty), `site.js` (contacts, stats, accreditations, clients, specials)
- [ ] Helpers: `getCoursesByRegion`, `getCourseBySlug`, `getRelatedCourses`, `getCategories`
- [ ] Rewrite and tighten all copy (fix grammar from the audit)
- [ ] Optimise all images (rename, compress, WebP)

Done when: every SA course has a complete data object and no page needs a copy change in JSX to update content.

### Phase 3: Home page

- [ ] Hero with the animated pulse line + CTAs
- [ ] Region selector strip
- [ ] Trust / accreditation bar
- [ ] Videos section (lite embed facade, posters, captions)
- [ ] Specialisation category cards → filtered SA course list
- [ ] Stats with count-up
- [ ] About teaser, vision and mission
- [ ] Group booking specials as text cards
- [ ] Clients marquee
- [ ] Final CTA band

Done when: the full home page is on preview, responsive at 360 / 768 / 1280, and client feedback is round-tripped.

### Phase 4: Courses (SA, detail, UK)

- [ ] `/courses/sa` grid with category filter chips + search (filters synced to the URL query so they can be shared)
- [ ] `CourseCard` with hover lift + badge
- [ ] `/courses/sa/:slug` detail page: summary, facts panel, sections, enquiry CTAs with a pre-filled course name, related courses, breadcrumbs
- [ ] WhatsApp deep link: `https://wa.me/27744613719?text=` + encoded "Hi, I'd like to enquire about \<course>"
- [ ] `/courses/uk` coming-soon page + register interest
- [ ] Unknown region or slug → 404 page
- [ ] Per-course page title + meta description

Done when: every course is reachable from the grid, every detail page renders from data, and enquiry links open WhatsApp/email with the course name.

### Phase 5: About Us & Contact

- [ ] About: story, founders, vision / mission / values, team, accreditations, profile PDF download, clients
- [ ] Contact form wired to Web3Forms/Formspree, with validation, success and error states, and a honeypot against spam
- [ ] Contact details, click-to-call, map (optional)

Done when: a test submission arrives in the client's inbox.

### Phase 6: Motion & polish pass

- [ ] Scroll reveals across all pages (consistent timing)
- [ ] Tune pulse speeds; make sure only one loop is visible at a time
- [ ] Full reduced-motion audit
- [ ] Micro-interactions: hover states, focus states, page transitions (subtle)
- [ ] Spacing / typography consistency review against the styleguide

### Phase 7: QA, performance, accessibility & SEO

- [ ] Lighthouse mobile ≥ 90 on Home, SA courses, one detail page, About
- [ ] Keyboard-only and screen-reader pass (VoiceOver / NVDA)
- [ ] Cross-browser + real-device check (iPhone Safari, Android Chrome)
- [ ] Meta titles / descriptions, OG image, `sitemap.xml`, `robots.txt`
- [ ] Check all links, phone numbers, emails and WhatsApp links
- [ ] Enable Vercel Web Analytics

### Phase 8: Client sign-off & launch

- [ ] Final client review on the preview URL; collect sign-off in writing
- [ ] Add the custom domain in Vercel; update DNS (A / CNAME) at the registrar
- [ ] Set up 301 redirects from the old WordPress URLs (`/about-us/` → `/about`, `/contact-us/` → `/contact`, `/courses/` → `/courses/sa`) in `vercel.json`
- [ ] Verify HTTPS, then decommission or archive the WordPress site
- [ ] Submit the sitemap to Google Search Console
- [ ] Handover: README on adding / editing courses and turning on the UK

## Client content checklist

Send this to the client at the start of Phase 2. Missing content is the most likely cause of delay, not code.

- [ ] Final course list for SA (the exact 11, or confirm the full 18)
- [ ] Per course: summary, duration, NQF level / unit standards, entry requirements, what to bring, certificate validity, delivery mode (on-site / in-house), and price if they want it shown
- [ ] Videos for the home page (their own files or approved YouTube links) + any captions
- [ ] Real stats: number of courses, years, people trained
- [ ] Team photos, names and roles for About Us
- [ ] Original client logo files + company names (for alt text)
- [ ] Group booking specials as text (offer, price, validity), not just flyer images
- [ ] High-res accreditation logos (MerSETA, Dept of Labour, SAIOSH) + permission to display them
- [ ] Course / training photos (real photos beat stock for trust)
- [ ] Preferred contact email for form submissions
- [ ] UK: the message for the coming-soon page and whether to collect interest sign-ups
- [ ] Domain registrar access (for DNS at launch)

## Open questions & risks

**Open questions for the client**

- [ ] **"Two landing pages for SA and UK"**: is this only the Courses split (assumed in this plan), or should each region get its own home page with different hero, contacts and accreditations?
- [ ] **11 vs 18 courses**: which courses are in? Are TLB, Hyster and the construction equipment courses still offered?
- [ ] **Contact page**: keep a dedicated Contact page (current site has one), or only the footer, CTAs and WhatsApp? The client named 3 pages.
- [ ] **Domain**: stay on heartbeattraining.net or move to a new GR Heartbeat domain? This affects redirects and SEO.
- [ ] **Brand name in copy**: "GR Heartbeat" vs "GR Heartbeat Training Academy & Consulting". Do the accreditations still list the old company name?
- [ ] **Prices**: show course prices on the site or keep "enquire for pricing"?
- [ ] **Region default**: should the site remember the visitor's chosen region, or auto-suggest by location?

**Risks**

| Risk | Impact | Mitigation |
| --- | --- | --- |
| Course content arrives late or incomplete | Detail pages stall | Seed from the course directory PDF; launch with summary-level pages and enrich later |
| Too much animation feels gimmicky or slows phones | Hurts trust and performance | Restraint rules in the brand section; Lighthouse gate in Phase 7 |
| Large self-hosted videos | Slow loads, Vercel bandwidth costs | Use YouTube/Vimeo embeds with a click-to-load facade |
| Logo text garbled from AI generation | Unprofessional brand | Use vectorised logo; set the subtitle as live text if needed |
| Accreditation numbers tied to the old business name | Credibility or compliance issue | Client confirms how the rebrand is reflected with MerSETA / DoL |
| SPA SEO weaker than a static site | Lower organic reach | Solid meta + sitemap now; add pre-rendering later if needed |
| Scope creep (booking, payments, portal) | Timeline slips | Keep it in the not-in-scope list; quote separately |
