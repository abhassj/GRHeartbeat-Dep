import { forwardRef } from 'react'
import { motion } from 'motion/react'
import { navLabels } from '@/data/navigation'
import { transition } from '@/lib/motion'

const bar = 'absolute left-0 h-0.5 w-full rounded-full bg-current'

/** Hamburger that morphs into an X (transforms only). Controls the mobile drawer. */
const MenuToggle = forwardRef(function MenuToggle({ open, controls, onClick }, ref) {
  return (
    <button
      ref={ref}
      type="button"
      aria-expanded={open}
      aria-controls={controls}
      aria-label={open ? navLabels.closeMenu : navLabels.openMenu}
      onClick={onClick}
      className="relative inline-flex size-11 items-center justify-center rounded-full text-ink transition-colors hover:bg-grey-50 lg:hidden"
    >
      <span aria-hidden className="relative block h-3.5 w-5">
        <motion.span
          className={`${bar} top-0`}
          animate={open ? { y: 6, rotate: 45 } : { y: 0, rotate: 0 }}
          transition={transition.fast}
        />
        <motion.span
          className={`${bar} top-1.5`}
          animate={{ opacity: open ? 0 : 1, scaleX: open ? 0.4 : 1 }}
          transition={transition.fast}
        />
        <motion.span
          className={`${bar} top-3`}
          animate={open ? { y: -6, rotate: -45 } : { y: 0, rotate: 0 }}
          transition={transition.fast}
        />
      </span>
    </button>
  )
})

export default MenuToggle
