import { createContext } from 'react'

// Holds the effective reduced-motion state: the OS setting, unless /styleguide overrides it.
export const MotionPreferenceContext = createContext(null)
