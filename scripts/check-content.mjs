#!/usr/bin/env node
// Content check: npm run check:content [-- --strict]
//
// - Validates src/data/courses.sa.js and courses.uk.js with validateCourse() (exits 1 on any
//   invalid entry), plus the sample fixtures, videos.js and clients.js.
// - Prints how many TODO(client) markers remain in each file under src/.
// - --strict (launch gate): also fails while TODO(client) markers remain or the South
//   African course list is empty.
// Plain Node, no dependencies.

import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = fileURLToPath(new URL('..', import.meta.url))
const data = (file) => import(pathToFileURL(join(root, 'src/data', file)).href)
const strict = process.argv.includes('--strict')

const { validateCourseList } = await data('courses.schema.js')
const { categories } = await data('categories.js')
const { videos } = await data('videos.js')
const { clients } = await data('clients.js')
const { sampleCourses } = await data('fixtures/courses.sample.js')
const courseFiles = {
  'courses.sa.js': { region: 'sa', list: (await data('courses.sa.js')).default },
  'courses.uk.js': { region: 'uk', list: (await data('courses.uk.js')).default },
}

let failures = 0
const ok = (msg) => console.log(`  ✓ ${msg}`)
const bad = (msg) => {
  failures += 1
  console.log(`  ✗ ${msg}`)
}

// ── Courses ────────────────────────────────────────────────
console.log('\nCourses')
for (const [file, { region, list }] of Object.entries(courseFiles)) {
  const { invalid } = validateCourseList(list)
  const wrongRegion = Array.isArray(list) ? list.filter((c) => c?.region !== region) : []
  if (!invalid.length && !wrongRegion.length) {
    ok(`${file}: ${list.length} ${list.length === 1 ? 'course' : 'courses'}, all valid`)
  }
  for (const { slug, errors } of invalid) {
    for (const { field, message } of errors) bad(`${file} › ${slug} › ${field}: ${message}`)
  }
  for (const course of wrongRegion) {
    bad(`${file} › ${course?.slug} › region: must be "${region}" in this file`)
  }
}
if (strict && courseFiles['courses.sa.js'].list.length === 0) {
  bad('courses.sa.js is empty: the launch gate needs the real course list (Course import step)')
}

const fixtures = validateCourseList(sampleCourses)
if (fixtures.valid) ok(`fixtures/courses.sample.js: ${sampleCourses.length} samples, all valid`)
for (const { slug, errors } of fixtures.invalid) {
  for (const { field, message } of errors)
    bad(`fixtures/courses.sample.js › ${slug} › ${field}: ${message}`)
}

// ── Videos ─────────────────────────────────────────────────
console.log('\nVideos')
const categoryIds = categories.map((c) => c.id)
for (const video of videos) {
  const problems = []
  for (const field of ['id', 'title', 'description']) {
    if (typeof video[field] !== 'string' || !video[field].trim())
      problems.push(`${field} is required`)
  }
  if (!categoryIds.includes(video.relatedCategory)) {
    problems.push(`relatedCategory must be one of: ${categoryIds.join(', ')}`)
  }
  if (video.youtubeId !== null && !/^[\w-]{11}$/.test(video.youtubeId ?? '')) {
    problems.push('youtubeId must be null or an 11-character YouTube ID')
  }
  if (video.youtubeId && !video.captions)
    problems.push('a published video needs captions or a transcript')
  if (problems.length) problems.forEach((p) => bad(`videos.js › ${video.id} › ${p}`))
  else ok(`videos.js › ${video.id}: ${video.youtubeId ? 'published' : 'coming soon (no ID yet)'}`)
}

// ── Clients ────────────────────────────────────────────────
console.log('\nClients')
if (!Array.isArray(clients)) bad('clients.js must export an array')
else if (!clients.length) ok('clients.js: empty (the clients section is hidden in production)')
else {
  clients.forEach((client, index) => {
    const label = client?.name || `(entry ${index + 1})`
    for (const field of ['name', 'logo', 'alt']) {
      if (typeof client?.[field] !== 'string' || !client[field].trim())
        bad(`clients.js › ${label} › ${field} is required`)
    }
  })
  ok(`clients.js: ${clients.length} clients checked`)
}

// ── TODO(client) markers ───────────────────────────────────
console.log('\nTODO(client) markers')
const walk = (dir) =>
  readdirSync(dir).flatMap((name) => {
    const path = join(dir, name)
    return statSync(path).isDirectory() ? walk(path) : [path]
  })
const counts = walk(join(root, 'src'))
  .filter((path) => /\.(jsx?|md|svg|css|html)$/.test(path))
  .map((path) => [
    relative(root, path).replaceAll('\\', '/'),
    (readFileSync(path, 'utf8').match(/TODO\(client\)/g) ?? []).length,
  ])
  .filter(([, n]) => n > 0)
  .sort(([a], [b]) => a.localeCompare(b))
const total = counts.reduce((sum, [, n]) => sum + n, 0)
const width = Math.max(...counts.map(([file]) => file.length), 0)
counts.forEach(([file, n]) => console.log(`  ${file.padEnd(width)}  ${String(n).padStart(3)}`))
console.log(`  ${'Total'.padEnd(width)}  ${String(total).padStart(3)}`)
if (strict && total > 0) bad(`${total} TODO(client) markers remain (launch gate requires none)`)

// ── Result ─────────────────────────────────────────────────
console.log(failures ? `\n✗ ${failures} problem(s) found.` : '\n✓ Content check passed.')
process.exit(failures ? 1 : 0)
