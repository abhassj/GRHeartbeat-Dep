import { motion } from 'motion/react'
import { useMotionPreference } from '@/hooks/useReducedMotionSafe'
import { cx } from '@/lib/cx'
import { transition } from '@/lib/motion'

const options = [
  { value: null, label: 'System' },
  { value: 'reduce', label: 'Reduced' },
  { value: 'full', label: 'Full' },
]

/** Floating switch that overrides prefers-reduced-motion for the whole app (preview only). */
export default function MotionToggle() {
  const { override, setOverride, system, reduced } = useMotionPreference()

  return (
    <div className="fixed bottom-4 left-4 z-40 rounded-full border border-line bg-white/90 p-1.5 shadow-card-hover backdrop-blur-md sm:left-1/2 sm:-translate-x-1/2">
      <fieldset className="flex items-center gap-1">
        <legend className="sr-only">Motion preview</legend>
        <span className="hidden px-3 text-xs font-semibold text-grey-600 sm:inline">
          Motion
          <span className="ml-1.5 font-normal">
            (OS: {system ? 'reduced' : 'full'} → {reduced ? 'static' : 'animated'})
          </span>
        </span>
        {options.map((option) => {
          const active = override === option.value
          return (
            <button
              key={option.label}
              type="button"
              aria-pressed={active}
              onClick={() => setOverride(option.value)}
              className={cx(
                'relative h-9 rounded-full px-4 text-sm font-semibold transition-colors duration-200',
                active ? 'text-white' : 'text-ink hover:text-pulse-red',
              )}
            >
              {active && (
                <motion.span
                  layoutId="motion-toggle-indicator"
                  className="absolute inset-0 rounded-full bg-ink"
                  transition={transition.morph}
                />
              )}
              <span className="relative">{option.label}</span>
            </button>
          )
        })}
      </fieldset>
    </div>
  )
}
