// Stand-in body for pages that are not built yet.
export default function PagePlaceholder({ title, description }) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20">
      <title>{`${title} | GR Heartbeat`}</title>
      <p className="text-sm font-semibold tracking-widest text-red uppercase">
        Coming in a later phase
      </p>
      <h1 className="mt-2 text-4xl sm:text-5xl">{title}</h1>
      {description && <p className="mt-4 max-w-2xl text-lg text-muted">{description}</p>}
    </section>
  )
}
