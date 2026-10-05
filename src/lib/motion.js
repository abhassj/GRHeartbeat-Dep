// Shared motion presets. Every animation takes its easing, timing and distance from here.

export const ease = {
  out: [0.22, 1, 0.36, 1],
  inOut: [0.65, 0, 0.35, 1],
}

export const dur = {
  fast: 0.2,
  base: 0.5,
  slow: 0.9,
}

export const stagger = 0.08

export const distance = {
  rise: 24,
}

// The in-view area extends far above the screen, so anything the visitor has already
// scrolled or jumped past (anchor links, End key, restored scroll) counts as seen and is
// never left hidden. Elements below the screen still wait until they scroll up into view.
export const revealMargin = '100000px 0px 0px 0px'

// Default whileInView settings: reveal once, when 20% of the element is visible.
export const viewport = { once: true, amount: 0.2, margin: revealMargin }

export const transition = {
  fast: { duration: dur.fast, ease: ease.out },
  base: { duration: dur.base, ease: ease.out },
  slow: { duration: dur.slow, ease: ease.out },
  morph: { duration: dur.base, ease: ease.inOut },
}

export const variants = {
  fadeUp: {
    hidden: { opacity: 0, y: distance.rise },
    visible: { opacity: 1, y: 0, transition: transition.base },
  },
  stagger: {
    hidden: {},
    visible: { transition: { staggerChildren: stagger } },
  },
}

// Heart rate → seconds per beat (60 BPM = 1 s, close to a resting heart rate).
export const beatSeconds = (bpm = 60) => 60 / bpm
