import { CircleHelp, Flame, HeartPulse, ShieldCheck } from 'lucide-react'

// Icon names used in src/data → lucide components. Add an entry when data uses a new icon.
const icons = { Flame, HeartPulse, ShieldCheck }

export const getIcon = (name) => icons[name] ?? CircleHelp
