import {
  BookOpen,
  CalendarCheck,
  CircleHelp,
  Flame,
  HeartPulse,
  ShieldCheck,
  Users,
} from 'lucide-react'

// Icon names used in src/data → lucide components. Add an entry when data uses a new icon.
const icons = { BookOpen, CalendarCheck, Flame, HeartPulse, ShieldCheck, Users }

export const getIcon = (name) => icons[name] ?? CircleHelp
