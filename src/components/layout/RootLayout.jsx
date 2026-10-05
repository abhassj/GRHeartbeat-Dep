import { Link, NavLink, Outlet, ScrollRestoration } from 'react-router'
import Logo from '@/components/brand/Logo'
import SmoothScroll from '@/components/providers/SmoothScroll'
import Container from '@/components/ui/Container'
import { brand } from '@/data/brand'

// Temporary shell. Replaced by the real Navbar, Footer and WhatsAppFab in Phase 2.
const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/courses/sa', label: 'Courses SA' },
  { to: '/courses/uk', label: 'Courses UK' },
  { to: '/about', label: 'About Us' },
  { to: '/contact', label: 'Contact' },
]

const year = new Date().getFullYear()

export default function RootLayout() {
  return (
    <SmoothScroll>
      <div className="flex min-h-dvh flex-col">
        <header className="border-b border-line">
          <Container
            as="nav"
            aria-label="Main"
            className="flex flex-wrap items-center gap-x-6 gap-y-2 py-4"
          >
            <Link to="/" className="mr-auto">
              <Logo alt={`${brand.name} home`} className="h-10 w-auto" />
            </Link>
            {navLinks.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end
                className={({ isActive }) =>
                  isActive ? 'font-semibold text-pulse-red' : 'text-ink hover:text-pulse-red'
                }
              >
                {label}
              </NavLink>
            ))}
          </Container>
        </header>

        <main id="main" className="flex-1">
          <Outlet />
        </main>

        <footer className="bg-slate py-6 text-center text-sm text-grey-200">
          © {year} {brand.fullName}
        </footer>

        {/* Scrolls to top on new navigations and restores position on back/forward. */}
        <ScrollRestoration />
      </div>
    </SmoothScroll>
  )
}
