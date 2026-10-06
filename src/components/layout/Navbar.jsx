import { useCallback, useId, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router'
import { LayoutGroup, m, useMotionValueEvent, useScroll } from 'motion/react'
import Logo from '@/components/brand/Logo'
import WhatsAppIcon from '@/components/brand/WhatsAppIcon'
import CoursesMenu from '@/components/layout/CoursesMenu'
import MenuToggle from '@/components/layout/MenuToggle'
import MobileMenu from '@/components/layout/MobileMenu'
import NavBlip from '@/components/layout/NavBlip'
import Button from '@/components/ui/Button'
import { mainNav, navCta, navLabels, whatsappMessage } from '@/data/navigation'
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe'
import { whatsappHref } from '@/lib/contact'
import { cx } from '@/lib/cx'
import { ease, transition } from '@/lib/motion'

const SCROLLED_AT = 24
// Layout height is 72px; once scrolled, the pill background scales to 64px (transform only).
const SHRUNK = 64 / 72

const activeIdFor = (pathname) =>
  mainNav.find((item) =>
    item.to === '/' ? pathname === '/' : pathname.startsWith(item.match ?? item.to),
  )?.id ?? null

/**
 * Floating pill navbar. Gains a shadow + blur and shrinks once scrolled; hides on scroll
 * down and returns on scroll up (past the hero only, and never while a menu is open or
 * focus is inside it). Below 1024px the links move into the MobileMenu drawer.
 */
export default function Navbar() {
  const reduced = useReducedMotionSafe()
  const { pathname, key } = useLocation()
  const { scrollY } = useScroll()
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  // Menus remember the history entry they were opened on, so any navigation closes them.
  const [coursesOpenAt, setCoursesOpenAt] = useState(null)
  const [drawerOpenAt, setDrawerOpenAt] = useState(null)
  const coursesOpen = coursesOpenAt === key
  const drawerOpen = drawerOpenAt === key
  const setCoursesOpen = useCallback((open) => setCoursesOpenAt(open ? key : null), [key])
  const setDrawerOpen = (open) => setDrawerOpenAt(open ? key : null)
  const [hovered, setHovered] = useState(null)
  const [focusWithin, setFocusWithin] = useState(false)
  const toggleRef = useRef(null)
  const drawerId = useId()

  const pinned = reduced || coursesOpen || drawerOpen || focusWithin

  useMotionValueEvent(scrollY, 'change', (y) => {
    setScrolled(y > SCROLLED_AT)
    const previous = scrollY.getPrevious() ?? 0
    const pastHero = y > window.innerHeight * 0.8
    if (!pastHero) setHidden(false)
    else if (y - previous > 4) setHidden(true)
    else if (previous - y > 4) setHidden(false)
  })

  const closeDrawer = useCallback(() => setDrawerOpenAt(null), [])
  const activeId = activeIdFor(pathname)
  const indicatorId = hovered ?? activeId

  return (
    <>
      <m.header
        className="fixed inset-x-0 z-50 px-4"
        style={{ top: 'calc(var(--banner-h) + var(--nav-inset))' }}
        animate={{ y: hidden && !pinned ? '-170%' : '0%' }}
        transition={{ duration: 0.35, ease: ease.out }}
        onFocus={() => setFocusWithin(true)}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) setFocusWithin(false)
        }}
      >
        <nav
          aria-label={navLabels.primary}
          className="relative isolate mx-auto grid h-(--nav-h) max-w-content grid-cols-[1fr_auto_1fr] items-center gap-2 pr-2 pl-5 sm:pr-3"
        >
          <NavBackground scrolled={scrolled || drawerOpen} />

          <m.div
            className="origin-left justify-self-start"
            animate={{ scale: scrolled ? 0.92 : 1 }}
            transition={transition.base}
          >
            <Link to="/" className="flex rounded-lg" aria-label={navLabels.homeLink}>
              <Logo alt="" className="h-9 w-auto max-w-none sm:h-10" />
            </Link>
          </m.div>

          <LayoutGroup id="main-nav">
            <ul
              className="hidden items-center gap-1 lg:flex"
              onPointerLeave={() => setHovered(null)}
            >
              {mainNav.map((item) => (
                <li
                  key={item.id}
                  className="relative"
                  onPointerEnter={(e) => e.pointerType === 'mouse' && setHovered(item.id)}
                >
                  {item.menu ? (
                    <CoursesMenu
                      open={coursesOpen}
                      onOpenChange={setCoursesOpen}
                      active={activeId === item.id}
                    />
                  ) : (
                    <NavLink
                      to={item.to}
                      end={item.to === '/'}
                      onFocus={() => setHovered(item.id)}
                      onBlur={() => setHovered(null)}
                      className={({ isActive }) =>
                        cx(
                          'inline-flex rounded-full px-3 py-2 text-[0.9375rem] font-semibold transition-colors duration-200 hover:text-pulse-red',
                          isActive ? 'text-pulse-red' : 'text-ink',
                        )
                      }
                    >
                      {item.label}
                    </NavLink>
                  )}
                  {indicatorId === item.id && <NavBlip drawKey={item.id} />}
                </li>
              ))}
            </ul>
          </LayoutGroup>

          <div className="col-start-3 flex items-center gap-1.5 justify-self-end sm:gap-2">
            <a
              href={whatsappHref(whatsappMessage)}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={navLabels.whatsapp}
              className="inline-flex size-11 items-center justify-center rounded-full border border-line text-ink transition-colors duration-200 hover:border-whatsapp hover:bg-whatsapp hover:text-white"
            >
              <WhatsAppIcon size={20} />
            </a>
            {/* Wrapper carries the visibility: Button's own inline-flex would override `hidden`. */}
            <span className="hidden sm:inline-flex">
              <Button to={navCta.to} size="md">
                {navCta.label}
              </Button>
            </span>
            <MenuToggle
              ref={toggleRef}
              open={drawerOpen}
              controls={drawerId}
              onClick={() => setDrawerOpen(!drawerOpen)}
            />
          </div>
        </nav>
      </m.header>

      <MobileMenu id={drawerId} open={drawerOpen} onClose={closeDrawer} toggleRef={toggleRef} />
    </>
  )
}

/** Two crossfading pill backgrounds (solid at the top, frosted once scrolled), scaled to shrink. */
function NavBackground({ scrolled }) {
  return (
    <m.div
      aria-hidden
      className="absolute inset-0 -z-10"
      animate={{ scaleY: scrolled ? SHRUNK : 1 }}
      transition={transition.base}
    >
      <m.div
        className="absolute inset-0 rounded-[36px] border border-line bg-white"
        animate={{ opacity: scrolled ? 0 : 1 }}
        transition={transition.base}
      />
      <m.div
        className="absolute inset-0 rounded-[36px] border border-line/70 bg-white/92 shadow-card backdrop-blur-md"
        animate={{ opacity: scrolled ? 1 : 0 }}
        transition={transition.base}
      />
    </m.div>
  )
}
