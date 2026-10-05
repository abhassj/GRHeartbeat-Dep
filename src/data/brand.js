import logoSrc from '@/assets/brand/gr-heartbeat-logo.webp'

// Brand identity. Phase 3 folds this into site.js alongside contacts and accreditations.
export const brand = {
  name: 'GR Heartbeat',
  // As written in the logo lockup. TODO(client): confirm the registered business name.
  fullName: 'GR Heartbeat Training Academy & Consulting',
  logo: {
    // Cropped from docs/brand/gr-heartbeat-logo-original.png (raster, white background).
    // TODO(client): supply an SVG lockup and a reversed (light-on-dark) version.
    src: logoSrc,
    width: 1199,
    height: 355,
    alt: 'GR Heartbeat Training Academy & Consulting',
  },
}
