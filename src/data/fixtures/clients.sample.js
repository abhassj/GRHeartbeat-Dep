// Neutral client-logo placeholders for building the UI. No real or invented company names.
// Development only (same gating as the sample courses); production builds never include them.

// Marked pure so production builds drop it when unused (Array.from is not side-effect free).
export const sampleClients = /* @__PURE__ */ Array.from({ length: 8 }, (_, index) => ({
  sample: true,
  id: `sample-client-${index + 1}`,
  name: 'Client logo',
  logo: null,
  alt: 'Client logo placeholder',
}))
