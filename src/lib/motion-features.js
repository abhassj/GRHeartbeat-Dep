import { domAnimation } from 'motion/react'

/*
 * Motion features for <LazyMotion>. The first load ships domAnimation only (animations,
 * gestures, in-view). Layout animation (layoutId — the nav blip, tab indicators, Phase 5
 * filtering) needs domMax, which is fetched as its own chunk once the page has loaded;
 * until then those indicators move without the slide.
 */
export const initialMotionFeatures = domAnimation

export const loadFullMotionFeatures = () => import('./motion-max').then((mod) => mod.domMax)
