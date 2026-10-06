import { categories } from '@/data/categories'
import saCourses from '@/data/courses.sa'
import ukCourses from '@/data/courses.uk'
import { sampleCourses } from '@/data/fixtures/courses.sample'

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
export const SAMPLES_ENABLED = import.meta.env.DEV || import.meta.env.VITE_SAMPLE_CONTENT === 'true'

const realCourses = { sa: saCourses, uk: ukCourses }

function source(region) {
  const real = realCourses[region] ?? []
  if (real.length) return real
  if (SAMPLES_ENABLED) return sampleCourses.filter((course) => course.region === region)
  return []
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
