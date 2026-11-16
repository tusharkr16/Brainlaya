import { Link } from 'react-router-dom'
import DashboardShell from '../components/DashboardShell'
import { useMyEnrollments, useUpcomingSessions } from '../api/enrollments'
import { useAuthStore } from '../store/authStore'
import { useNotificationStore } from '../store/notificationStore'
import { LoadingState, ErrorState, EmptyState } from '../components/StateViews'

const IMG_BASE = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5001'

const THUMB_GRADIENTS = [
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
]
function thumbGrad(id) {
  const i = id ? parseInt(id.slice(-2), 16) % THUMB_GRADIENTS.length : 0
  return THUMB_GRADIENTS[i]
}

/* ── Icons ── */
function DotsIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
      <circle cx="5" cy="12" r="1.6" /><circle cx="12" cy="12" r="1.6" /><circle cx="19" cy="12" r="1.6" />
    </svg>
  )
}
function TrendUpIcon() {
  return (
    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 15 10 9l4 4 6-6" /><path d="M14 6h6v6" />
    </svg>
  )
}
function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor">
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  )
}
function ArrowIcon() {
  return (
    <svg viewBox="0 0 20 20" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 10h12M11 5l5 5-5 5" />
    </svg>
  )
}
function BellIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  )
}
function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
    </svg>
  )
}
function CertIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="6" /><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
    </svg>
  )
}

/* ── Stat Tile (same pattern as AdminDashboard) ── */
const STAT_TILES = [
  { label: 'Enrolled',    bg: '#4facfe', text: 'text-white',       sub: 'text-white/80',    chip: 'bg-white/25 text-white' },
  { label: 'In Progress', bg: '#c4a6ff', text: 'text-[#2d1a6e]',  sub: 'text-[#2d1a6e]/70', chip: 'bg-black/10 text-[#2d1a6e]' },
  { label: 'Completed',   bg: '#9fe6c0', text: 'text-[#0a3d2b]',  sub: 'text-[#0a3d2b]/70', chip: 'bg-black/10 text-[#0a3d2b]' },
  { label: 'Avg Progress',bg: '#ffc94d', text: 'text-[#4a3400]',  sub: 'text-[#4a3400]/70', chip: 'bg-black/10 text-[#4a3400]' },
]

function StatTile({ tile, value, suffix = '' }) {
  return (
    <div className="flex min-w-[180px] flex-1 flex-col justify-between rounded-2xl p-5" style={{ background: tile.bg }}>
      <div className="flex items-start justify-between">
        <p className={`text-sm font-semibold ${tile.sub}`}>{tile.label}</p>
        <span className={`flex h-7 w-7 items-center justify-center rounded-full ${tile.chip}`}>
          <DotsIcon />
        </span>
      </div>
      <p className={`mt-4 text-[34px] leading-none font-extrabold ${tile.text}`}>
        {value}<span className="text-xl">{suffix}</span>
      </p>
      <div className="mt-4 flex items-center gap-2 text-xs font-semibold">
        <span className={tile.sub}>This week</span>
        <span className={`flex items-center gap-1 rounded-full px-2 py-0.5 ${tile.chip}`}>
          <TrendUpIcon /> Active
        </span>
      </div>
    </div>
  )
}

/* ── Notification type colours ── */
const NOTIF_COLORS = {
  new_lesson:           { bg: '#eff6ff', icon: '#2563eb' },
  enrollment_confirmed: { bg: '#f0fdf4', icon: '#16a34a' },
  course_announcement:  { bg: '#fefce8', icon: '#ca8a04' },
  default:              { bg: '#f5f3ff', icon: '#7c3aed' },
}

function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.round(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.round(mins / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.round(hours / 24)}d ago`
}

/* ── Main component ── */
function VideoIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="6" width="14" height="12" rx="2" /><path d="m22 8-6 4 6 4V8Z" />
    </svg>
  )
}
function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" />
    </svg>
  )
}

function StudentDashboard() {
  const user = useAuthStore((s) => s.user)
  const { data, isPending, isError, error, refetch } = useMyEnrollments()
  const { data: sessionsData } = useUpcomingSessions()
  const notifications = useNotificationStore((s) => s.items)

  const enrollments   = data?.data || []
  const upcomingSessions = sessionsData?.data || []
  const completed     = enrollments.filter((e) => e.progress === 100)
  const inProgress    = enrollments.filter((e) => e.progress > 0 && e.progress < 100)
  const avgProgress   = enrollments.length
    ? Math.round(enrollments.reduce((sum, e) => sum + e.progress, 0) / enrollments.length)
    : 0

  const firstName = user?.name?.split(' ')[0] || 'there'
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <DashboardShell active="Dashboard">

      {/* ── Welcome banner ── */}
      <div
        className="mb-8 overflow-hidden rounded-2xl px-8 py-7 text-white relative"
        style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #2563eb 100%)' }}
      >
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #60a5fa, transparent)' }} />
        <div className="pointer-events-none absolute right-32 bottom-0 h-32 w-32 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #818cf8, transparent)' }} />
        <p className="text-blue-300 text-xs font-semibold tracking-widest uppercase mb-1 relative z-10">Student Dashboard</p>
        <h1 className="text-2xl font-extrabold relative z-10">{greeting}, {firstName} 👋</h1>
        <p className="mt-1 text-blue-100 text-sm max-w-lg relative z-10">
          {enrollments.length === 0
            ? 'Start your learning journey — browse expert-led courses.'
            : `You have ${inProgress.length} course${inProgress.length !== 1 ? 's' : ''} in progress. Keep going!`}
        </p>
        {enrollments.length === 0 && (
          <Link
            to="/courses"
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-blue-700 hover:bg-blue-50 transition-colors relative z-10"
          >
            Browse Courses <ArrowIcon />
          </Link>
        )}
      </div>

      {isPending && <LoadingState />}
      {isError && <ErrorState message={error.message} onRetry={refetch} />}

      {!isPending && !isError && (
        <>
          {/* ── Stat tiles ── */}
          <div className="mb-8 flex flex-wrap gap-4">
            <StatTile tile={STAT_TILES[0]} value={enrollments.length} />
            <StatTile tile={STAT_TILES[1]} value={inProgress.length} />
            <StatTile tile={STAT_TILES[2]} value={completed.length} />
            <StatTile tile={STAT_TILES[3]} value={avgProgress} suffix="%" />
          </div>

          {/* ── Upcoming Live Classes ── */}
          {upcomingSessions.length > 0 && (
            <div className="mb-8 rounded-2xl border border-surface-dim bg-surface-container-lowest p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-bold text-on-surface">Upcoming Live Classes</h2>
                <Link to="/student/schedule" className="flex items-center gap-1 text-sm font-semibold text-secondary hover:underline">
                  View schedule <ArrowIcon />
                </Link>
              </div>
              <div className="flex flex-wrap gap-4">
                {upcomingSessions.slice(0, 3).map((s) => {
                  const dt = new Date(s.scheduledAt)
                  const now = Date.now()
                  const diffMs = dt.getTime() - now
                  const diffH = Math.floor(diffMs / 3600000)
                  const diffM = Math.floor((diffMs % 3600000) / 60000)
                  const timeLabel = diffH > 24 ? `in ${Math.floor(diffH / 24)}d` : diffH > 0 ? `in ${diffH}h ${diffM}m` : `in ${diffM}m`
                  return (
                    <div key={s._id} className="flex flex-1 min-w-[220px] items-start gap-3 rounded-xl border border-surface-dim bg-surface-container-low p-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-secondary">
                        <VideoIcon />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-on-surface text-sm leading-snug line-clamp-1">{s.title}</p>
                        <p className="mt-0.5 text-xs text-on-surface-variant line-clamp-1">{s.courseId?.title}</p>
                        <div className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-amber-700">
                          <ClockIcon />
                          <span>{dt.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} · {dt.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}</span>
                          <span className="rounded-full bg-amber-100 px-2 py-0.5">{timeLabel}</span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* ── Main grid ── */}
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_320px]">

            {/* Continue Learning */}
            <div className="rounded-2xl border border-surface-dim bg-surface-container-lowest p-6">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-lg font-bold text-on-surface">Continue Learning</h2>
                <Link to="/student/courses" className="flex items-center gap-1 text-sm font-semibold text-secondary hover:underline">
                  View all <ArrowIcon />
                </Link>
              </div>

              {enrollments.length === 0 ? (
                <EmptyState
                  title="No courses yet"
                  description="Browse the catalog and enroll in your first course."
                  action={
                    <Link to="/courses" className="rounded-xl bg-secondary px-5 py-2.5 text-sm font-bold text-white hover:bg-secondary-hover">
                      Browse Courses
                    </Link>
                  }
                />
              ) : (
                <div className="divide-y divide-surface-dim">
                  {enrollments.slice(0, 5).map((e) => (
                    <Link
                      key={e.enrollmentId}
                      to={`/student/courses/${e.course._id}`}
                      className="flex items-center gap-4 py-4 first:pt-0 last:pb-0 transition-colors hover:opacity-80"
                      style={{ textDecoration: 'none' }}
                    >
                      {/* Thumbnail */}
                      <div
                        className="h-14 w-20 shrink-0 overflow-hidden rounded-xl"
                        style={{ background: thumbGrad(e.course._id) }}
                      >
                        {e.course.thumbnail && (
                          <img src={`${IMG_BASE}${e.course.thumbnail}`} alt="" className="h-full w-full object-cover" />
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-on-surface text-sm leading-tight line-clamp-1">{e.course.title}</p>
                        <p className="text-xs text-on-surface-variant mt-0.5 mb-2">{e.course.category}</p>
                        <div className="flex items-center gap-2.5">
                          <div className="flex-1 h-1.5 overflow-hidden rounded-full bg-surface-container-high">
                            <div
                              className="h-full rounded-full transition-all"
                              style={{ width: `${e.progress}%`, background: e.progress === 100 ? '#16a34a' : '#2563eb' }}
                            />
                          </div>
                          <span className="shrink-0 text-xs font-bold text-on-surface-variant w-8 text-right">{e.progress}%</span>
                        </div>
                      </div>

                      {/* CTA */}
                      <span className={`shrink-0 flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-colors ${
                        e.progress === 100
                          ? 'bg-green-50 text-green-700'
                          : 'bg-[#eaf1ff] text-secondary'
                      }`}>
                        <PlayIcon />
                        {e.progress === 0 ? 'Start' : e.progress === 100 ? 'Review' : 'Resume'}
                      </span>
                    </Link>
                  ))}
                </div>
              )}

              {enrollments.length > 0 && (
                <Link
                  to="/courses"
                  className="mt-5 flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-surface-dim px-5 py-3 text-sm font-semibold text-on-surface-variant hover:border-secondary hover:text-secondary transition-colors"
                >
                  + Browse more courses
                </Link>
              )}
            </div>

            {/* Right column */}
            <div className="flex flex-col gap-5">

              {/* Quick Actions */}
              <div className="rounded-2xl border border-surface-dim bg-surface-container-lowest p-5">
                <h2 className="mb-4 text-sm font-bold tracking-wide text-on-surface-variant uppercase">Quick Actions</h2>
                <div className="flex flex-col gap-2.5">
                  <Link
                    to="/courses"
                    className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-white transition-transform hover:-translate-y-0.5"
                    style={{ background: 'linear-gradient(135deg, #1e3a8a, #2563eb)', boxShadow: '0 8px 20px rgba(37,99,235,0.3)' }}
                  >
                    <SearchIcon /> Browse Courses
                  </Link>
                  <Link
                    to="/student/courses"
                    className="flex items-center gap-3 rounded-xl border border-surface-dim px-4 py-3 text-sm font-bold text-on-surface hover:bg-surface-container-low transition-colors"
                  >
                    <CertIcon /> My Certificates
                  </Link>
                </div>
              </div>

              {/* Activity / Notifications */}
              <div className="flex-1 rounded-2xl border border-surface-dim bg-surface-container-lowest p-5">
                <h2 className="mb-4 text-lg font-bold text-on-surface">Activity</h2>

                {notifications.length === 0 ? (
                  <div className="flex flex-col items-center py-8 text-center">
                    <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-surface-container text-2xl">🔔</span>
                    <p className="text-sm font-semibold text-on-surface">All caught up!</p>
                    <p className="text-xs text-on-surface-variant mt-1">Enroll in a course to see updates here.</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3.5">
                    {notifications.slice(0, 7).map((n) => {
                      const c = NOTIF_COLORS[n.type] || NOTIF_COLORS.default
                      return (
                        <div key={n._id} className="flex items-start gap-3">
                          <span
                            className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
                            style={{ background: c.bg, color: c.icon }}
                          >
                            <BellIcon />
                          </span>
                          <div className="min-w-0">
                            <p className="text-xs leading-snug text-on-surface">{n.message}</p>
                            <p className="mt-0.5 text-[11px] text-on-surface-variant">{timeAgo(n.createdAt)}</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>

          </div>
        </>
      )}
    </DashboardShell>
  )
}

export default StudentDashboard
