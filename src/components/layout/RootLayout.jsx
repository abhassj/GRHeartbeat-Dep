import { Link, NavLink, Outlet, ScrollRestoration } from 'react-router'

// Temporary shell. Replaced by the real Header, Footer and WhatsAppFab in Phase 1.
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
    <div className="flex min-h-dvh flex-col">
      <header className="border-b border-chrome/60">
        <nav
          aria-label="Main"
          className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-4"
        >
          <Link to="/" className="font-heading text-lg font-extrabold text-navy italic">
            GR <span className="text-red">Heartbeat</span>
          </Link>
          {navLinks.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end
              className={({ isActive }) =>
                isActive ? 'font-semibold text-red' : 'text-muted hover:text-navy'
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="bg-navy py-6 text-center text-sm text-white/80">
        © {year} GR Heartbeat
      </footer>

      {/* Scrolls to top on new navigations and restores position on back/forward. */}
      <ScrollRestoration />
    </div>
  )
}
