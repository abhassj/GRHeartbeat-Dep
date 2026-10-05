# GR Heartbeat — Website

Frontend-only marketing site for GR Heartbeat (health & safety training), built with React + Vite and deployed on Vercel. See `GR Heartbeat — Website PRD & Implementation Plan.md` for the full plan.

## Stack

- **Vite + React 19** (JavaScript)
- **React Router** (`createBrowserRouter`, lazy-loaded pages)
- **Tailwind CSS v4** via `@tailwindcss/vite`; brand tokens live in `src/styles/index.css` (`@theme`)
- **Motion** (`motion/react`) for animation, **lucide-react** for icons
- **Fontsource**: Plus Jakarta Sans (headings) + Inter (body), self-hosted
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
  assets/         logos, images, svg
  components/
    layout/       RootLayout (Header, Footer, MobileMenu, WhatsAppFab in Phase 1)
    ui/           Button, Card, Badge, Section, Container
    brand/        PulseLine, HeartbeatButton, EcgDivider
    courses/      CourseCard, CourseFilters, CourseFacts
  data/           regions.js, courses.sa.js, courses.uk.js, site.js
  hooks/          useCountUp, useInView
  pages/          Home, CoursesRegion, CourseDetail, About, Contact, NotFound
  routes.jsx      route table
  styles/         index.css (tokens + Tailwind)
  main.jsx
vercel.json       SPA rewrite: all routes → /index.html
```

Import from `src` with the `@/` alias, e.g. `import { regions } from '@/data/regions'`.

## Routes

| Path                    | Page                                      |
| ----------------------- | ----------------------------------------- |
| `/`                     | Home                                      |
| `/courses/:region`      | Course list (`sa` live, `uk` coming soon) |
| `/courses/:region/:slug`| Course detail                             |
| `/about`                | About Us                                  |
| `/contact`              | Contact                                   |
| anything else           | 404                                       |

## Content

All copy and course data lives in `src/data`; components never hard-code content.

### Adding a course

Add one object to `src/data/courses.sa.js` (created in Phase 2). The `slug` becomes the URL: `/courses/sa/<slug>`. See the course data model in the PRD for every field.

### Launching the UK

In `src/data/regions.js`, change `uk.status` from `'coming-soon'` to `'live'`, then add courses to `src/data/courses.uk.js`. No new components are needed.

## Deployment

Vercel builds from `main` (production) and creates a preview URL for every branch / PR. `vercel.json` rewrites every path to `index.html`, so refreshing a deep link like `/courses/sa/first-aid-level-1` works.

Environment variables (e.g. `VITE_WEB3FORMS_KEY`) are set in the Vercel project settings.
