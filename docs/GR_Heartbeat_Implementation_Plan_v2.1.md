# GR Heartbeat — Implementation Plan v2 (Phases 1–8)

Oct 6, 2026 · v2.1 · Supersedes the "Implementation plan" section of *GR Heartbeat — Website PRD & Implementation Plan*. Phase 0 (setup & foundations) and Phase 1 (design system) are **done**.

> **v2.1 change:** courses are **not** seeded from the old website. The client is sending a new course list, which gets imported in the separate **Course import** step (after Phase 6). Until then the site runs on clearly-marked sample fixtures in development and shows "coming soon" states in production. Every section that depends on courses must handle an empty list.

## How to use this document

This is the build spec for Claude Code. It travels with three other inputs:

| Input | What it is | Authority |
| --- | --- | --- |
| This file | Phases, page specs, animation spec, done-criteria | **Primary.** Follow phase by phase |
| `GR_Heartbeat_Colour_Theme.md` | Colour tokens, ramps, component colour rules, contrast table, CSS/Tailwind code | **Overrides all colours in the old PRD** (the old `#E31B23 / #9B111E / #1B2A6B` values are retired) |
| `GR_Heartbeat_Website_PRD.md` | Original PRD: goals, audit, sitemap, data model, non-functional requirements | Background + data model. Its home page list and phases are replaced by this file |
| `GR_Heartbeat_logo.png` | Final brand lockup (white background, raster) | Use as-is until an SVG arrives |

**Rules of engagement for every phase**

1. Work one phase at a time. At the end of each phase, stop, list what was built, and list anything that needs a decision.
2. Never invent facts about the business (course details, prices, accreditation numbers, names, testimonials). Use placeholder content marked `TODO(client):` in `src/data/*`, so it is easy to grep before launch.
3. All copy and content live in `src/data/`. Components never hard-code business content.
4. Every animation must have a reduced-motion fallback (`useReducedMotion` from `motion/react`, or a CSS `prefers-reduced-motion` block). Content must never be hidden if JS or animation fails.
5. Ask before adding any dependency not listed in this file.
6. Commit at the end of each phase: `feat(phase-N): <summary>`.
7. **No Vercel deployment until Phase 8.** Verify locally with `npm run build && npm run preview`.
8. **No course content from the old website.** Don't copy course titles, descriptions or slugs from heartbeattraining.net. Course data comes only from the client's new list (see Course import). Components must never reference a specific course slug; they reach courses through the helpers in `src/lib/courses.js`.

---

## Stack (locked)

| Concern | Choice |
| --- | --- |
| Build | Vite + React 19, JavaScript (no TypeScript) |
| Routing | `react-router` (data router, `createBrowserRouter`, lazy routes) — already set up in Phase 0 |
| Styling | Tailwind CSS v4 via `@tailwindcss/vite`, tokens in `@theme` (from the Colour Theme doc) |
| Animation | `motion` (`motion/react`): `useScroll`, `useTransform`, `useInView`, `AnimatePresence`, `LayoutGroup` |
| Smooth scroll | `lenis` (`lenis/react`), disabled under reduced motion and on touch devices |
| Icons | `lucide-react` |
| Fonts | Fontsource: **Montserrat** (headings: 700/800, plus 800 italic for display words, matching the logo) and **Inter** (body: 400/500/600) |
| Forms | Web3Forms (access key in `.env` as `VITE_WEB3FORMS_KEY`) |
| Video | Hero loop self-hosted in `/public/media/` (≤ 3 MB). Learning videos as YouTube-nocookie embeds behind a click-to-load facade |
| Hosting | Vercel (Phase 8 only) |

Anything not on this list needs approval. In particular: no GSAP, no UI kits (shadcn/MUI/Chakra), no carousel libraries (build the marquee and sliders by hand).

---

## Design rules (summary — the Colour Theme doc is the full source)

- **Palette:** white page, `surface` #FAFAFA cards, `line` #EFEFF0 borders, ink #1A1A1A headings, body #4D4D4D text, **Pulse Red #DC1820** as the single action colour (about 2% of any screen), crimson #A4141C for hover/pressed, navy #142458 for small supporting text, slate #474E5A footer, monitor #15181D for the one dark section, chrome gradient for thin accents only.
- **Type scale:** display 56–72 px (Montserrat 800, tight leading 1.05, slight negative tracking); h2 36–44 px; h3 22–24 px; body 17–18 px (Inter, leading 1.65); eyebrows 12–13 px uppercase navy, 0.12em tracking. Use `clamp()` for fluid sizes.
- **Shape:** 16 px card radius, pill buttons (like BHF), 24 px section-panel radius for large rounded panels.
- **Spacing:** sections 96–128 px vertical on desktop, 64–80 px on mobile. Max content width 1240 px.
- **Signature motifs:** the ECG pulse line, the ECG-edged red band, the chrome gradient, the lub-dub CTA glow, and the monitor grid.

---

## Motion system (build in Phase 1, use everywhere)

All motion presets live in `src/lib/motion.js` so timing is consistent.

| Token | Value | Used for |
| --- | --- | --- |
| `ease.out` | `[0.22, 1, 0.36, 1]` | Reveals, entrances |
| `ease.inOut` | `[0.65, 0, 0.35, 1]` | Morphs, crossfades |
| `dur.fast` | 0.2 s | Hovers, taps |
| `dur.base` | 0.5 s | Reveals |
| `dur.slow` | 0.9 s | Hero entrance, image reveals |
| `stagger` | 0.08 s | Lists, grids |

**Animation catalogue** (each is a reusable component or hook):

| Name | What it does | Where |
| --- | --- | --- |
| `<Reveal>` | Fade + 24 px rise when 20% in view, once | Every section heading, text block, card |
| `<RevealStagger>` | Staggers children with `stagger` | Card grids, lists, stat rows |
| `<ImageReveal>` | `clip-path: inset(0 0 100% 0)` → `inset(0)` + a scale 1.15 → 1 on the inner image | All feature photos |
| `<Parallax>` | Translates its child −8%…+8% of height via `useScroll` | Bento photos, What-we-do image, About page |
| `<PulseLine>` | SVG ECG path: draws in with `pathLength` 0 → 1, then a bright "blip" travels along it every ~1 s (resting heart rate) | Hero seam, section dividers, footer top |
| `<EcgDivider>` | Thin full-width `PulseLine` that draws once when scrolled into view | Between major sections (max 3 on the home page) |
| `<EcgEdge>` | SVG mask making a band's bottom (or a video's left) edge an ECG trace | Hero video seam, final CTA band |
| `<HeartbeatButton>` | Primary CTA with the `lub-dub` glow (two beats on a 5 s cycle); magnetic hover (button shifts ≤ 6 px towards the cursor) | Hero + final CTA only |
| `<CountUp>` | Animates 0 → value over 1.6 s when in view; uses `Intl.NumberFormat` | Stats |
| `<ChromeText>` | Chrome-gradient text with a slow sheen sweep on reveal | Stat numbers |
| `<Marquee>` | CSS-transform infinite loop, pause on hover/focus, duplicated track | Clients, trust strip on mobile |
| `<ScrollProgress>` | A 2 px Pulse Red line at the very top of the viewport that fills with scroll progress, with a small ECG blip at its leading edge | Global, under the navbar |
| `<TiltCard>` | ≤ 4° 3D tilt following the cursor + a light glare; disabled on touch | Course cards, region cards |
| Page transition | Route content fades out/in (0.25 s), with a red ECG line sweeping across the top once | Between routes |

**Restraint rules (non-negotiable):**
- At most one looping animation visible at a time (hero pulse, the CPR monitor, *or* the marquee).
- Never animate layout properties. Use `transform` and `opacity` only (`clip-path` is OK for image reveals).
- Everything is static and fully visible under `prefers-reduced-motion: reduce`. Lenis off, marquees become static grids, `PulseLine` renders fully drawn without the blip, `CountUp` shows the final value.
- Pause off-screen loops (`useInView`) to save battery.

---

## Assets

| Asset | Path | Status |
| --- | --- | --- |
| Logo lockup | `src/assets/brand/gr-heartbeat-logo.png` | Have (raster, white background). Crop the empty margins. On white backgrounds, use it directly. In the slate footer, place it inside a white rounded chip until a reversed SVG is provided. `TODO(client): SVG + reversed version` |
| Favicon | Crop of the GR monogram → `public/favicon.svg` / `.png` | Make from the logo |
| Hero video | `public/media/hero/hero-loop.mp4` + `.webm` + `hero-poster.jpg` | `TODO: AI-generated`. Until then, show the poster with a slow Ken Burns zoom |
| Training photos | `src/assets/photos/` | Download from the current site's `wp-content/uploads/2024/08/` (the CPR class photos, hi-vis worker photo). Rename descriptively, convert to WebP, max 1600 px wide |
| Accreditation logos | `src/assets/accreditations/` | `TODO(client)`. Use text badges until then |
| Client logos | `src/assets/clients/` | `TODO(client)`. Use the existing "Copy of 1–10" images as placeholders |
| Learning videos | YouTube IDs in `src/data/videos.js` | `TODO: AI-generated, client-reviewed`. Show poster + "Coming soon" when the ID is `null` |

---

## Phase 1 — Design system & brand components

**Goal:** every building block exists and is visible on a `/styleguide` route before any page is built.

- [x] Replace Phase 0 tokens with the Colour Theme doc's `@theme` block (colours, ramps, gradients, shadows, radii) + the `lub-dub`, `.text-chrome`, `.bg-monitor-grid` utilities
- [x] Fontsource: Montserrat 700/800/800-italic, Inter 400/500/600. Set `--font-display` and `--font-body` in `@theme`
- [x] `src/lib/motion.js` (presets above) + `src/hooks/useReducedMotionSafe.js`
- [x] Lenis provider in the root layout (off for reduced motion and touch)
- [x] UI primitives: `Button` (primary / secondary / ghost / white-on-red; sizes sm, md, lg; renders `<a>` or `<Link>` or `<button>`), `Container`, `Section` (tone: white, surface, monitor, red, slate), `Eyebrow`, `Heading` (h1–h4 with display option), `Card`, `Badge` (red-tint, amber, navy, success), `IconRing` (chrome ring)
- [x] Animation components: everything in the catalogue except `<Marquee>` and the page transition (those come in Phase 2)
- [x] `/styleguide` route (dev only, not linked) showing every component in every variant, with a reduced-motion toggle to preview the fallbacks

**Done when:** `/styleguide` shows every component, `npm run build` passes, lint passes, and toggling reduced motion leaves everything visible and static.

## Phase 2 — Layout shell: navbar, footer, global motion

**Navbar**
- [ ] Floating white pill, inset 16 px from the viewport edges, 72 px tall, sits over the hero. On scroll past 24 px it gains `shadow-card` and a 92% white background with `backdrop-blur`, and its height shrinks to 64 px (animated).
- [ ] Hides on scroll down, reveals on scroll up (past the hero only).
- [ ] Left: logo (links home). Centre: Home, Courses ▾, About Us. Right: a WhatsApp icon button + "Get in touch" primary pill.
- [ ] Active link: the underline is a tiny ECG blip SVG that draws in (also on hover). Animate between links with `layoutId`.
- [ ] **Courses dropdown** = a small mega panel (opens on hover with a 120 ms intent delay, on click, and with Enter/Space/Arrow keys; closes on Esc/blur). It holds two `TiltCard` region cards:
  - South Africa: "Live" badge, course count from data, up to 3 featured course links from `getFeaturedCourses('sa')`, "View all →". When there are no courses, it shows the 3 categories instead and no count.
  - United Kingdom: amber "Coming soon" badge, one line, "Register interest →".
  - The panel scales from 0.96 + fades; region cards stagger in.
- [ ] Mobile (< 1024 px): hamburger morphs into an X; full-screen drawer slides from the right with staggered links; SA/UK as two big cards; Call + WhatsApp buttons pinned to the bottom. Lock body scroll while open; trap focus.
- [ ] Fully keyboard-operable, `aria-expanded` / `aria-controls` correct, skip-to-content link.

**Footer + final CTA band**
- [ ] `FinalCta` band: Pulse Red background with an `EcgEdge` bottom edge. Headline "Training for your team?", subtext, three buttons (Call, WhatsApp, Email; white-on-red style). It overlaps into the footer.
- [ ] Footer on slate: four columns (Brand: logo chip + 2-line about + accreditation numbers; Courses: SA, UK coming soon, 3 categories; Company: About, Contact, Company profile PDF; Contact: both numbers, email, Durban). 1 px grey-600 column dividers (BHF pattern). Links hover to red-100 with a 2 px slide.
- [ ] A `PulseLine` draws across the top border when the footer enters view.
- [ ] Bottom bar on grey-800: © {current year} GR Heartbeat Training Academy & Consulting, Privacy, and a circular back-to-top button (it smooth-scrolls via Lenis).
- [ ] Mobile: columns collapse into accordions.

**Global**
- [ ] `<ScrollProgress>` under the navbar
- [ ] `<WhatsAppFab>`: bottom-right on mobile and desktop. It appears after 400 px of scroll, with a one-time pulse. Deep link `https://wa.me/27744613719?text=` + encoded message.
- [ ] Route transitions (`AnimatePresence` + `useLocation`), plus `ScrollToTop` (already exists from Phase 0) reset to work with Lenis
- [ ] `<Marquee>` component

**Done when:** every route shows the navbar and footer; the dropdown works by mouse, keyboard and touch; the mobile drawer traps focus; and the build passes.

## Phase 3 — Content & data layer

- [ ] `src/data/site.js`: brand name, phones (+27 74 461 3719, +27 84 011 6596), email `TODO(client)`, location (Durban, South Africa), WhatsApp number, accreditations (MerSETA 17-QA/ACC/2367/21; Department of Labour C.I.NR 286/3/12/1; SAIOSH corporate member), founded year **2013**, stats (`courses: 20` marked `TODO(client): confirm against the new course list`, `peopleTrained: 7000`, `years` **computed from 2013** — never hard-coded), social links `TODO(client)`. The `courses` stat is a client-supplied figure, not the length of the course array (the client may offer more courses than are listed online).
- [ ] `src/data/regions.js`: `{ sa: { name: 'South Africa', status: 'live' }, uk: { name: 'United Kingdom', status: 'coming-soon' } }`
- [ ] `src/data/categories.js`: `first-aid` (First Aid & Emergency Care), `compliance` (Health & Safety Compliance), `emergency-response` (Emergency Response & Fire). Each has a title, short line, icon name, image and colour accent. Mark the file `TODO(client): confirm categories once the new course list arrives`. The new list may add or rename categories, so nothing outside this file may hard-code a category id.

**Courses: schema and fixtures only (no real course content yet)**
- [ ] `src/data/courses.schema.js`: the course data model from the PRD, written as a JSDoc `@typedef` plus a small `validateCourse()` function. It checks required fields (`slug`, `region`, `title`, `category`, `summary`), that `category` exists in `categories.js`, and that slugs are unique. Add two optional fields: `price` (string, or `null` for "enquire for pricing") and `deliveryMode`. In development, log validation errors to the console; never throw in production.
- [ ] `src/data/courses.sa.js` and `src/data/courses.uk.js`: both `export default []`, each with a header comment: `TODO(client): new course list pending — import via the Course import step`.
- [ ] `src/data/fixtures/courses.sample.js`: 6 obviously generic sample courses, 2 per category, for building and testing the UI. Rules:
  - Titles follow the pattern "Sample course — First aid (1-day)". Don't use real course names, old-site names or invented accreditation numbers.
  - Each sample has `sample: true` and fills every field, so every layout state (long titles, missing NQF level, price vs no price, many outcomes) is exercised. Use lorem-style copy that is clearly not real.
  - Mark 4 of them as `featured: true`.
- [ ] `src/lib/courses.js`: helpers `getCoursesByRegion`, `getCourseBySlug`, `getFeaturedCourses`, `getRelatedCourses`, `getCoursesByCategory`, `getCategories` and `hasCourses(region)`. Data source rule:
  - If the region's real data file is non-empty, use only real data.
  - Otherwise, use the sample fixtures **only** when `import.meta.env.DEV` is true or `VITE_SAMPLE_CONTENT=true`. Production builds never include samples, so the fixtures file must be dynamically imported or tree-shaken out. Verify this by grepping `dist/` for "Sample course".
  - Otherwise return `[]`.
- [ ] `src/components/dev/SampleContentBanner.jsx`: a thin amber bar at the top of the page, "Showing sample courses — real course list pending". It shows whenever sample fixtures are in use.
- [ ] **Empty states are a requirement, not an afterthought.** Every consumer of course data (navbar dropdown, featured grid, sticky-scroll chips, course list page, contact form course select, footer) must render a sensible state when `hasCourses('sa')` is false. Each one is specified in its section below.
- [ ] `src/data/home.js`: hero copy (motto `"Ready when it matters."` + alternates `"Train today. Save a life tomorrow."` and `"Skills that keep hearts beating."`), subline, mission, vision, What-we-do pillars, process steps, group specials (`TODO(client)`), CPR monitor copy.
- [ ] `src/data/videos.js`: the 3 learning videos (`first-aid`, `ohs`, `fire`), each with title, key fact, duration, YouTube ID (`null`), poster, and a `relatedCategory` (a category id, not a course slug).
- [ ] `src/data/clients.js`: name + logo per client.
- [ ] Download, rename and convert the current site's photos (see Assets). Photos only; no course text.

**Done when:**
- `grep -r "TODO(client)" src/data` lists every open content item, and no component contains business copy.
- `courses.sa.js` is empty and the dev server shows the sample courses with the amber banner.
- `npm run build` contains no "Sample course" text in `dist/`.
- `validateCourse()` passes on every fixture.

## Phase 4 — Home page (the showpiece)

Build the sections in this order. Section tones alternate as shown so the page has rhythm without new colours.

| # | Section | Tone |
| --- | --- | --- |
| 1 | Hero | White + video |
| 2 | Trust strip | Surface |
| 3 | Who we are (mission, vision, stats) | White |
| 4 | What we do (sticky scroll) | Surface |
| 5 | Find your course | White |
| 6 | Why it matters (CPR monitor + learning videos) | Monitor (dark) |
| 7 | How training works + group specials | White |
| 8 | Clients marquee | Surface |
| 9 | Final CTA → Footer | Red → Slate (from Phase 2) |

### 4.1 Hero (full viewport)
- `min-height: 100svh`, two columns on ≥ 1024 px (text 50% / video 50%), stacked on mobile (video becomes a 16:10 panel below the text).
- **Left:**
  - Eyebrow: "MerSETA accredited · Durban · Since 2013".
  - Display headline from `home.js`, with one word in Pulse Red. Animate it in word by word: each word slides up from a mask with a 0.06 s stagger.
  - Subline, then two CTAs: `HeartbeatButton` "Explore courses" → `/courses/sa`, and a secondary "Book group training" → `/contact`.
  - A micro trust row (3 small check items).
- **Right:** the video panel, rounded 24 px on the outer corners. Its **left edge is an ECG trace** (`EcgEdge` mask), and a `PulseLine` runs along that seam, drawing in on load and then beating. This is the signature moment.
- **Video:** muted, `playsInline`, loop, `preload="metadata"`, poster first. Add a visible pause/play button (bottom-right). Show the poster only when reduced motion is on, when `navigator.connection.saveData` is set, or on slow connections. Until the video exists, the poster gets a slow Ken Burns zoom.
- **Scroll effects:** on scroll, the video panel scales 1 → 0.94 and its radius grows. The text column fades and moves up slightly (`useScroll` on the hero).
- **Scroll cue** at the bottom: a small mouse/chevron icon with a looping ECG blip. It hides after the first scroll.

### 4.2 Trust strip
- About 88 px tall. Shows "Accredited by" and the 3 accreditation badges, then a divider, then "Trusted by 7,000+ learners since 2013". On mobile it becomes a marquee.
- Badges reveal with a stagger. The chrome ring sheens once.

### 4.3 Who we are — mission, vision, stats
- Bento grid (desktop: a 4-column, 2-row grid; mobile: stacked):
  - The tall CPR-class photo (`ImageReveal` + `Parallax`).
  - A Mission card (white, chrome `IconRing`, navy eyebrow).
  - A hi-vis workers photo.
  - A Vision card on navy (#142458) with white text. This is the only navy block on the page.
  - The kneeling-CPR-practice photo.
- Cards lift 4 px on hover, and photos zoom 1.05 inside their frames.
- Below it, a **stats row** of 3 items: `CountUp` + `ChromeText` numbers (20+ Courses, {years}+ Years of history, 7,000+ Individuals trained), each with an icon in an `IconRing`. They count up when 40% in view.
- A link: "More about us →" to `/about`.

### 4.4 What we do — sticky scroll ★
- Desktop: a 2-column layout spanning about 300 vh.
  - **Left column:** `position: sticky; top: 96px`, an image frame 70 vh tall.
  - **Right column:** three pillar blocks (each about 100 vh): First Aid & Emergency Care, Health & Safety Compliance, Emergency Response & Fire. Each block has an eyebrow number (01/02/03), heading, 2-line copy, up to 3 course chips from `getCoursesByCategory()` (the chip row is hidden when the category has no courses), and "See courses →" (→ `/courses/sa?category=…`). Pillars come from `categories.js`, so the section adapts if the categories change.
- As each block becomes active (`useScroll` progress, or `useInView` with `amount: 0.5`):
  - The sticky image crossfades and scales to that pillar's photo (`AnimatePresence`, 0.6 s).
  - A vertical progress rail on the image's left fills, with an **ECG blip that travels down the rail** to point at the active block.
  - A floating glass label on the image (white 80% + blur) updates to the pillar name. Its text slides.
  - Inactive blocks dim to 40% opacity; the active one is 100%.
- Mobile/tablet: no sticky. Each pillar becomes an image + text card with `ImageReveal`.

### 4.5 Find your course
- Heading plus a **segmented SA/UK toggle**: a pill with a sliding red indicator (`layoutId`).
- SA: a grid of up to 6 featured `CourseCard`s from `getFeaturedCourses('sa')` (`TiltCard` + `RevealStagger`). Cards have a category badge, title, duration and NQF meta in navy, and an arrow that slides on hover. Then a "View all {n} South African courses →" button.
- SA with no courses: show the 3 category cards instead (same card style), each linking to the course list, plus a line "Our full course list is being updated — call or WhatsApp us for current courses" with both buttons.
- UK: the grid animates out, and a coming-soon card animates in (`AnimatePresence`). It has an animated globe/ECG illustration, "We're bringing GR Heartbeat to the UK", and a "Register interest" button (mailto, with a subject line, for now).

### 4.6 Why it matters — CPR monitor + learning videos ★
Dark `bg-monitor-grid` section, with a 24 px radius panel inset from the page edges.

**Part A — the CPR rhythm monitor (the "CPR effect")**
- Left: copy. "Hands-only CPR: push hard and fast in the centre of the chest, 100–120 compressions per minute." Then a line that ties the rhythm to training, and a CTA to the First Aid courses.
- Right: a **live cardiac-monitor widget**:
  - A `PulseLine` sweeps across the monitor in red-400 (the classic monitor erase-bar effect) at **110 BPM**.
  - A large BPM readout in a mono font.
  - A stylised SVG chest/hands illustration that "compresses" (scaleY 1 → 0.92) on every beat, synced to the line.
- **Interactive: "Try the rhythm".** The user taps a big button (or presses the Space bar). The widget measures their rate from their last 6 taps and shows the BPM with feedback:
  - Too slow (< 100) → amber.
  - On target (100–120) → green "Perfect rhythm".
  - Too fast (> 120) → amber.
  - The monitor line follows their taps while they're tapping, then returns to auto mode after 3 s idle.
- A small note: "Practice tool only — not a substitute for certified training." (from `home.js`)
- The loop only runs while in view. Under reduced motion it shows a static ECG and a static "100–120 BPM", and the tap tool still works (numbers only).

**Part B — learning videos**
- Heading: "Why it matters".
- Layout: one large player (16:9, left, 2/3 width) + three stacked **chapter cards** (right): First Aid at Work & Home, OHS Standards, Fire Safety.
- Clicking a chapter card loads it into the player (crossfade). The active card gets a Pulse Red left bar and a progress ring.
- Each card shows a title, one key fact, the duration, and "Related courses →" (links to `/courses/sa?category={relatedCategory}`).
- The player is a **click-to-load facade**: poster + red play button. The `youtube-nocookie.com` iframe loads only after the click. When `youtubeId` is `null`, it shows the poster and a "Video coming soon" chip.
- Mobile: the player sits on top, with chapters in a horizontal scroll-snap row below.

### 4.7 How training works + group specials
- Four steps in a row (Enquire → We tailor it → Hands-on training → Certified). Each has a numbered `IconRing`.
- A horizontal **connector line that draws in as you scroll through the section** (`useScroll` → `pathLength`), with an ECG blip at its head. It is vertical on mobile.
- Below it, "Group booking specials": 2–3 cards from `home.js` (offer, detail, validity, "Enquire" button that pre-fills WhatsApp). If the data is empty, hide the subsection.

### 4.8 Clients marquee
- Heading: "Companies we've worked with".
- Two `Marquee` rows moving in opposite directions at different speeds. Logos are greyscale at 60% opacity and turn to colour at 100% on hover. Edge fade masks on left and right. Pause on hover/focus. Under reduced motion it becomes a static wrapped grid.

### 4.9 Section dividers
- `EcgDivider` between 3→4, 5→6 (into the dark panel) and 7→8 only.

**Phase 4 done when:** all sections render from data at 360 / 768 / 1280 / 1536 px; the sticky scroll and CPR monitor work smoothly (no jank in the Chrome performance panel at 4× CPU throttle); everything is visible and usable under reduced motion; and the build passes.

## Phase 5 — Courses (SA list, detail, UK)

- [ ] `/courses/sa`:
  - A compact page hero (eyebrow + title + count + a small `PulseLine`).
  - Sticky filter bar: category chips with a sliding red indicator and a search input. Filters sync to the URL (`?category=&q=`).
  - Course grid with `LayoutGroup` so cards animate positions when filtering (`layout` prop + `AnimatePresence` for enter/exit).
  - Two empty states:
    - **No results** for a filter or search: a short message and "Clear filters".
    - **No courses at all** (real list not imported yet): "Our course list is being updated" with the 3 categories, plus call, WhatsApp and contact buttons. The filter bar is hidden in this state.
- [ ] `/courses/sa/:slug`:
  - Breadcrumbs; title; category badge; summary.
  - A **sticky key-facts sidebar** on desktop: duration, delivery mode, NQF level, certificate validity, accreditation. It also holds the enquiry CTAs: WhatsApp pre-filled with the course name, email, and "Book a group".
  - Content sections (who it's for, what you'll learn, requirements, what to bring, assessment) with `Reveal`. Outcomes use animated check icons.
  - A related-courses row and the final CTA.
  - Unknown slug → 404 page.
  - Per-page `<title>` and `<meta name="description">`.
- [ ] `/courses/uk`: a coming-soon hero with an animated `PulseLine` that "flatlines → beats" on load; "We're bringing GR Heartbeat to the UK"; a status chip "In progress"; a register-interest form (Web3Forms; email + optional name) with a success state. It uses the same layout component as SA, so launch = data + a status flip.
- [ ] 404 page: an ECG that flatlines and then recovers into a beat, "This page has flatlined", and buttons home and to courses.

**Done when:** using the sample fixtures in dev, every course is reachable from the grid, filtering animates smoothly, deep links work on refresh in `npm run preview`, and enquiry links contain the course name. The production build (no samples) shows the "being updated" state cleanly, and `/courses/sa/anything` shows the 404 page.

## Phase 6 — About Us & Contact

- [ ] `/about`:
  - A split hero with a large photo (`ImageReveal`).
  - The **story as a vertical timeline** (2013 founding → today). The line draws with scroll, and milestones pop in. Milestone content is `TODO(client)`.
  - Founders' background: emergency care practitioners with 25+ years at the KZN Department of Health; qualified assessors, facilitators and moderators.
  - Mission / Vision / Values cards; team grid (`TODO(client)` photos, hover reveals role); accreditations in full with numbers + the company profile PDF download; clients marquee; final CTA.
- [ ] `/contact`:
  - Two columns. Left: contact cards (Call, WhatsApp, Email, Location), each with an icon in an `IconRing` and a hover lift.
  - Right: the Web3Forms form (name, phone, email, region select, course select populated from data with a "Not sure yet" option, pre-filled from `?course=`, and message). When there are no courses, the course select becomes a category select. It has inline validation, a honeypot, a loading state, and success/error states. On success, the button morphs into a check with a single heartbeat pulse.
  - An optional embedded map (lazy, click to load).

**Done when:** a test submission reaches the configured inbox and both pages pass the responsive and reduced-motion checks.

## Course import — when the client's new list arrives

This is a standalone step. It can run any time after Phase 3 (ideally after Phase 6, before Phase 7), and it is not blocked by or blocking any other phase. If the list arrives early, pause the current phase at a clean commit, do the import, then resume.

**Intake format to send the client** (one row per course; a spreadsheet is fine):

| Field | Required | Notes |
| --- | --- | --- |
| Course title | Yes | As it should appear on the site |
| Region | Yes | SA or UK |
| Category | Yes | One of the categories, or propose a new one |
| Short summary | Yes | 1–2 sentences |
| Duration | Yes | e.g. "1 day", "3 days" |
| Delivery mode | Yes | On-site at client / at our venue / both |
| NQF level | If accredited | |
| Unit standard numbers | If accredited | |
| Accrediting body | If accredited | e.g. MerSETA, HWSETA |
| Certificate validity | If applicable | e.g. "3 years" |
| Who it's for | Yes | 2–4 bullet points |
| What you'll learn | Yes | 3–6 bullet points |
| Entry requirements | If any | |
| What to bring | If any | |
| Assessment | Yes | How learners are assessed |
| Price | Optional | Leave blank for "Enquire for pricing" |
| Featured on home page | Optional | Yes/no; up to 6 |

**Steps**
- [ ] Convert the client's list into `courses.sa.js` (and `courses.uk.js` if any UK courses). Generate slugs from titles (lowercase, hyphens); slugs must be unique and stable once published.
- [ ] Update `categories.js` if the list introduces new categories (add an image and icon for each new one).
- [ ] Run `validateCourse()` on every entry and fix all errors. Anything the client left blank becomes `TODO(client)`, never invented text.
- [ ] Update the `courses` stat in `site.js` if the client confirms a new figure.
- [ ] Check every course-dependent section with real data: navbar dropdown, home featured grid, sticky-scroll chips, course list and filters, detail pages, related courses, contact course select.
- [ ] If the UK has courses, flip `regions.uk.status` to `live`.
- [ ] Commit: `feat(courses): import client course list`.

**Done when:** `courses.sa.js` holds the client's real list, validation passes, the sample banner no longer appears in dev, and every detail page renders with no empty sections.

## Phase 7 — Polish, performance, accessibility, SEO

- [ ] Motion audit: consistent timing, one loop in view at a time, no layout-property animation, all reduced-motion fallbacks verified
- [ ] Performance:
  - Lighthouse mobile ≥ 90 on Home, SA courses, one course detail, About.
  - LCP < 2.5 s: hero text first, video deferred, poster `fetchpriority="high"`.
  - Initial JS < 200 KB gzip; route-level code splitting.
  - Images in WebP/AVIF with width/height set; fonts subset and preloaded.
- [ ] Accessibility: WCAG 2.1 AA — keyboard-only pass, screen-reader pass, focus rings, alt text, video captions, pause controls on all motion, contrast per the Colour Theme table
- [ ] SEO: titles/descriptions per page, Open Graph + Twitter image (1200×630 made from the logo), `sitemap.xml`, `robots.txt`, `LocalBusiness` + `Course` JSON-LD
- [ ] Cross-browser: Chrome, Safari (macOS + iOS), Firefox, Edge, Samsung Internet
- [ ] `grep -r "TODO(client)"` report sent to the client
- [ ] Confirm the production bundle contains no sample fixtures (`grep -r "Sample course" dist/` returns nothing) and `VITE_SAMPLE_CONTENT` is unset

## Phase 8 — Deploy to Vercel & launch

- [ ] Push to GitHub; import into Vercel (framework: Vite; build `npm run build`; output `dist`)
- [ ] Env vars: `VITE_WEB3FORMS_KEY`
- [ ] Confirm the `vercel.json` SPA rewrite + add 301 redirects: `/about-us/` → `/about`, `/contact-us/` → `/contact`, `/courses/` → `/courses/sa`
- [ ] Enable Vercel Web Analytics
- [ ] **Launch gate:** the Course import step is done (real courses in `courses.sa.js`). If the client wants to launch before the list arrives, get written confirmation that the "course list is being updated" state is acceptable
- [ ] **Launch gate:** A real POPIA privacy notice replaces the placeholder before launch.
- [ ] Client review on the Vercel URL → written sign-off
- [ ] Custom domain + DNS, verify HTTPS, submit the sitemap to Google Search Console
- [ ] Handover README: adding and editing courses (with the intake table and `validateCourse()`), turning on the UK, replacing videos and logos

---

## Open items carried over (do not block the build)

- New course list from the client (all fields in the Course import intake table). Imported in the Course import step; the old site's course list is not used
- Hero video + 3 learning videos (AI-generated; **client must review CPR technique and facts** before publishing)
- Reversed/SVG logo, accreditation logos, client logos with names, team photos, group specials text, contact email
- Domain (keep heartbeattraining.net or new GR Heartbeat domain)
