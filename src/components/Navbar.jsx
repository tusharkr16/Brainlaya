import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

const NAV_LINKS = [
  { label: 'Courses', href: '/courses' },
  { label: 'Mentors', href: '/mentors' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Enterprise', href: '/enterprise' },
]

function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2.5 whitespace-nowrap text-[26px] font-extrabold text-primary">
      <span className="flex h-14 w-14 flex-col items-center justify-center gap-0.5 rounded-xl border border-surface-dim bg-white px-2 py-1.5 shadow-[var(--shadow-card-sm)]">
        <svg viewBox="0 0 24 24" width="26" height="26">
          <rect x="2" y="2" width="9" height="9" rx="2.5" fill="#f97316" />
          <rect x="13" y="2" width="9" height="9" rx="2.5" fill="#2563eb" />
          <rect x="2" y="13" width="9" height="9" rx="2.5" fill="#1d4e43" />
          <rect x="13" y="13" width="9" height="9" rx="2.5" fill="#d9f99d" />
        </svg>
        <span className="text-[5px] leading-none font-bold tracking-wider text-on-surface-variant">
          BRAINALAYA
        </span>
      </span>
      Brainlaya
    </Link>
  )
}

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { pathname } = useLocation()

  const isLanding = pathname === '/'

  useEffect(() => {
    if (!isLanding) return
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [isLanding])

  const solid = scrolled || !isLanding

  return (
    <header
      className={
        solid
          ? 'sticky top-0 z-40 border-b border-surface-dim bg-surface-container-lowest shadow-[var(--shadow-card-sm)] transition-colors'
          : 'sticky top-0 z-40 border-b border-transparent bg-transparent transition-colors'
      }
    >
      <div className="mx-auto flex max-w-7xl min-w-0 items-center gap-10 px-8 py-4 max-lg:px-5">
        <Logo />

        <nav className="hidden flex-1 items-center gap-7 lg:flex" aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              to={link.href}
              className={
                pathname === link.href
                  ? 'border-b-2 border-secondary pb-1 text-[15px] font-medium text-secondary transition-colors'
                  : 'border-b-2 border-transparent pb-1 text-[15px] font-medium text-on-surface-variant transition-colors hover:text-on-surface'
              }
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex flex-1 items-center justify-end gap-4 lg:flex-none">
          <label
            htmlFor="course-search"
            className="hidden w-56 items-center gap-2 rounded-full border border-surface-dim bg-surface-container-low px-3.5 py-2 text-outline transition-colors focus-within:border-secondary lg:flex"
          >
            <svg viewBox="0 0 20 20" width="16" height="16" fill="none" aria-hidden="true">
              <circle cx="9" cy="9" r="6.5" stroke="currentColor" strokeWidth="1.5" />
              <path d="m18 18-4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <input
              id="course-search"
              type="text"
              placeholder="Search courses..."
              className="w-full border-none bg-transparent text-sm text-on-surface outline-none placeholder:text-outline"
            />
          </label>

          <a href="#login" className="whitespace-nowrap px-1 py-2 text-[15px] font-semibold text-on-surface max-lg:hidden">
            Log In
          </a>
          <a
            href="#signup"
            className="whitespace-nowrap rounded-full bg-secondary px-5 py-2.5 text-[15px] font-semibold text-white transition-colors hover:bg-secondary-hover max-lg:hidden"
          >
            Sign Up
          </a>

          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            className="flex h-10 w-10 items-center justify-center rounded-lg text-on-surface lg:hidden"
          >
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" aria-hidden="true">
              <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
            className="absolute inset-0 bg-black/40"
          />
          <div className="absolute top-0 right-0 flex h-full w-[min(80vw,320px)] flex-col gap-6 bg-surface-container-lowest px-6 py-6 shadow-[var(--shadow-card-lg)]">
            <div className="flex items-center justify-between">
              <Logo />
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
                className="flex h-10 w-10 items-center justify-center rounded-lg text-on-surface"
              >
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" aria-hidden="true">
                  <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            <nav className="flex flex-col gap-1" aria-label="Primary">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={
                    pathname === link.href
                      ? 'rounded-lg bg-surface-container-low px-3 py-2.5 text-[15px] font-semibold text-secondary'
                      : 'rounded-lg px-3 py-2.5 text-[15px] font-medium text-on-surface-variant'
                  }
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="mt-auto flex flex-col gap-3">
              <a
                href="#login"
                className="rounded-lg border border-surface-dim px-5 py-3 text-center text-[15px] font-semibold text-on-surface"
              >
                Log In
              </a>
              <a
                href="#signup"
                className="rounded-lg bg-secondary px-5 py-3 text-center text-[15px] font-semibold text-white"
              >
                Sign Up
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

export default Navbar
