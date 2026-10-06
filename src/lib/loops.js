// Registry of decorative loops on screen (WCAG 2.2.2 Pause, Stop, Hide).
// Components that loop report when they are visible and would animate; pause controls
// report when they are visible. A floating pause control appears whenever a loop is on
// screen but no other pause control is — so one is always reachable while anything loops.

const loops = new Set()
const controls = new Set()
const listeners = new Set()

const notify = () => listeners.forEach((listener) => listener())

const toggle = (set, id, on) => {
  const had = set.has(id)
  if (on) set.add(id)
  else set.delete(id)
  if (had !== on) notify()
}

export const setLoopVisible = (id, visible) => toggle(loops, id, visible)
export const setControlVisible = (id, visible) => toggle(controls, id, visible)

export const subscribeLoops = (listener) => {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

/** "a loop is visible and no inline control is" — as a primitive for useSyncExternalStore. */
export const needsFloatingControl = () => loops.size > 0 && controls.size === 0
export const anyLoopVisible = () => loops.size > 0
