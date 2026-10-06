// Course categories. TODO(client): confirm categories once the new course list arrives.
// The new list may add or rename categories, so nothing outside this file may hard-code an id.
//
// - icon: a lucide icon name (resolved in src/lib/icons.js)
// - image: a photo id from src/data/photos.js, or null (Phase 4 shows a neutral placeholder)
// - line / description: drafted copy, kept generic. TODO(client): review wording.
// This file must not import anything: the Node content check (npm run check:content) reads it.

export const categories = [
  {
    id: 'first-aid',
    title: 'First Aid & Emergency Care',
    line: 'Respond with confidence when someone is hurt or ill.',
    description:
      'Practical training in how to help someone who is injured or unwell until professional help arrives.',
    icon: 'HeartPulse',
    image: 'cprClass',
    accent: 'pulse-red',
  },
  {
    id: 'compliance',
    title: 'Health & Safety Compliance',
    line: 'Meet your legal duties and keep your workplace safe.',
    description:
      'Training that helps your team understand workplace health and safety duties and put them into practice.',
    icon: 'ShieldCheck',
    // TODO(client): a photo for this category (none suitable on the old site).
    image: null,
    accent: 'navy',
  },
  {
    id: 'emergency-response',
    title: 'Emergency Response & Fire',
    line: 'Prepare your team to act fast in a fire or emergency.',
    description:
      'Training that prepares people to recognise an emergency, raise the alarm and respond safely.',
    icon: 'Flame',
    // TODO(client): a photo for this category (none suitable on the old site).
    image: null,
    accent: 'crimson',
  },
]
