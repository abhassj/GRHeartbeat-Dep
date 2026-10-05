import { Link } from 'react-router'

export default function NotFound() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-24 text-center">
      <title>Page not found | GR Heartbeat</title>
      <p className="font-heading text-6xl font-extrabold text-red">404</p>
      <h1 className="mt-4 text-3xl">We couldn&apos;t find that page</h1>
      <p className="mt-3 text-muted">It may have moved, or the link might be wrong.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          to="/courses/sa"
          className="rounded-button bg-red px-5 py-3 font-semibold text-white hover:bg-crimson"
        >
          Browse SA courses
        </Link>
        <Link
          to="/"
          className="rounded-button border border-navy px-5 py-3 font-semibold text-navy hover:bg-surface"
        >
          Back home
        </Link>
      </div>
    </section>
  )
}
