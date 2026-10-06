import { categories } from './categories.js'

/*
 * Course data model, following the Course import intake table in
 * docs/GR_Heartbeat_Implementation_Plan_v2.1.md. Used by:
 * - lib/courses.js in development (console warnings on load; never in production builds)
 * - scripts/check-content.mjs (npm run check:content; part of the launch gate)
 * Relative imports only: plain Node runs this file.
 *
 * A value the client left blank is written as a placeholder string starting with the TODO
 * marker (or omitted where
 * optional). TODO strings count as present here; check:content reports how many remain.
 */

/**
 * @typedef {'sa' | 'uk'} Region
 * @typedef {'on-site' | 'venue' | 'both'} DeliveryMode
 *
 * @typedef {Object} Course
 * @property {string} slug                Generated from the title: lowercase, hyphens. Stable once published.
 * @property {Region} region              Intake: Region (required)
 * @property {string} title               Intake: Course title (required)
 * @property {string} category            Intake: Category (required) — an id from categories.js
 * @property {string} summary             Intake: Short summary, 1–2 sentences (required)
 * @property {string} duration            Intake: Duration, e.g. "1 day" (required)
 * @property {DeliveryMode} deliveryMode  Intake: Delivery mode (required)
 * @property {string | null} accreditation       Intake: Accrediting body (if accredited)
 * @property {number | null} nqfLevel            Intake: NQF level (required if accredited)
 * @property {string[]} unitStandards            Intake: Unit standard numbers (required if accredited)
 * @property {string | null} certificateValidity Intake: Certificate validity (if applicable)
 * @property {string[]} audience          Intake: Who it's for, 2–4 points (required)
 * @property {string[]} outcomes          Intake: What you'll learn, 3–6 points (required)
 * @property {string[]} requirements      Intake: Entry requirements (if any)
 * @property {string[]} whatToBring       Intake: What to bring (if any)
 * @property {string} assessment          Intake: Assessment (required)
 * @property {string | null} price        Intake: Price (optional; null = "Enquire for pricing")
 * @property {boolean} featured           Intake: Featured on home page (optional; up to 6 per region)
 * @property {boolean} [sample]           Development fixtures only
 */

export const REGIONS = ['sa', 'uk']

// Display labels for the delivery mode values.
export const DELIVERY_MODES = {
  'on-site': 'At your premises',
  venue: 'At our venue',
  both: 'At your premises or our venue',
}

export const LIMITS = {
  audience: [2, 4],
  outcomes: [3, 6],
  featuredPerRegion: 6,
  nqfLevel: [1, 10],
}

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

const FIELDS = [
  'slug',
  'region',
  'title',
  'category',
  'summary',
  'duration',
  'deliveryMode',
  'accreditation',
  'nqfLevel',
  'unitStandards',
  'certificateValidity',
  'audience',
  'outcomes',
  'requirements',
  'whatToBring',
  'assessment',
  'price',
  'featured',
  'sample',
]

const isText = (value) => typeof value === 'string' && value.trim().length > 0
const isTextList = (value) => Array.isArray(value) && value.every(isText)
const nullable = (check) => (value) => value === null || value === undefined || check(value)

/**
 * Validate one course. Returns { valid, errors }, where each error is { field, message }.
 * @param {Course} course
 * @param {{ categoryIds?: string[] }} [options]
 */
export function validateCourse(course, { categoryIds = categories.map((c) => c.id) } = {}) {
  const errors = []
  const fail = (field, message) => errors.push({ field, message })

  if (!course || typeof course !== 'object') {
    return { valid: false, errors: [{ field: '(course)', message: 'must be an object' }] }
  }

  // Required text fields
  if (!isText(course.slug)) fail('slug', 'is required')
  else if (!SLUG.test(course.slug)) fail('slug', 'must be lowercase words joined by hyphens')
  if (!REGIONS.includes(course.region)) fail('region', `must be one of: ${REGIONS.join(', ')}`)
  for (const field of ['title', 'summary', 'duration', 'assessment']) {
    if (!isText(course[field])) fail(field, 'is required')
  }
  if (!categoryIds.includes(course.category)) {
    fail('category', `must be one of the categories in categories.js: ${categoryIds.join(', ')}`)
  }
  if (!(course.deliveryMode in DELIVERY_MODES)) {
    fail('deliveryMode', `must be one of: ${Object.keys(DELIVERY_MODES).join(', ')}`)
  }

  // Lists with size limits
  for (const field of ['audience', 'outcomes']) {
    const [min, max] = LIMITS[field]
    const list = course[field]
    if (!isTextList(list)) fail(field, 'must be a list of text points')
    else if (list.length < min || list.length > max) {
      fail(field, `needs ${min}–${max} points (has ${list.length})`)
    }
  }
  for (const field of ['requirements', 'whatToBring']) {
    if (course[field] !== undefined && !isTextList(course[field])) {
      fail(field, 'must be a list of text points (or empty)')
    }
  }

  // Accreditation: NQF level and unit standards are required when accredited
  if (!nullable(isText)(course.accreditation)) fail('accreditation', 'must be text or null')
  const [minLevel, maxLevel] = LIMITS.nqfLevel
  const level = course.nqfLevel
  const levelOk = Number.isInteger(level) && level >= minLevel && level <= maxLevel
  if (level !== null && level !== undefined && !levelOk) {
    fail('nqfLevel', `must be a whole number from ${minLevel} to ${maxLevel}, or null`)
  }
  if (course.unitStandards !== undefined && !isTextList(course.unitStandards)) {
    fail('unitStandards', 'must be a list of unit standard numbers (or empty)')
  }
  if (isText(course.accreditation)) {
    if (!levelOk) fail('nqfLevel', 'is required for an accredited course')
    if (!isTextList(course.unitStandards) || course.unitStandards.length === 0) {
      fail('unitStandards', 'needs at least one unit standard for an accredited course')
    }
  }

  // Optional fields
  if (!nullable(isText)(course.certificateValidity)) {
    fail('certificateValidity', 'must be text or null')
  }
  if (!nullable(isText)(course.price)) fail('price', 'must be text or null ("Enquire for pricing")')
  if (course.featured !== undefined && typeof course.featured !== 'boolean') {
    fail('featured', 'must be true or false')
  }
  if (course.sample !== undefined && typeof course.sample !== 'boolean') {
    fail('sample', 'must be true or false')
  }

  for (const field of Object.keys(course)) {
    if (!FIELDS.includes(field)) fail(field, 'is not a known course field (typo?)')
  }

  return { valid: errors.length === 0, errors }
}

/**
 * Validate a whole course file: every course, plus unique slugs and the featured limit.
 * Returns { valid, invalid: [{ slug, errors }] }.
 */
export function validateCourseList(list, options) {
  const invalid = []
  if (!Array.isArray(list)) {
    return {
      valid: false,
      invalid: [{ slug: '(file)', errors: [{ field: '(file)', message: 'must export an array' }] }],
    }
  }

  const seen = new Map()
  list.forEach((course, index) => {
    const { errors } = validateCourse(course, options)
    const slug = course?.slug || `(entry ${index + 1})`
    if (seen.has(course?.slug)) {
      errors.push({ field: 'slug', message: `duplicates entry ${seen.get(course.slug) + 1}` })
    } else if (course?.slug) {
      seen.set(course.slug, index)
    }
    if (errors.length) invalid.push({ slug, errors })
  })

  for (const region of REGIONS) {
    const featured = list.filter((course) => course?.region === region && course.featured).length
    if (featured > LIMITS.featuredPerRegion) {
      invalid.push({
        slug: `(region ${region})`,
        errors: [
          {
            field: 'featured',
            message: `${featured} courses are featured; the home page shows at most ${LIMITS.featuredPerRegion}`,
          },
        ],
      })
    }
  }

  return { valid: invalid.length === 0, invalid }
}
