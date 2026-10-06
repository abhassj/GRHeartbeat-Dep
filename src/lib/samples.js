/*
 * Sample content (course fixtures, client-logo placeholders) is allowed only in development,
 * or in a build made with VITE_SAMPLE_CONTENT=true for previewing. This is a build-time
 * constant, so production builds drop the fixture files entirely.
 */
export const SAMPLES_ENABLED = import.meta.env.DEV || import.meta.env.VITE_SAMPLE_CONTENT === 'true'
