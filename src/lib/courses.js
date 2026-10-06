import { categories } from '@/data/categories'
import saCourses from '@/data/courses.sa'
import ukCourses from '@/data/courses.uk'
import { courseSelect } from '@/data/forms'
import { sampleCourses } from '@/data/fixtures/courses.sample'
import { SAMPLES_ENABLED } from '@/lib/samples'

/*
 * The only way components reach course data (plan rule 8: never reference a slug directly).
 *
 * Data source rule, per region:
 * 1. If the region's real data file is non-empty, use only real data.
 * 2. Otherwise use the sample fixtures, but only in development or with VITE_SAMPLE_CONTENT=true.
 * 3. Otherwise there are no courses ([]), and every consumer shows its empty state.
 *
 * SAMPLES_ENABLED is a build-time constant, so production builds drop the fixtures entirely.
 */
export { SAMPLES_ENABLED }

const realCourses = { sa: saCourses, uk: ukCourses }

function source(region) {
  const real = realCourses[region] ?? []
  if (real.length) return real
  if (SAMPLES_ENABLED) return sampleCourses.filter((course) => course.region === region)
  return []
}

// Development only: validate every course file on load and warn (never throw). The dynamic
// import sits inside a build-time-false branch, so the validator is absent from production.
if (import.meta.env.DEV) {
  import('@/data/courses.schema').then(({ validateCourseList }) => {
    const files = {
      'courses.sa.js': saCourses,
      'courses.uk.js': ukCourses,
      'fixtures/courses.sample.js': sampleCourses,
    }
    for (const [file, list] of Object.entries(files)) {
      for (const { slug, errors } of validateCourseList(list).invalid) {
        for (const { field, message } of errors) {
          console.warn(`[courses] ${file} › ${slug} › ${field}: ${message}`)
        }
      }
    }
  })
}

export const getCoursesByRegion = (region) => source(region)

export const hasCourses = (region) => source(region).length > 0

/** True when any region is currently showing sample fixtures (drives the dev banner). */
export const isUsingSampleCourses = () =>
  Object.keys(realCourses).some((region) => source(region).some((course) => course.sample))

export const getCourseBySlug = (region, slug) =>
  source(region).find((course) => course.slug === slug) ?? null

export const getFeaturedCourses = (region, limit = 6) =>
  source(region)
    .filter((course) => course.featured)
    .slice(0, limit)

export const getCoursesByCategory = (region, categoryId, limit = Infinity) =>
  source(region)
    .filter((course) => course.category === categoryId)
    .slice(0, limit)

export const getRelatedCourses = (course, limit = 3) =>
  source(course.region)
    .filter((other) => other.category === course.category && other.slug !== course.slug)
    .slice(0, limit)

export const getCategories = () => categories

export const getCategory = (id) => categories.find((category) => category.id === id) ?? null

export const courseUrl = (course) => `/courses/${course.region}/${course.slug}`

export const categoryUrl = (region, categoryId) => `/courses/${region}?category=${categoryId}`

/*
 * Selectors for the course consumers built in later phases. Each one already returns a
 * usable shape with zero courses, so its section can never render empty.
 */

/** What we do (4.4): one pillar per category, with up to `chips` course links (may be []). */
export const getPillars = (region, chips = 3) =>
  categories.map((category) => ({
    ...category,
    courses: getCoursesByCategory(region, category.id, chips),
    url: categoryUrl(region, category.id),
  }))

/**
 * Find your course (4.5): featured courses when there are any, otherwise the categories
 * (the "course list is being updated" state).
 */
export function getFindYourCourse(region, limit = 6) {
  const featured = getFeaturedCourses(region, limit)
  if (featured.length) {
    return { mode: 'courses', courses: featured, total: getCoursesByRegion(region).length }
  }
  return {
    mode: 'categories',
    categories: categories.map((category) => ({
      ...category,
      url: categoryUrl(region, category.id),
    })),
  }
}

/**
 * Contact form (Phase 6): a course select, or a category select when there are no courses.
 * Always ends with "Not sure yet".
 */
export function getCourseSelectOptions(region) {
  const courses = getCoursesByRegion(region)
  const notSure = { value: courseSelect.notSureValue, label: courseSelect.notSure }
  if (courses.length) {
    return {
      kind: 'course',
      label: courseSelect.courseLabel,
      options: [...courses.map((course) => ({ value: course.slug, label: course.title })), notSure],
    }
  }
  return {
    kind: 'category',
    label: courseSelect.categoryLabel,
    options: [
      ...categories.map((category) => ({ value: category.id, label: category.title })),
      notSure,
    ],
  }
}
