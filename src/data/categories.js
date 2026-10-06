// Course categories. TODO(client): confirm categories once the new course list arrives.
// The new list may add or rename categories, so nothing outside this file may hard-code an id.
// `icon` is a lucide icon name (resolved in src/lib/icons.js); `image` is added in Phase 3.

export const categories = [
  {
    id: 'first-aid',
    title: 'First Aid & Emergency Care',
    line: 'Respond with confidence when someone is hurt or ill.', // TODO(client): confirm wording
    icon: 'HeartPulse',
    image: null,
    accent: 'pulse-red',
  },
  {
    id: 'compliance',
    title: 'Health & Safety Compliance',
    line: 'Meet your legal duties and keep your workplace safe.', // TODO(client): confirm wording
    icon: 'ShieldCheck',
    image: null,
    accent: 'navy',
  },
  {
    id: 'emergency-response',
    title: 'Emergency Response & Fire',
    line: 'Prepare your team to act fast in a fire or emergency.', // TODO(client): confirm wording
    icon: 'Flame',
    image: null,
    accent: 'crimson',
  },
]
