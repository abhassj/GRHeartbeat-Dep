# GR Heartbeat — Website

Frontend-only marketing site for GR Heartbeat (health & safety training), built with React + Vite and deployed on Vercel.

Specs live in `docs/`: the build plan (`GR_Heartbeat_Implementation_Plan_v2.1.md`, primary), the colour system (`GR Heartbeat — Colour Theme.md`, overrides all colours) and the original PRD (background + data model).

## Stack

- **Vite + React 19** (JavaScript)
- **React Router** (`createBrowserRouter`, lazy-loaded pages)
- **Tailwind CSS v4** via `@tailwindcss/vite`; design tokens live in `src/styles/index.css` (`@theme`). Tailwind's default palette is removed, so only brand colours exist (`bg-blue-500` generates nothing)
- **Motion** (`motion/react`) for animation, **Lenis** for smooth scrolling (mouse/trackpad only), **lucide-react** for icons
- **Fontsource**: Montserrat (display, incl. true 800 italic) + Inter (body), self-hosted variable fonts
- **oxlint** (Vite's default linter) + **Prettier** with `prettier-plugin-tailwindcss`

## Getting started

Requires Node 20.19+ (22 or 24 recommended).

```bash
npm install
cp .env.example .env.local   # fill in keys when needed
npm run dev                  # http://localhost:5173
```

## Scripts

| Script                 | What it does                           |
| ---------------------- | -------------------------------------- |
| `npm run dev`          | Start the dev server                   |
| `npm run build`        | Production build into `dist/`          |
| `npm run preview`      | Serve the production build locally     |
| `npm run lint`         | Lint with oxlint                       |
| `npm run format`       | Format everything with Prettier        |
| `npm run format:check` | Check formatting (for CI)              |
| `npm run check:content` | Validate course/video/client data and count TODO(client) markers (`-- --strict` for the launch gate) |

## Project structure

```
src/
  assets/
    brand/        logo (cropped from docs/brand/, WebP for the app)
    placeholders/ stand-in photos until real ones arrive
  components/
    brand/        Logo, WhatsAppIcon, PulseLine, EcgDivider, EcgEdge, HeartbeatButton
    motion/       Reveal, RevealStagger, ImageReveal, Parallax, CountUp, ChromeText,
                  TiltCard, ScrollProgress, Marquee
    ui/           Button, Container, Section, Eyebrow, Heading, Accent, Card, Badge, IconRing
    providers/    MotionProvider (reduced motion), SmoothScroll (Lenis)
    layout/       RootLayout, Navbar (+ CoursesMenu, MobileMenu, MenuToggle, NavBlip),
                  FinalCta, Footer, WhatsAppFab, SkipLink, PageTransition (scroll + focus)
    dev/          SampleContentBanner (development only)
    styleguide/   helpers for the /styleguide page
    courses/      CourseCard, CourseFilters, CourseFacts (Phase 5)
  data/           all copy and content: site, navigation, categories, courses.sa/uk,
                  fixtures/ (sample courses, dev only), privacy, brand, regions, styleguide
  hooks/          useReducedMotionSafe, useSmoothScroll, useFocusTrap, useFabVisibility,
                  useMediaQuery, useElementSize
  lib/            courses.js (the only way to read course data), motion.js, ecg.js,
                  smooth-scroll.js, scroll-positions.js, focus.js, contact.js, icons.js, ...
  pages/          Home, CoursesRegion, CourseDetail, About, Contact, Privacy, NotFound, Styleguide
  routes.jsx      route table
  styles/         index.css (tokens + Tailwind)
  main.jsx
vercel.json       SPA rewrite: all routes → /index.html
```

Import from `src` with the `@/` alias, e.g. `import { regions } from '@/data/regions'`.

## Design system

Open **`/styleguide`** (unlinked, `noindex`) to see every token, primitive and animation, with a floating switch to preview reduced motion. It is removed before launch (Phase 8).

- **Colours:** use the token utilities (`bg-pulse-red`, `text-navy`, `border-line`, `bg-grey-50`, ...). Red is the single action colour; keep it to about 2% of a screen.
- **Sections:** wrap page sections in `<Section tone="white | surface | monitor | red | slate">`. The tone sets the background and the colour of `Heading`, `Eyebrow` and `Accent` inside it.
- **Motion:** take easing, durations and stagger from `src/lib/motion.js`. Animate `transform` / `opacity` only. Every animated component checks `useReducedMotionSafe()` and renders static, fully visible content when motion is reduced. Use `HeartbeatButton` only in the hero and the final CTA, and keep at most one looping animation on screen.
- **Placeholders:** unknown business facts are marked `TODO(client)` in `src/data` (and in placeholder assets). Run `grep -rn "TODO(client)" src` for the open list.

## Routes

| Path                    | Page                                      |
| ----------------------- | ----------------------------------------- |
| `/`                     | Home                                      |
| `/courses/:region`      | Course list (`sa` live, `uk` coming soon) |
| `/courses/:region/:slug`| Course detail                             |
| `/about`                | About Us                                  |
| `/contact`              | Contact (no final CTA band)               |
| `/privacy`              | Privacy notice (placeholder until POPIA notice) |
| `/styleguide`           | Internal design system (removed at launch) |
| anything else           | 404                                       |

## Content

All copy and course data lives in `src/data`; components never hard-code content.

### Courses

Course data is **not** taken from the old website. The client's new list is imported in the Course import step (see the v2.1 plan). Until then `courses.sa.js` and `courses.uk.js` are empty.

- Components read courses only through `src/lib/courses.js` (`getCoursesByRegion`, `getFeaturedCourses`, `hasCourses`, ...), never by slug.
- When a region's real list is empty, development uses the sample fixtures in `src/data/fixtures/courses.sample.js` and shows an amber "Showing sample courses" banner. Production builds never include them (check with `grep -r "Sample course" dist/`). Set `VITE_SAMPLE_CONTENT=true` to preview samples in a production build.
- Every course-dependent component has an empty state for when there are no courses.

### Adding a course

Add one object to `src/data/courses.sa.js`. The fields follow the Course import intake table and are documented in `src/data/courses.schema.js`; the `slug` becomes the URL (`/courses/sa/<slug>`). Run `npm run check:content`: it validates every course (`validateCourse()`) and exits non-zero on errors. The dev server also warns in the console, with the slug and field.

### Other content

- **Facts:** `src/data/site.js` holds only confirmed facts. Unconfirmed items are `null` / `[]` with `TODO(client)` and are not rendered until supplied (for example accreditations and people trained).
- **Photos:** `src/assets/photos/` (WebP, 1200 w and 800 w), with alt text in `src/data/photos.js`. All current photos are placeholders from the old site; see `MANIFEST.md` there.
- **Videos:** `src/data/videos.js`. A `youtubeId` of `null` shows the poster with "Video coming soon": no iframe and nothing clickable. Never invent an ID.
- **Clients:** `src/data/clients.js` (`{ name, logo, alt, url? }`). While it is empty, production renders no clients section; development shows neutral placeholder tiles.
- **Page copy:** `home.js`, `about.js`, `navigation.js`, `categories.js`. Drafted wording is marked `TODO(client)` for review.

### Launching the UK

In `src/data/regions.js`, change `uk.status` from `'coming-soon'` to `'live'`, then add courses to `src/data/courses.uk.js`. No new components are needed.

## Layout behaviour

- Pages render under a floating navbar; `--nav-offset` (in `index.css`) is the space it takes. Every element with an `id` gets that as `scroll-margin-top`, so `#hash` links land below the navbar.
- Route changes fade the page out and in. `PageTransition` then scrolls to the top, to the `#hash` target, or back to the saved position (back/forward and reload), and moves focus to the new page's `<h1>` for screen readers.
- A route can hide the final CTA band with `handle: { finalCta: false }` in `routes.jsx`.

## Deployment

Not deployed until Phase 8; verify locally with `npm run build && npm run preview`.

Vercel builds from `main` (production) and creates a preview URL for every branch / PR. `vercel.json` rewrites every path to `index.html`, so refreshing a deep link like `/courses/sa/first-aid-level-1` works.

Environment variables (e.g. `VITE_WEB3FORMS_KEY`) are set in the Vercel project settings.
