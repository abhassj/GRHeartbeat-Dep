import { skipLinkLabel } from '@/data/navigation'
import { focusPageStart } from '@/lib/focus'

/** First focusable element: jumps keyboard users past the navbar to the page content. */
export default function SkipLink() {
  return (
    <a
      href="#main"
      onClick={(event) => {
        event.preventDefault()
        focusPageStart()
        document.getElementById('main')?.scrollIntoView({ block: 'start' })
      }}
      className="fixed top-3 left-3 z-[70] -translate-y-[200%] rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white shadow-card-hover transition-transform focus-visible:translate-y-0"
    >
      {skipLinkLabel}
    </a>
  )
}
