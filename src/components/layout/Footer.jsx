import { useId, useRef, useState } from 'react'
import { Link } from 'react-router'
import { motion } from 'motion/react'
import { ArrowUp, ChevronDown, FileText, Mail, MapPin, Phone } from 'lucide-react'
import Logo from '@/components/brand/Logo'
import PulseLine from '@/components/brand/PulseLine'
import WhatsAppIcon from '@/components/brand/WhatsAppIcon'
import { FINAL_CTA_OVERLAP } from '@/components/layout/FinalCta'
import Container from '@/components/ui/Container'
import { footer as copy, whatsappMessage } from '@/data/navigation'
import { site } from '@/data/site'
import { useHidesFab } from '@/hooks/useFabVisibility'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe'
import { useSmoothScroll } from '@/hooks/useSmoothScroll'
import { categoryUrl, getCategories } from '@/lib/courses'
import { mailtoHref, telHref, whatsappHref } from '@/lib/contact'
import { cx } from '@/lib/cx'
import { focusPageStart } from '@/lib/focus'
import { transition } from '@/lib/motion'

const year = new Date().getFullYear()

const linkClass =
  'inline-flex items-center gap-2 text-white transition-[color,translate] duration-200 hover:translate-x-0.5 hover:text-red-100'

/**
 * Slate footer: brand + accreditations, courses, company and contact columns (accordions
 * on mobile), a PulseLine that draws across the top when it enters view, and a bottom bar
 * with copyright, privacy and back-to-top. `overlap` makes room for the FinalCta band.
 */
export default function Footer({ overlap = false }) {
  const ref = useRef(null)
  useHidesFab(ref)
  const { scrollTo } = useSmoothScroll()

  const backToTop = () => {
    scrollTo(0)
    focusPageStart()
  }

  return (
    <footer
      ref={ref}
      data-tone="dark"
      className="bg-slate text-grey-200 [--heading-color:var(--color-white)]"
      style={{ paddingTop: overlap ? `calc(${FINAL_CTA_OVERLAP} + 3rem)` : '4rem' }}
    >
      <Container>
        <PulseLine
          className="h-10 w-full"
          shape="spike"
          beats={[0.5]}
          color="var(--color-red-100)"
          blipColor="var(--color-white)"
          strokeWidth={1.5}
          draw="view"
          drawDuration={1.8}
          loop={false}
        />

        <div className="mt-10 grid lg:grid-cols-4 lg:divide-x lg:divide-grey-600">
          <div className="pb-8 lg:pr-8 lg:pb-0">
            <Link
              to="/"
              aria-label={copy.logoLabel}
              className="inline-flex rounded-2xl bg-white px-4 py-3 shadow-card"
            >
              <Logo alt="" className="h-9 w-auto" />
            </Link>
            <p className="mt-5 max-w-xs text-[0.9375rem]">{copy.about}</p>
            {site.accreditations.length > 0 && (
              <>
                <p className="mt-6 text-xs font-bold tracking-[0.12em] text-white uppercase">
                  {copy.accreditationsHeading}
                </p>
                <ul className="mt-3 space-y-2 text-sm">
                  {site.accreditations.map((item) => (
                    <li key={item.id}>
                      <span className="font-semibold text-white">{item.name}</span>
                      <span className="block text-grey-200">{item.reference}</span>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>

          <FooterColumn title={copy.columns.courses}>
            <li>
              <Link to={copy.courseLinks.sa.to} className={linkClass}>
                {copy.courseLinks.sa.label}
              </Link>
            </li>
            <li>
              <Link to={copy.courseLinks.uk.to} className={cx(linkClass, 'flex-wrap')}>
                <span className="whitespace-nowrap">{copy.courseLinks.uk.label}</span>
                <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[0.6875rem] font-semibold whitespace-nowrap text-amber">
                  {copy.courseLinks.uk.badge}
                </span>
              </Link>
            </li>
            {getCategories().map((category) => (
              <li key={category.id}>
                <Link to={categoryUrl('sa', category.id)} className={linkClass}>
                  {category.title}
                </Link>
              </li>
            ))}
          </FooterColumn>

          <FooterColumn title={copy.columns.company}>
            {copy.companyLinks.map((item) => (
              <li key={item.to}>
                <Link to={item.to} className={linkClass}>
                  {item.label}
                </Link>
              </li>
            ))}
            {site.companyProfilePdf && (
              <li>
                <a href={site.companyProfilePdf} className={linkClass} download>
                  <FileText aria-hidden size={16} />
                  {copy.companyProfileLabel}
                </a>
              </li>
            )}
          </FooterColumn>

          <FooterColumn title={copy.columns.contact}>
            {site.phones.map((phone) => (
              <li key={phone.tel}>
                <a href={telHref(phone)} className={linkClass}>
                  <Phone aria-hidden size={16} className="text-grey-200" />
                  {phone.display}
                </a>
              </li>
            ))}
            <li>
              <a
                href={whatsappHref(whatsappMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className={linkClass}
              >
                <WhatsAppIcon size={16} className="text-grey-200" />
                {copy.whatsappLabel}
              </a>
            </li>
            <li>
              <a href={mailtoHref()} className={cx(linkClass, 'break-all')}>
                <Mail aria-hidden size={16} className="shrink-0 text-grey-200" />
                {site.email}
              </a>
            </li>
            <li className="inline-flex items-center gap-2">
              <MapPin aria-hidden size={16} />
              {site.location.label}
            </li>
          </FooterColumn>
        </div>
      </Container>

      <div className="mt-14 bg-grey-800">
        <Container className="flex flex-wrap items-center justify-between gap-4 py-5 text-sm">
          <p>{copy.copyright(year)}</p>
          <div className="flex items-center gap-5">
            <Link to={copy.privacy.to} className="text-grey-200 hover:text-red-100">
              {copy.privacy.label}
            </Link>
            <button
              type="button"
              onClick={backToTop}
              aria-label={copy.backToTop}
              className="inline-flex size-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
            >
              <ArrowUp aria-hidden size={18} />
            </button>
          </div>
        </Container>
      </div>
    </footer>
  )
}

/** A footer column: always open on desktop, an accordion below 1024px. */
function FooterColumn({ title, children }) {
  const desktop = useMediaQuery('(min-width: 1024px)')
  const reduced = useReducedMotionSafe()
  const [open, setOpen] = useState(false)
  const listId = useId()
  const expanded = desktop || open

  return (
    <div className="border-t border-grey-600 lg:border-t-0 lg:px-8 lg:last:pr-0">
      <h2 className="font-display text-sm font-bold tracking-[0.12em] text-white uppercase">
        {desktop ? (
          <span className="block pb-4">{title}</span>
        ) : (
          <button
            type="button"
            aria-expanded={open}
            aria-controls={listId}
            onClick={() => setOpen((value) => !value)}
            className="flex w-full items-center justify-between py-4 text-left tracking-[0.12em] uppercase"
          >
            {title}
            <ChevronDown
              aria-hidden
              size={18}
              className={cx('transition-transform duration-200', open && 'rotate-180')}
            />
          </button>
        )}
      </h2>
      <motion.ul
        id={listId}
        hidden={!expanded}
        className="space-y-3 pb-6 text-[0.9375rem] lg:pb-0"
        initial={false}
        animate={expanded ? { opacity: 1, y: 0 } : { opacity: 0, y: -6 }}
        transition={reduced || desktop ? { duration: 0 } : transition.fast}
      >
        {children}
      </motion.ul>
    </div>
  )
}
