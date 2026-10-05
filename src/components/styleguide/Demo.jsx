import { useState } from 'react'
import { RotateCcw } from 'lucide-react'
import { cx } from '@/lib/cx'

/** Labelled specimen box. `replay` adds a button that remounts the children. */
export default function Demo({ title, note, replay = false, className, bodyClassName, children }) {
  const [run, setRun] = useState(0)

  return (
    <figure className={cx('overflow-hidden rounded-card border border-line bg-white', className)}>
      <figcaption className="flex items-start justify-between gap-4 border-b border-line px-5 py-3.5">
        <div>
          <p className="font-display text-sm font-bold text-ink">{title}</p>
          {note && <p className="mt-0.5 text-sm leading-snug text-grey-600">{note}</p>}
        </div>
        {replay && (
          <button
            type="button"
            onClick={() => setRun((n) => n + 1)}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-xs font-semibold text-ink transition-colors hover:border-grey-300 hover:text-pulse-red"
          >
            <RotateCcw aria-hidden size={13} />
            Replay
          </button>
        )}
      </figcaption>
      <div key={run} className={cx('p-5 sm:p-8', bodyClassName)}>
        {children}
      </div>
    </figure>
  )
}
