# GR Heartbeat — Colour Theme

Oct 6, 2026 · @siddh

## Palette at a glance

&#91;embedded content: core palette · 12 swatches + target colour share\]

White, warm greys and a slate footer come from the BHF reference. Pulse Red, Crimson, Navy and Chrome come from the GR Heartbeat logo. Red stays at about 2% of any screen, so it always means "look here" or "click here".

## Core colour tokens

The site is white and grey with one red. The structure copies the BHF reference: white pages, a light-grey card fill, near-black headings, mid-grey body text and a slate footer. The red is our own Pulse Red, sampled from the new logo, not BHF's.

All hex values were sampled from your uploads: the GR Heartbeat logo PNG and the two BHF screenshots.

| Token | Hex | Sampled from | Used for |
| --- | --- | --- | --- |
| `pulse-red` | #DC1820 | Logo pulse line + HEARTBEAT | Primary buttons, the ECG line, key words in headlines, active nav |
| `crimson` | #A4141C | Dark end of the HEARTBEAT gradient | Button hover/pressed, red text on pink tints, error text |
| `deep-crimson` | #800C14 | Logo letter shading | Gradient end stop only. Never text or flat fills |
| `ink` | #1A1A1A | BHF section headings | Headings, card titles |
| `body` | #4D4D4D | BHF paragraph text | Body copy |
| `navy` | #142458 | Logo subtitle | Small caps eyebrows, breadcrumbs, secondary links. Our second voice |
| `slate` | #474E5A | BHF footer background | Footer, dark bands, trust strip |
| `monitor` | #15181D | Darkest chrome of the GR monogram | The video section (a cardiac-monitor panel) |
| `chrome` | #8C8C8C | Mid-tone of the GR monogram | Metallic gradients, icon rings, dividers. Never text |
| `white` | #FFFFFF | Page backgrounds | Page background, text on red / slate |
| `surface` | #FAFAFA | BHF card fill | Cards, alternating sections |
| `line` | #EFEFF0 | BHF card border | Card borders, hairline dividers |
| `red-tint` | #FDEDEE | Derived from Pulse Red | Badges, highlighted rows, hover backgrounds |

**Status colours** (used only for feedback, never for decoration)

| Token | Hex | Used for |
| --- | --- | --- |
| `success` | #0B7A4B | Form sent, "Accredited" ticks |
| `amber` | #8A5300 on #FFF4E0 | The UK "Coming soon" badge |
| `error` | #A4141C (= crimson) | Form errors |

The sampled BHF red is #ED002D, which is pinker and brighter. Using the logo's #DC1820 keeps the site from reading as a BHF clone and makes the logo and the UI the exact same red.

## Tonal ramps

Two ramps cover every case: a cool grey (it leans slightly blue toward the BHF slate) and a red built around Pulse Red. Code only uses these steps, so no ad-hoc hex values creep in.

| Step | Grey | Red | Typical use |
| --- | --- | --- | --- |
| 0 | #FFFFFF | — | Page |
| 25 | #FAFAFA | — | Card fill (`surface`) |
| 50 | #F4F5F7 | #FDEDEE | Alternate section / red tint |
| 100 | #EBECEF | #FAD4D6 | Hover backgrounds / red text on slate |
| 200 | #D9DCE1 | #F4A8AC | Disabled fills / footer secondary text on slate |
| 300 | #BFC4CC | #EE6A6F | Decorative dividers (not form borders) |
| 400 | #8A919C | #FF5A61 | Input borders (3.2:1) / red on the dark monitor panel |
| 500 | #747B87 | #DC1820 | Placeholder text, large text only / **Pulse Red** |
| 600 | #5A616D | #BE141B | Secondary small text / button hover |
| 700 | #474E5A | #A4141C | **Slate** footer / **Crimson** pressed + error |
| 800 | #333944 | #800C14 | Footer bottom bar / gradient end |
| 900 | #22262E | — | Rare: dark text on tints |
| 950 | #15181D | — | **Monitor** panel |

Text colours are #1A1A1A (ink) and #4D4D4D (body), outside this ramp. They match the BHF reference exactly.

## Signature touches

BHF's palette gives us the calm base. These five touches come from the GR Heartbeat logo and make the site recognisably ours.

1. **The ECG edge instead of BHF's curve.** BHF tops its footer with a red band that has rounded bottom corners. We do the same, but the band's bottom edge is an ECG trace: flat, then one sharp spike, then flat. It's an SVG mask, so the spike sits where the eye lands (centred, or above the main CTA). We use it twice only, at the top of the footer and on the final CTA band.
2. **Chrome from the GR monogram.** A metallic gradient, `#2B2B2F → #8C8C8C → #E6E6E8 → #8C8C8C → #2B2B2F` at 135°. It's used on thin things only: the 2 px ring around icons, the stat numbers on the home page (background-clip text), and a 1 px divider under section headings. It's never used on large areas or body text. No competitor site has this.
3. **The monitor panel.** The "Why it matters" video section sits on `monitor` #15181D with a faint ECG grid: 24 px red lines at 6% opacity. The pulse line runs across it in `red-400` #FF5A61, the only place that brighter red appears. It's the one dark, dramatic moment on a white site, like a cardiac monitor.
4. **Red glow pulse on CTAs.** Primary buttons get `box-shadow: 0 0 0 0 rgba(220,24,32,0.45)`, which animates out to 12 px and fades. It runs twice (lub-dub), then pauses for 4 s. It is switched off under reduced motion.
5. **Navy as the second voice.** BHF uses only red and grey. We add the logo's navy #142458 for small things: section eyebrows in spaced caps, breadcrumbs, course meta (duration · NQF level), and the subtitle line. It's never used for big areas or buttons. That red, white and navy mix is what makes the palette distinct.

The red ratio stays low: roughly 70% white/grey surface, 20% text greys, 8% slate/monitor, and about 2% red. Red marks the one thing to click or notice in each viewport. That scarcity is why BHF's red feels strong, and we keep it.

## Component colour rules

Each component has exactly one colour recipe. If a component isn't listed, it uses white, ink text and a `line` border.

| Component | Background | Text | Border / accent | Hover / active |
| --- | --- | --- | --- | --- |
| Header | White, gets a `line` bottom border + soft shadow once scrolled | Ink links | Active link: 2 px Pulse Red underline | Link turns Pulse Red |
| Courses dropdown | White | Ink; UK row shows the amber "Coming soon" badge | `line` border, 12 px radius | Row fills `red-tint` |
| Primary button | Pulse Red #DC1820 | White, 600 weight | — (pill shape, like BHF) | Red-600 #BE141B; pressed Crimson; glow pulse |
| Secondary button | White | Navy | 1.5 px navy border | Navy fill, white text |
| Ghost / text link | — | Pulse Red, underline on hover | — | Crimson |
| Hero headline | White page | Ink, with one key phrase in Pulse Red (BHF's "Our vision…" treatment) | — | — |
| Eyebrow above headings | — | Navy, 12–13 px, letter-spacing 0.12em, uppercase | — | — |
| Course card | `surface` #FAFAFA | Ink title, body summary, navy meta line | `line` border, 16 px radius | Lifts 4 px, border turns grey-300, title turns Pulse Red |
| Category / NQF badge | `red-tint` #FDEDEE | Crimson | — | — |
| Accreditation badge | White | Body | Chrome gradient 1 px ring | — |
| Stats strip | White | Numbers in chrome gradient text, labels body | — | — |
| Video section | Monitor #15181D + ECG grid | White headings, grey-200 body | Pulse line in red-400 | Play button fills Pulse Red |
| Final CTA band | Pulse Red with ECG bottom edge | White | — | White button with Pulse Red text |
| Footer | Slate #474E5A | White headings + links; grey-200 secondary | 1 px grey-600 column dividers (BHF pattern) | Links turn red-100 #FAD4D6 |
| Footer bottom bar | Grey-800 #333944 | Grey-200 small print | — | — |
| Form inputs | White | Ink, placeholder grey-500 | Grey-400 #8A919C | Focus: 2 px Pulse Red ring + 4 px red-tint halo |
| Form error | — | Crimson message + icon | Crimson border | — |
| Form success | Success at 8% tint | Success #0B7A4B | — | — |
| Focus ring (all) | — | — | 2 px Pulse Red, 2 px offset (white offset on dark sections) | — |
| WhatsApp button | Keep WhatsApp green #25D366 with a white icon. It's the one off-palette colour, because people recognise it by colour | — | — | — |

## Accessibility

Every text pairing in this theme passes WCAG 2.1 AA (4.5:1 for normal text, 3:1 for large text and UI borders). Two pairings are banned. The ratios below were computed with the WCAG luminance formula on the exact hex values.

| Text / element | On | Ratio | Result |
| --- | --- | --- | --- |
| Ink #1A1A1A | White | 17.4 | AAA |
| Body #4D4D4D | White | 8.45 | AAA |
| Body #4D4D4D | Surface #F4F5F7 | 7.75 | AAA |
| Navy #142458 | White | 14.76 | AAA |
| Grey-600 #5A616D | White | 6.24 | AA |
| Grey-500 #747B87 | White | 4.26 | Large text / placeholders only |
| Pulse Red #DC1820 | White | 5.01 | AA (red text is fine at any size) |
| Pulse Red #DC1820 | Surface #FAFAFA | 4.80 | AA |
| Pulse Red #DC1820 | Grey-50 #F4F5F7 | 4.59 | AA, just. Prefer white behind red text |
| White | Pulse Red #DC1820 | 5.01 | AA (button labels) |
| White | Red-600 #BE141B | 6.35 | AA (button hover) |
| White | Crimson #A4141C | 7.79 | AAA |
| Crimson #A4141C | Red-tint #FDEDEE | 6.87 | AA (badges) |
| White | Slate #474E5A | 8.38 | AAA (footer) |
| Grey-200 #D9DCE1 | Slate #474E5A | 6.10 | AA |
| Red-100 #FAD4D6 | Slate #474E5A | 6.17 | AA (footer link hover) |
| White | Monitor #15181D | 17.79 | AAA |
| Red-400 #FF5A61 | Monitor #15181D | 5.84 | AA |
| Success #0B7A4B | White | 5.39 | AA |
| Amber #8A5300 | Amber-50 #FFF4E0 | 5.81 | AA |
| Input border grey-400 #8A919C | White | 3.18 | Passes 3:1 for UI |

**Banned pairings**

- Pulse Red on Slate: 1.67:1. Never put red text or red icons on the footer; use red-100 instead.
- Grey-300 #BFC4CC as an input border: 1.75:1. Use it for decorative dividers only.

About 1 in 12 men has red-green colour blindness. Never use red alone to signal a state. Errors also get an icon and text, and active nav also gets an underline.

## Implementation

Paste this into `src/styles/index.css` in Phase 0. With Tailwind v4's `@theme`, every token becomes a utility automatically (`bg-pulse-red`, `text-navy`, `border-line`, `bg-grey-50`, and so on).

```css
@import "tailwindcss";

@theme {
  /* Brand */
  --color-pulse-red: #DC1820;
  --color-crimson: #A4141C;
  --color-deep-crimson: #800C14;
  --color-navy: #142458;
  --color-slate: #474E5A;
  --color-monitor: #15181D;
  --color-chrome: #8C8C8C;

  /* Text + surfaces */
  --color-ink: #1A1A1A;
  --color-body: #4D4D4D;
  --color-surface: #FAFAFA;
  --color-line: #EFEFF0;
  --color-red-tint: #FDEDEE;

  /* Grey ramp */
  --color-grey-50: #F4F5F7;
  --color-grey-100: #EBECEF;
  --color-grey-200: #D9DCE1;
  --color-grey-300: #BFC4CC;
  --color-grey-400: #8A919C;
  --color-grey-500: #747B87;
  --color-grey-600: #5A616D;
  --color-grey-700: #474E5A;
  --color-grey-800: #333944;
  --color-grey-900: #22262E;
  --color-grey-950: #15181D;

  /* Red ramp */
  --color-red-50: #FDEDEE;
  --color-red-100: #FAD4D6;
  --color-red-200: #F4A8AC;
  --color-red-300: #EE6A6F;
  --color-red-400: #FF5A61;
  --color-red-500: #DC1820;
  --color-red-600: #BE141B;
  --color-red-700: #A4141C;
  --color-red-800: #800C14;

  /* Status */
  --color-success: #0B7A4B;
  --color-amber: #8A5300;
  --color-amber-50: #FFF4E0;
  --color-whatsapp: #25D366;

  /* Signature effects */
  --gradient-chrome: linear-gradient(135deg, #2B2B2F 0%, #8C8C8C 30%, #E6E6E8 50%, #8C8C8C 70%, #2B2B2F 100%);
  --gradient-red: linear-gradient(135deg, #DC1820 0%, #A4141C 100%);
  --shadow-card: 0 1px 2px rgb(26 26 26 / 0.04), 0 4px 16px rgb(26 26 26 / 0.06);
  --shadow-card-hover: 0 8px 28px rgb(26 26 26 / 0.10);
  --radius-card: 16px;
}

/* Pulse glow on primary CTAs: two beats, then rest */
@keyframes lub-dub {
  0%, 30%, 100% { box-shadow: 0 0 0 0 rgb(220 24 32 / 0.45); }
  12% { box-shadow: 0 0 0 12px rgb(220 24 32 / 0); }
  18% { box-shadow: 0 0 0 0 rgb(220 24 32 / 0.45); }
  28% { box-shadow: 0 0 0 12px rgb(220 24 32 / 0); }
}
.btn-pulse { animation: lub-dub 5s ease-out infinite; }

/* Chrome text for stat numbers */
.text-chrome {
  background: var(--gradient-chrome);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

/* Monitor panel grid */
.bg-monitor-grid {
  background-color: var(--color-monitor);
  background-image:
    linear-gradient(rgb(220 24 32 / 0.06) 1px, transparent 1px),
    linear-gradient(90deg, rgb(220 24 32 / 0.06) 1px, transparent 1px);
  background-size: 24px 24px;
}

@media (prefers-reduced-motion: reduce) {
  .btn-pulse { animation: none; }
}

:focus-visible { outline: 2px solid var(--color-pulse-red); outline-offset: 2px; }
```

The `.text-chrome` class needs a fallback. Some screen readers and Windows High Contrast mode ignore `background-clip`, so keep stat numbers at least 32 px and bold. In forced-colours mode they fall back to the system text colour automatically.

## Do's and don'ts

**Do**

- Keep one red focal point per screen: the primary CTA, or one key phrase.
- Use the logo's exact red (#DC1820) everywhere red appears, so the logo and the UI match.
- Put red text on white, never on grey-50 or darker.
- Use navy for small supporting text only.
- Keep the chrome effect thin: rings, numbers, 1 px rules.
- Alternate white and `surface` sections to create rhythm without adding colour.

**Don't**

- Don't use BHF's #ED002D. It's their brand, and it clashes with our logo.
- Don't fill large areas with red, except the final CTA band and the footer's ECG edge.
- Don't put red on slate (1.67:1).
- Don't use a chrome gradient on buttons or backgrounds; it looks like a 2008 web page.
- Don't add new hues (blue, green, orange) for decoration. The only exceptions are WhatsApp green and the status colours.
- Don't use pure black #000000. Ink #1A1A1A is softer on white and matches the reference.
