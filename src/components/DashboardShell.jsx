import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { authApi } from '../lib/authApi'
import { disconnectSocket } from '../lib/socket'
import NotificationBell from './NotificationBell'

function DashboardIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3.5" y="3.5" width="7.5" height="7.5" rx="1.5" />
      <rect x="13" y="3.5" width="7.5" height="7.5" rx="1.5" />
      <rect x="3.5" y="13" width="7.5" height="7.5" rx="1.5" />
      <rect x="13" y="13" width="7.5" height="7.5" rx="1.5" />
    </svg>
  )
}

function SchoolIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 8.5 12 4l10 4.5-10 4.5-10-4.5Z" />
      <path d="M6 10.8v4.7c0 1.4 2.7 2.5 6 2.5s6-1.1 6-2.5v-4.7" />
    </svg>
  )
}

function CompassIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="m15.5 8.5-2 5-5 2 2-5 5-2Z" />
    </svg>
  )
}

function ClipboardCheckIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="4.5" width="14" height="17" rx="2" />
      <path d="M9 4V3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1" />
      <path d="m9 13 2 2 4-4" />
    </svg>
  )
}

function UsersCogIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="8" r="3.2" />
      <path d="M3.5 19c.6-3.2 3-5 5.5-5s4.9 1.8 5.5 5" />
      <circle cx="18" cy="8" r="2.2" />
      <path d="M15.7 4.2v1M15.7 10.8v1M18.9 6.3l.9-.5M12.5 9.7l.9-.5M12.5 6.3l.9.5M18.9 9.7l.9.5" />
    </svg>
  )
}

function HistoryIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12a9 9 0 1 0 3-6.7" />
      <path d="M3 4v4.5h4.5" />
      <path d="M12 8v4.5l3 2" />
    </svg>
  )
}

function ProfileIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="10" r="3" />
      <path d="M6 18.5c1.2-2.2 3.4-3.5 6-3.5s4.8 1.3 6 3.5" />
    </svg>
  )
}

function LogoutIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <path d="M16 17l5-5-5-5M21 12H9" />
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
    <div className="min-h-screen bg-surface">
      <header className="fixed inset-x-0 top-0 z-40 h-20 border-b border-surface-dim bg-surface-container-lowest">
        <div className="mx-auto flex h-full max-w-[1440px] items-center justify-between gap-6 px-8 max-lg:px-5">
          <Link to="/" className="flex items-center gap-2.5 text-xl font-extrabold text-secondary">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-surface-dim bg-white">
              <svg viewBox="0 0 24 24" width="18" height="18">
                <rect x="2" y="2" width="9" height="9" rx="2.5" fill="#f97316" />
                <rect x="13" y="2" width="9" height="9" rx="2.5" fill="#2563eb" />
                <rect x="2" y="13" width="9" height="9" rx="2.5" fill="#1d4e43" />
                <rect x="13" y="13" width="9" height="9" rx="2.5" fill="#d9f99d" />
              </svg>
            </span>
            Brainlaya
          </Link>

          <div className="flex items-center gap-3">
            <NotificationBell />
            <div className="flex items-center gap-3 border-l border-surface-dim pl-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-surface-container-high bg-accent-design text-sm font-bold text-secondary">
                {user.name?.[0]?.toUpperCase()}
              </span>
              <div className="hidden leading-tight lg:block">
                <p className="text-sm font-semibold text-on-surface">{user.name}</p>
                <p className="text-[11px] text-on-surface-variant">{ROLE_LABEL[user.role]}</p>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                aria-label="Log out"
                className="rounded-lg p-2 text-on-surface-variant transition-colors hover:bg-surface-container-low hover:text-error"
              >
                <LogoutIcon />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex pt-20">
        <aside className="fixed top-20 bottom-0 left-0 hidden w-64 flex-col border-r border-surface-dim bg-surface p-4 lg:flex">
          <nav className="flex-1 space-y-1">
            {navItems.map((item) => {
              const isActive = item.label === active
              const className = isActive
                ? 'flex items-center gap-3 rounded-lg bg-secondary px-4 py-3 font-semibold text-white'
                : 'flex items-center gap-3 rounded-lg px-4 py-3 text-on-surface-variant transition-colors hover:bg-surface-container-low'
              return (
                <Link key={item.label} to={item.to} className={className}>
                  <item.icon />
                  <span className="text-sm">{item.label}</span>
                </Link>
              )
            })}
          </nav>
        </aside>

        <main className="flex-1 px-6 py-8 max-lg:px-5 lg:ml-64 lg:px-10">
          <div className="mx-auto max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  )
}

export default DashboardShell
