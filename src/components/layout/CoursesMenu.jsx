import { useEffect, useId, useRef } from 'react'
import { Link } from 'react-router'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowRight, ChevronDown } from 'lucide-react'
import TiltCard from '@/components/motion/TiltCard'
import Badge from '@/components/ui/Badge'
import { coursesMenu as copy } from '@/data/navigation'
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe'
import {
  categoryUrl,
  courseUrl,
  getCategories,
  getCoursesByRegion,
  getFeaturedCourses,
  hasCourses,
} from '@/lib/courses'
import { cx } from '@/lib/cx'
import { getIcon } from '@/lib/icons'
import { ease, stagger, transition } from '@/lib/motion'

const OPEN_DELAY = 120
const CLOSE_DELAY = 160

const panelVariants = {
  hidden: { opacity: 0, scale: 0.96, y: -6 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.22, ease: ease.out, staggerChildren: stagger, delayChildren: 0.04 },
  },
  exit: { opacity: 0, scale: 0.98, y: -4, transition: { duration: 0.14, ease: ease.out } },
}

const cardVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: transition.fast },
}

const rowClass =
  'group/row flex items-center gap-3 rounded-xl px-3 py-2.5 text-[0.9375rem] font-medium text-ink transition-colors duration-200 hover:bg-red-tint hover:text-crimson focus-visible:bg-red-tint'

/**
 * "Courses ▾" disclosure in the navbar. Opens on hover (after a short intent delay), on
 * click, and with Enter/Space/↓; arrow keys move between its links; Esc or leaving closes.
 * The South Africa card adapts to the course data: featured courses, or categories when
 * no courses are published yet.
 */
export default function CoursesMenu({ open, onOpenChange, active, onHoverChange }) {
  const reduced = useReducedMotionSafe()
  const panelId = useId()
  const wrapper = useRef(null)
  const trigger = useRef(null)
  const panel = useRef(null)
  const timer = useRef(null)

  const clearTimer = () => clearTimeout(timer.current)
  const later = (fn, delay) => {
    clearTimer()
    timer.current = setTimeout(fn, delay)
  }
  useEffect(() => clearTimer, [])

  // Close on outside pointer down.
  useEffect(() => {
    if (!open) return
    const onPointerDown = (event) => {
      if (!wrapper.current?.contains(event.target)) onOpenChange(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [open, onOpenChange])

  const links = () => [...(panel.current?.querySelectorAll('a[href]') ?? [])]

  const focusLink = (index) => {
    const items = links()
    if (!items.length) return
    items[(index + items.length) % items.length].focus()
  }

  const onTriggerKeyDown = (event) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      onOpenChange(true)
      requestAnimationFrame(() => focusLink(0))
    } else if (event.key === 'Escape' && open) {
      onOpenChange(false)
    }
  }

  const onPanelKeyDown = (event) => {
    const items = links()
    const index = items.indexOf(document.activeElement)
    if (event.key === 'ArrowDown') focusLink(index + 1)
    else if (event.key === 'ArrowUp') focusLink(index - 1)
    else if (event.key === 'Home') focusLink(0)
    else if (event.key === 'End') focusLink(-1)
    else if (event.key === 'Escape') {
      onOpenChange(false)
      trigger.current?.focus()
    } else return
    event.preventDefault()
  }

  const onBlur = (event) => {
    if (!wrapper.current?.contains(event.relatedTarget)) onOpenChange(false)
  }

  return (
    <div
      ref={wrapper}
      className="relative"
      onPointerEnter={(event) => {
        if (event.pointerType !== 'mouse') return
        onHoverChange?.(true)
        later(() => onOpenChange(true), OPEN_DELAY)
      }}
      onPointerLeave={(event) => {
        if (event.pointerType !== 'mouse') return
        onHoverChange?.(false)
        later(() => onOpenChange(false), CLOSE_DELAY)
      }}
      onBlur={onBlur}
    >
      <button
        ref={trigger}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => {
          clearTimer()
          onOpenChange(!open)
        }}
        onKeyDown={onTriggerKeyDown}
        className={cx(
          'inline-flex items-center gap-1 rounded-full px-3 py-2 text-[0.9375rem] font-semibold transition-colors duration-200 hover:text-pulse-red',
          active || open ? 'text-pulse-red' : 'text-ink',
        )}
      >
        {copy.label}
        <ChevronDown
          aria-hidden
          size={16}
          className={cx('transition-transform duration-200', open && 'rotate-180')}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            ref={panel}
            id={panelId}
            onKeyDown={onPanelKeyDown}
            className="absolute top-full left-1/2 mt-4 w-[min(42rem,calc(100vw-2rem))] origin-top -translate-x-1/2 rounded-xl border border-line bg-white p-3 shadow-card-hover"
            variants={reduced ? undefined : panelVariants}
            initial={reduced ? false : 'hidden'}
            animate="visible"
            exit={reduced ? undefined : 'exit'}
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <motion.div variants={reduced ? undefined : cardVariants}>
                <TiltCard className="h-full rounded-card">
                  <SouthAfricaCard />
                </TiltCard>
              </motion.div>
              <motion.div variants={reduced ? undefined : cardVariants}>
                <TiltCard className="h-full rounded-card">
                  <UnitedKingdomCard />
                </TiltCard>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function RegionCardShell({ title, badge, meta, children }) {
  return (
    <div className="flex h-full flex-col rounded-card border border-line bg-surface p-4">
      <div className="flex items-center justify-between gap-3 px-3 pt-1 pb-3">
        <p className="font-display text-h4 font-bold text-ink">{title}</p>
        {badge}
      </div>
      {meta && <p className="-mt-2 px-3 pb-2 text-sm text-navy">{meta}</p>}
      {children}
    </div>
  )
}

function SouthAfricaCard() {
  const sa = copy.sa
  const live = hasCourses('sa')
  const featured = getFeaturedCourses('sa', 3)

  return (
    <RegionCardShell
      title={sa.title}
      badge={
        <Badge tone="success" dot>
          {sa.badge}
        </Badge>
      }
      meta={live ? sa.count(getCoursesByRegion('sa').length) : null}
    >
      <p className="px-3 pt-1 pb-1 text-xs font-semibold tracking-[0.12em] text-navy uppercase">
        {live && featured.length ? sa.featuredHeading : sa.categoriesHeading}
      </p>
      <ul className="flex-1">
        {live && featured.length
          ? featured.map((course) => (
              <li key={course.slug}>
                <Link to={courseUrl(course)} className={rowClass}>
                  <span className="line-clamp-2">{course.title}</span>
                </Link>
              </li>
            ))
          : getCategories().map((category) => {
              const Icon = getIcon(category.icon)
              return (
                <li key={category.id}>
                  <Link to={categoryUrl('sa', category.id)} className={rowClass}>
                    <Icon aria-hidden size={18} className="shrink-0 text-navy" />
                    {category.title}
                  </Link>
                </li>
              )
            })}
      </ul>
      <Link
        to={sa.to}
        className="mt-2 inline-flex items-center gap-1.5 self-start rounded-full px-3 py-2 text-sm font-semibold text-pulse-red hover:text-crimson"
      >
        {sa.viewAll}
        <ArrowRight aria-hidden size={16} />
      </Link>
    </RegionCardShell>
  )
}

function UnitedKingdomCard() {
  const uk = copy.uk
  return (
    <RegionCardShell
      title={uk.title}
      badge={
        <Badge tone="amber" dot>
          {uk.badge}
        </Badge>
      }
    >
      <p className="flex-1 px-3 pt-1 text-[0.9375rem]">{uk.line}</p>
      <Link
        to={uk.to}
        className="mt-4 inline-flex items-center gap-1.5 self-start rounded-full px-3 py-2 text-sm font-semibold text-pulse-red hover:text-crimson"
      >
        {uk.cta}
        <ArrowRight aria-hidden size={16} />
      </Link>
    </RegionCardShell>
  )
}
