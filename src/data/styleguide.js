// Content for the internal /styleguide page. Sample copy only: no business facts.

export const styleguide = {
  title: 'Design system',
  intro:
    'Every token, primitive and animation used to build the site. Toggle reduced motion in the corner to preview the static fallbacks.',

  sample: {
    // Motto candidates from the implementation plan (home.js will own the final choice).
    displayLead: 'Ready when',
    displayAccent: 'it matters.',
    eyebrow: 'Sample eyebrow',
    lead: 'A lead paragraph introduces a section in one or two calm sentences, set slightly larger than body text.',
    body: 'Body copy is Inter at 17–18px with generous 1.65 leading. It should read comfortably on a phone held at arm’s length, and never run wider than about 70 characters.',
    cardTitle: 'Card title',
    cardText: 'Supporting text for a card. Cards lift by 4px on hover.',
    marqueeItems: [
      'Sample logo A',
      'Sample logo B',
      'Sample logo C',
      'Sample logo D',
      'Sample logo E',
      'Sample logo F',
      'Sample logo G',
    ],
    shellNotes: [
      'Navbar: floating pill; frosted and shrunk once scrolled; hides on scroll down past the hero.',
      'Courses dropdown: hover (120ms intent), click or Enter/Space/↓; arrows move, Esc closes.',
      'Mobile drawer (< 1024px): focus trapped, page scroll locked, Esc closes.',
      'Final CTA band with an ECG edge overlapping the footer; footer PulseLine draws on view.',
      'WhatsApp button after 400px of scroll; hidden while the CTA band or footer is on screen.',
      'Route changes: fade out/in with one ECG sweep; focus moves to the new page heading.',
    ],
    stats: [
      { value: 1240, suffix: '+', label: 'Sample metric' },
      { value: 98, suffix: '%', label: 'Another metric' },
      { value: 36, suffix: '', label: 'Third metric' },
    ],
  },

  colourGroups: [
    {
      title: 'Brand',
      tokens: ['pulse-red', 'crimson', 'deep-crimson', 'navy', 'slate', 'monitor', 'chrome'],
    },
    { title: 'Text & surfaces', tokens: ['ink', 'body', 'white', 'surface', 'line', 'red-tint'] },
    {
      title: 'Grey ramp',
      tokens: [
        'grey-50',
        'grey-100',
        'grey-200',
        'grey-300',
        'grey-400',
        'grey-500',
        'grey-600',
        'grey-700',
        'grey-800',
        'grey-900',
        'grey-950',
      ],
    },
    {
      title: 'Red ramp',
      tokens: [
        'red-50',
        'red-100',
        'red-200',
        'red-300',
        'red-400',
        'red-500',
        'red-600',
        'red-700',
        'red-800',
      ],
    },
    { title: 'Status', tokens: ['success', 'amber', 'amber-50', 'whatsapp'] },
  ],

  // Pairings from the colour doc's accessibility table; ratios are computed live.
  contrastPairs: [
    ['ink', 'white'],
    ['body', 'white'],
    ['body', 'grey-50'],
    ['navy', 'white'],
    ['grey-600', 'white'],
    ['grey-500', 'white'],
    ['pulse-red', 'white'],
    ['pulse-red', 'surface'],
    ['white', 'pulse-red'],
    ['white', 'red-600'],
    ['white', 'crimson'],
    ['crimson', 'red-tint'],
    ['white', 'slate'],
    ['grey-200', 'slate'],
    ['red-100', 'slate'],
    ['white', 'monitor'],
    ['red-400', 'monitor'],
    ['success', 'white'],
    ['amber', 'amber-50'],
    ['grey-400', 'white'],
    ['pulse-red', 'slate'],
  ],
}
