/*
 * Decorative-loop arbiter (restraint rule + WCAG 2.2.2).
 *
 * Every looping animation reports how much of it is visible, under a group name (the hero's
 * video, seam pulse, CTA glow and scroll cue share one group: they are one "heartbeat").
 * Only the group with the largest visible area runs; every other loop holds still. So at
 * most one loop is ever animating on screen, and loops stop off-screen automatically.
 *
 * Pause controls also register, so a floating control can appear whenever a loop is on
 * screen but no inline control is.
 */

const loops = new Map() // id -> { group, area }
const controls = new Set()
const listeners = new Set()

const notify = () => listeners.forEach((listener) => listener())

export function setLoop(id, entry) {
  const previous = loops.get(id)
  if (!entry) {
    if (!previous) return
    loops.delete(id)
  } else {
    if (previous && previous.group === entry.group && previous.area === entry.area) return
    loops.set(id, entry)
  }
  notify()
}

export function setControlVisible(id, visible) {
  const had = controls.has(id)
  if (visible) controls.add(id)
  else controls.delete(id)
  if (had !== visible) notify()
}

export const subscribeLoops = (listener) => {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

/** The group allowed to animate: the one with the most visible area (null if none). */
export function getWinningGroup() {
  const areas = new Map()
  for (const { group, area } of loops.values()) {
    if (area > 0) areas.set(group, Math.max(areas.get(group) ?? 0, area))
  }
  let winner = null
  let best = 0
  for (const [group, area] of areas) {
    if (area > best) {
      best = area
      winner = group
    }
  }
  return winner
}

export const anyLoopVisible = () => [...loops.values()].some(({ area }) => area > 0)

export const needsFloatingControl = () => anyLoopVisible() && controls.size === 0
