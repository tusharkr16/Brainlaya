import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { authApi } from '../lib/authApi'
import { disconnectSocket } from '../lib/socket'
import NotificationBell from './NotificationBell'
import logo from '../assets/logo.png'

function DashboardIcon() {
  return (
    <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3.5" y="3.5" width="7.5" height="7.5" rx="1.5" />
      <rect x="13" y="3.5" width="7.5" height="7.5" rx="1.5" />
      <rect x="3.5" y="13" width="7.5" height="7.5" rx="1.5" />
      <rect x="13" y="13" width="7.5" height="7.5" rx="1.5" />
    </svg>
  )
}

function SchoolIcon() {
  return (
    <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 8.5 12 4l10 4.5-10 4.5-10-4.5Z" />
      <path d="M6 10.8v4.7c0 1.4 2.7 2.5 6 2.5s6-1.1 6-2.5v-4.7" />
    </svg>
  )
}

function CompassIcon() {
  return (
    <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="m15.5 8.5-2 5-5 2 2-5 5-2Z" />
    </svg>
  )
}

function ClipboardCheckIcon() {
  return (
    <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="4.5" width="14" height="17" rx="2" />
      <path d="M9 4V3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1" />
      <path d="m9 13 2 2 4-4" />
    </svg>
  )
}

function UsersCogIcon() {
  return (
    <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="8" r="3.2" />
      <path d="M3.5 19c.6-3.2 3-5 5.5-5s4.9 1.8 5.5 5" />
      <circle cx="18" cy="8" r="2.2" />
      <path d="M15.7 4.2v1M15.7 10.8v1M18.9 6.3l.9-.5M12.5 9.7l.9-.5M12.5 6.3l.9.5M18.9 9.7l.9.5" />
    </svg>
  )
}

function HistoryIcon() {
  return (
    <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12a9 9 0 1 0 3-6.7" />
      <path d="M3 4v4.5h4.5" />
      <path d="M12 8v4.5l3 2" />
    </svg>
  )
}

function ProfileIcon() {
  return (
    <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="10" r="3" />
      <path d="M6 18.5c1.2-2.2 3.4-3.5 6-3.5s4.8 1.3 6 3.5" />
    </svg>
  )
}

function LogoutIcon() {
  return (
    <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <path d="M16 17l5-5-5-5M21 12H9" />
    </svg>
  )
}

function SettingsIcon() {
  return (
    <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z" />
    </svg>
  )
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3.5" y="5" width="17" height="15.5" rx="2" />
      <path d="M3.5 9.5h17M8 3v3.5M16 3v3.5" />
    </svg>
  )
}

function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="m6 6 12 12M18 6 6 18" />
    </svg>
  )
}

const NAV_BY_ROLE = {
  teacher: [
    { label: 'Dashboard', icon: DashboardIcon, to: '/teacher' },
    { label: 'My Courses', icon: SchoolIcon, to: '/teacher/courses' },
    { label: 'Profile', icon: ProfileIcon, to: '/teacher/profile' },
  ],
  student: [
    { label: 'Dashboard', icon: DashboardIcon, to: '/student' },
    { label: 'Browse Courses', icon: CompassIcon, to: '/courses' },
    { label: 'My Learning', icon: SchoolIcon, to: '/student/courses' },
    { label: 'Profile', icon: ProfileIcon, to: '/student/profile' },
  ],
  admin: [
    { label: 'Dashboard', icon: DashboardIcon, to: '/admin' },
    { label: 'Schedule', icon: CalendarIcon, to: '/admin/schedule' },
    { label: 'Approval Queue', icon: ClipboardCheckIcon, to: '/admin/courses/pending' },
    { label: 'All Courses', icon: SchoolIcon, to: '/admin/courses' },
    { label: 'Users', icon: UsersCogIcon, to: '/admin/users' },
    { label: 'Audit Log', icon: HistoryIcon, to: '/admin/audit-log' },
  ],
}

const ROLE_LABEL = { teacher: 'Instructor', student: 'Student', admin: 'Administrator' }

function DashboardShell({ active, children }) {
  const user = useAuthStore((s) => s.user)
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  if (!user) return null

  const navItems = NAV_BY_ROLE[user.role] || []

  const handleLogout = async () => {
    try {
      await authApi.logout()
    } finally {
      disconnectSocket()
      useAuthStore.getState().clear()
      navigate('/login')
    }
  }

  return (
    <div className="h-screen bg-white max-lg:h-auto max-lg:min-h-screen">
      <div className="flex h-full gap-0 max-lg:h-auto max-lg:flex-col lg:flex">
        <aside className="flex w-64 shrink-0 flex-col gap-6 overflow-y-auto border-r border-surface-dim/70 p-5 max-lg:w-full max-lg:flex-row max-lg:items-center max-lg:justify-between max-lg:overflow-visible max-lg:border-r-0 max-lg:border-b">
          <Link to="/" className="flex items-center gap-2.5 text-lg font-extrabold tracking-tight text-on-surface">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white p-1 shadow-[0_6px_16px_rgba(30,41,59,0.12)]">
              <img src={logo} alt="Brainlaya" className="h-full w-full object-contain" />
            </span>
            <span className="max-lg:hidden">Brainlaya</span>
          </Link>

          <nav className="flex flex-1 flex-col gap-1 max-lg:hidden">
            {navItems.map((item) => {
              const isActive = item.label === active
              const className = isActive
                ? 'flex items-center gap-3 rounded-xl bg-[#eaf1ff] px-4 py-2.5 font-semibold text-secondary'
                : 'flex items-center gap-3 rounded-xl px-4 py-2.5 text-on-surface-variant transition-colors hover:bg-surface-container-low'
              return (
                <Link key={item.label} to={item.to} className={className}>
                  <item.icon />
                  <span className="text-[13.5px]">{item.label}</span>
                </Link>
              )
            })}
          </nav>

          <div className="rounded-2xl bg-[#fff3e0] p-4 max-lg:hidden">
            <p className="mb-1 flex items-center gap-1.5 text-sm font-bold text-on-surface">
              <SettingsIcon />
              Settings
            </p>
            <p className="text-xs leading-relaxed text-on-surface-variant">
              Signed in as <span className="font-semibold text-on-surface">{user.name}</span>
            </p>
          </div>

          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            className="rounded-lg p-2 text-on-surface-variant transition-colors hover:bg-surface-container-low lg:hidden"
          >
            <MenuIcon />
          </button>
        </aside>

        {menuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-black/40" onClick={() => setMenuOpen(false)} />
            <div className="absolute top-0 left-0 flex h-full w-72 flex-col gap-6 bg-white p-5 shadow-[var(--shadow-card-lg)]">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2.5 text-lg font-extrabold tracking-tight text-on-surface">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white p-1 shadow-[0_6px_16px_rgba(30,41,59,0.12)]">
                    <img src={logo} alt="Brainlaya" className="h-full w-full object-contain" />
                  </span>
                  Brainlaya
                </span>
                <button
                  type="button"
                  onClick={() => setMenuOpen(false)}
                  aria-label="Close menu"
                  className="rounded-lg p-2 text-on-surface-variant hover:bg-surface-container-low"
                >
                  <CloseIcon />
                </button>
              </div>

              <nav className="flex flex-1 flex-col gap-1">
                {navItems.map((item) => {
                  const isActive = item.label === active
                  const className = isActive
                    ? 'flex items-center gap-3 rounded-xl bg-[#eaf1ff] px-4 py-3 font-semibold text-secondary'
                    : 'flex items-center gap-3 rounded-xl px-4 py-3 text-on-surface-variant transition-colors hover:bg-surface-container-low'
                  return (
                    <Link key={item.label} to={item.to} className={className} onClick={() => setMenuOpen(false)}>
                      <item.icon />
                      <span className="text-sm">{item.label}</span>
                    </Link>
                  )
                })}
              </nav>
            </div>
          </div>
        )}

        <div className="flex flex-1 flex-col overflow-hidden">
          <header className="flex items-center justify-between gap-4 border-b border-surface-dim/70 px-6 py-4 max-lg:px-4">
            <p className="text-xl font-extrabold text-on-surface max-sm:hidden">{active}</p>
            <div className="ml-auto flex items-center gap-3">
              <NotificationBell />
              <div className="flex items-center gap-2.5 border-l border-surface-dim/70 pl-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#eaf1ff] text-sm font-bold text-secondary">
                  {user.name?.[0]?.toUpperCase()}
                </span>
                <div className="hidden leading-tight md:block">
                  <p className="text-sm font-semibold text-on-surface">{user.name}</p>
                  <p className="text-[11px] text-on-surface-variant">{ROLE_LABEL[user.role]}</p>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  aria-label="Log out"
                  className="rounded-lg p-2 text-on-surface-variant transition-colors hover:bg-error/10 hover:text-error"
                >
                  <LogoutIcon />
                </button>
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto p-6 max-lg:p-4">{children}</main>
        </div>
      </div>
    </div>
  )
}

export default DashboardShell
