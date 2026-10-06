#!/usr/bin/env node
// Build output check: npm run check:dist (runs automatically after `npm run build`).
// Fails if dist/ contains development-only content or any file over 3 MB:
// - "Sample course" (case-insensitive): sample course fixtures
// - "Client logo": client-logo placeholders
// - "__router", "__scrollPositions": development test hooks
// Plain Node, no dependencies.

import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('..', import.meta.url))
const dist = join(root, 'dist')
const MAX_BYTES = 3 * 1024 * 1024
const TEXT = /\.(html|js|mjs|css|json|svg|txt|xml|webmanifest|map)$/
const FORBIDDEN = [
  { label: 'Sample course', pattern: /sample course/i },
  { label: 'Client logo', pattern: /Client logo/ },
  { label: '__router', pattern: /__router/ },
  { label: '__scrollPositions', pattern: /__scrollPositions/ },
]

if (!existsSync(dist)) {
  console.error('✗ dist/ not found — run `npm run build` first.')
  process.exit(1)
}

const walk = (dir) =>
  readdirSync(dir).flatMap((name) => {
    const path = join(dir, name)
    return statSync(path).isDirectory() ? walk(path) : [path]
  })

const problems = []
let largest = { file: '', size: 0 }
const files = walk(dist)

for (const path of files) {
  const file = relative(root, path).replaceAll('\\', '/')
  const { size } = statSync(path)
  if (size > largest.size) largest = { file, size }
  if (size > MAX_BYTES) problems.push(`${file}: ${(size / 1024 / 1024).toFixed(2)} MB (limit 3 MB)`)
  if (!TEXT.test(path)) continue
  const text = readFileSync(path, 'utf8')
  for (const { label, pattern } of FORBIDDEN) {
    if (pattern.test(text)) problems.push(`${file}: contains "${label}"`)
  }
}

console.log(
  `check:dist — ${files.length} files, largest ${largest.file} (${(largest.size / 1024).toFixed(0)} KB)`,
)
if (problems.length) {
  problems.forEach((p) => console.log(`  ✗ ${p}`))
  console.log(`✗ ${problems.length} problem(s) in dist/.`)
  process.exit(1)
}
console.log('✓ dist/ is clean.')
