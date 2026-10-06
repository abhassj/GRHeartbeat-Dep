// Client logos for the "Companies we've worked with" marquee.
// TODO(client): client company names, logo files (SVG or PNG, ideally on a transparent
// background) and permission to show each one. Do not reuse the old site's logos.
// This file must not import anything: the Node content check reads it.
//
// Shape: { name, logo, alt, url? }
// - logo: path to the file in /public/clients/ (e.g. '/clients/acme.svg')
// - alt: usually the company name
// While this list is empty, production renders no clients section at all; development
// shows neutral placeholders (see lib/clients.js).

export const clients = []
