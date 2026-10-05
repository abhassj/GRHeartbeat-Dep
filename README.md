# GR Heartbeat — Website

Frontend-only marketing site for GR Heartbeat (health & safety training), built with React + Vite and deployed on Vercel.

Specs live in `docs/`: the build plan (`GR_Heartbeat_Implementation_Plan_v2.md`, primary), the colour system (`GR Heartbeat — Colour Theme.md`, overrides all colours) and the original PRD (background + data model).

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

## Project structure

```
src/
  assets/
    brand/        logo (cropped from docs/brand/, WebP for the app)
    placeholders/ stand-in photos until real ones arrive
  components/
    brand/        Logo, PulseLine, EcgDivider, EcgEdge, HeartbeatButton
    motion/       Reveal, RevealStagger, ImageReveal, Parallax, CountUp, ChromeText,
                  TiltCard, ScrollProgress
    ui/           Button, Container, Section, Eyebrow, Heading, Accent, Card, Badge, IconRing
    providers/    MotionProvider (reduced motion), SmoothScroll (Lenis)
    layout/       RootLayout (temporary shell until Phase 2)
    styleguide/   helpers for the /styleguide page
    courses/      CourseCard, CourseFilters, CourseFacts (Phase 5)
  data/           all copy and content (brand, regions, styleguide; site/courses in Phase 3)
  hooks/          useReducedMotionSafe, useMediaQuery, useElementSize
  lib/            motion.js (motion presets), ecg.js (trace geometry), contrast.js, cx.js
  pages/          Home, CoursesRegion, CourseDetail, About, Contact, NotFound, Styleguide
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
| `/contact`              | Contact                                   |
| `/styleguide`           | Internal design system (removed at launch) |
| anything else           | 404                                       |

## Content

All copy and course data lives in `src/data`; components never hard-code content.

### Adding a course

Add one object to `src/data/courses.sa.js` (created in Phase 3). The `slug` becomes the URL: `/courses/sa/<slug>`. See the course data model in the PRD for every field.

### Launching the UK

In `src/data/regions.js`, change `uk.status` from `'coming-soon'` to `'live'`, then add courses to `src/data/courses.uk.js`. No new components are needed.

## Deployment

Not deployed until Phase 8; verify locally with `npm run build && npm run preview`.

Vercel builds from `main` (production) and creates a preview URL for every branch / PR. `vercel.json` rewrites every path to `index.html`, so refreshing a deep link like `/courses/sa/first-aid-level-1` works.

Environment variables (e.g. `VITE_WEB3FORMS_KEY`) are set in the Vercel project settings.
