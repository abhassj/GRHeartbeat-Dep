import { useEffect, useRef } from 'react'
import { Link, NavLink } from 'react-router'
import { AnimatePresence, m } from 'motion/react'
import { ArrowRight, Phone } from 'lucide-react'
import WhatsAppIcon from '@/components/brand/WhatsAppIcon'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import { coursesMenu, mainNav, mobileMenu, navLabels, whatsappMessage } from '@/data/navigation'
import { useFocusTrap } from '@/hooks/useFocusTrap'
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe'
import { useSmoothScroll } from '@/hooks/useSmoothScroll'
import { getCoursesByRegion, hasCourses } from '@/lib/courses'
import { telHref, whatsappHref } from '@/lib/contact'
import { cx } from '@/lib/cx'
import { ease, stagger, transition } from '@/lib/motion'

const listVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: stagger, delayChildren: 0.12 } },
}
const itemVariants = {
  hidden: { opacity: 0, x: 24 },
  visible: { opacity: 1, x: 0, transition: transition.base },
}

const links = [...mainNav.filter((item) => item.to), mobileMenu.contactLink]

/**
 * Full-screen drawer for < 1024px. Slides in from the right, traps focus (together with
 * the toggle button, which stays on top as the X), locks page scroll, closes on Esc.
 */
export default function MobileMenu({ id, open, onClose, toggleRef }) {
  const reduced = useReducedMotionSafe()
  const { lock, unlock } = useSmoothScroll()
  const drawer = useRef(null)
  useFocusTrap(open, [toggleRef, drawer], () => {
    onClose()
    toggleRef.current?.focus()
  })

  useEffect(() => {
    if (!open) return
    lock()
    const first = drawer.current?.querySelector('a[href]')
    first?.focus({ preventScroll: true })
    return unlock
  }, [open, lock, unlock])

  // Close if the viewport grows to the desktop layout.
  useEffect(() => {
    if (!open) return
    const desktop = window.matchMedia('(min-width: 1024px)')
    const onChange = (e) => e.matches && onClose()
    desktop.addEventListener('change', onChange)
    return () => desktop.removeEventListener('change', onChange)
  }, [open, onClose])

  const live = hasCourses('sa')

  return (
    <AnimatePresence>
      {open && (
        <m.div
          key="drawer"
          className="fixed inset-0 z-40 lg:hidden"
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reduced ? undefined : { opacity: 0, transition: { duration: 0.2, delay: 0.1 } }}
        >
          <div aria-hidden className="absolute inset-0 bg-ink/30" onClick={onClose} />
          <m.div
            ref={drawer}
            id={id}
            // A div dialog (not <dialog>.showModal()) so the navbar toggle above it stays
            // usable as the morphing X; useFocusTrap provides the modal focus behaviour.
            // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role
            role="dialog"
            aria-modal="true"
            aria-label={navLabels.mobileMenu}
            className="absolute inset-y-0 right-0 flex w-full flex-col bg-white pt-(--nav-offset) sm:max-w-md sm:shadow-card-hover"
            initial={reduced ? false : { x: '100%' }}
            animate={{ x: 0 }}
            exit={reduced ? undefined : { x: '100%' }}
            transition={{ duration: 0.4, ease: ease.out }}
          >
            <div className="flex-1 overflow-y-auto overscroll-contain px-6 pb-6">
              <m.ul
                className="space-y-1"
                variants={reduced ? undefined : listVariants}
                initial={reduced ? false : 'hidden'}
                animate="visible"
              >
                {links.map((item) => (
                  <m.li key={item.to} variants={reduced ? undefined : itemVariants}>
                    <NavLink
                      to={item.to}
                      end
                      className={({ isActive }) =>
                        cx(
                          'flex items-center justify-between rounded-xl py-3 font-display text-h3 font-extrabold transition-colors',
                          isActive ? 'text-pulse-red' : 'text-ink hover:text-pulse-red',
                        )
                      }
                    >
                      {item.label}
                      <ArrowRight aria-hidden size={20} className="text-grey-400" />
                    </NavLink>
                  </m.li>
                ))}

                <m.li variants={reduced ? undefined : itemVariants} className="pt-5">
                  <p className="pb-3 text-eyebrow font-bold tracking-[0.12em] text-navy uppercase">
                    {mobileMenu.coursesHeading}
                  </p>
                  <div className="grid gap-3">
                    <RegionLink
                      to={coursesMenu.sa.to}
                      title={coursesMenu.sa.title}
                      badge={
                        <Badge tone="success" dot>
                          {coursesMenu.sa.badge}
                        </Badge>
                      }
                      line={
                        live
                          ? coursesMenu.sa.count(getCoursesByRegion('sa').length)
                          : coursesMenu.sa.categoriesHeading
                      }
                    />
                    <RegionLink
                      to={coursesMenu.uk.to}
                      title={coursesMenu.uk.title}
                      badge={
                        <Badge tone="amber" dot>
                          {coursesMenu.uk.badge}
                        </Badge>
                      }
                      line={coursesMenu.uk.line}
                    />
                  </div>
                </m.li>
              </m.ul>
            </div>

            <div className="grid grid-cols-2 gap-3 border-t border-line bg-white px-6 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
              <Button href={telHref()} iconStart={Phone} className="w-full">
                {mobileMenu.callLabel}
              </Button>
              <Button
                href={whatsappHref(whatsappMessage)}
                target="_blank"
                rel="noopener noreferrer"
                variant="secondary"
                iconStart={WhatsAppIcon}
                className="w-full"
              >
                {mobileMenu.whatsappLabel}
              </Button>
            </div>
          </m.div>
        </m.div>
      )}
    </AnimatePresence>
  )
}

function RegionLink({ to, title, badge, line }) {
  return (
    <Link
      to={to}
      className="group flex flex-col gap-2 rounded-card border border-line bg-surface p-5 transition-colors hover:border-grey-300"
    >
      <span className="flex items-center justify-between gap-3">
        <span className="font-display text-h4 font-bold text-ink group-hover:text-pulse-red">
          {title}
        </span>
        {badge}
      </span>
      <span className="text-sm text-navy">{line}</span>
    </Link>
  )
}
