import { Link } from 'react-router-dom'
import DashboardShell from '../components/DashboardShell'
import { useMyEnrollments } from '../api/enrollments'
import { useAuthStore } from '../store/authStore'
import { useNotificationStore } from '../store/notificationStore'
import { LoadingState, ErrorState, EmptyState } from '../components/StateViews'

const IMG_BASE = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5001'

function DotsIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
      <circle cx="5" cy="12" r="1.6" />
      <circle cx="12" cy="12" r="1.6" />
      <circle cx="19" cy="12" r="1.6" />
    </svg>
  )
}

const TILE_STYLES = [
  { bg: '#ff5da2', text: 'text-white', sub: 'text-white/80', chip: 'bg-white/25 text-white' },
  { bg: '#ffc94d', text: 'text-[#4a3400]', sub: 'text-[#4a3400]/70', chip: 'bg-black/10 text-[#4a3400]' },
  { bg: '#7fa8ff', text: 'text-white', sub: 'text-white/80', chip: 'bg-white/25 text-white' },
]

function StatTile({ style, label, value }) {
  return (
    <div className="flex min-w-[200px] flex-1 flex-col justify-between rounded-2xl p-5" style={{ background: style.bg }}>
      <div className="flex items-start justify-between">
        <p className={`text-sm font-semibold ${style.sub}`}>{label}</p>
        <span className={`flex h-7 w-7 items-center justify-center rounded-full ${style.chip}`}>
          <DotsIcon />
        </span>
      </div>
      <p className={`mt-4 text-[32px] leading-none font-extrabold ${style.text}`}>{value}</p>
    </div>
  )
}

function StudentDashboard() {
  const user = useAuthStore((s) => s.user)
  const { data, isPending, isError, error, refetch } = useMyEnrollments()
  const notifications = useNotificationStore((s) => s.items)

  const enrollments = data?.data || []
  const avgProgress = enrollments.length
    ? Math.round(enrollments.reduce((sum, e) => sum + e.progress, 0) / enrollments.length)
    : 0

  return (
    <DashboardShell active="Dashboard">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-on-surface">Welcome back, {user?.name?.split(' ')[0]}</h1>
        <p className="mt-1 text-on-surface-variant">Pick up where you left off.</p>
      </div>

      {isPending && <LoadingState />}
      {isError && <ErrorState message={error.message} onRetry={refetch} />}

      {!isPending && !isError && (
        <>
          <div className="mb-10 flex flex-wrap gap-5">
            <StatTile style={TILE_STYLES[0]} label="Enrolled Courses" value={enrollments.length} />
            <StatTile style={TILE_STYLES[1]} label="Average Progress" value={`${avgProgress}%`} />
            <StatTile style={TILE_STYLES[2]} label="Completed" value={enrollments.filter((e) => e.progress === 100).length} />
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-bold text-on-surface">Continue Learning</h2>
                <Link to="/courses" className="text-sm font-semibold text-secondary hover:underline">
                  Browse more courses
                </Link>
              </div>
              {enrollments.length === 0 ? (
                <EmptyState
                  title="No courses yet"
                  description="Browse the catalog and enroll in your first course."
                  action={
                    <Link to="/courses" className="rounded-lg bg-secondary px-4 py-2 text-sm font-bold text-white hover:bg-secondary-hover">
                      Browse Courses
                    </Link>
                  }
                />
              ) : (
                <div className="space-y-4">
                  {enrollments.map((e) => (
                    <Link
                      key={e.enrollmentId}
                      to={`/student/courses/${e.course._id}`}
                      className="flex items-center gap-4 rounded-xl border border-surface-dim bg-surface-container-lowest p-4 transition-shadow hover:shadow-[var(--shadow-card-md)]"
                    >
                      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-accent-design">
                        {e.course.thumbnail && <img src={`${IMG_BASE}${e.course.thumbnail}`} alt="" className="h-full w-full object-cover" />}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-on-surface">{e.course.title}</p>
                        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-surface-container-high">
                          <div className="h-full rounded-full bg-secondary" style={{ width: `${e.progress}%` }} />
                        </div>
                      </div>
                      <span className="shrink-0 text-sm font-semibold text-on-surface-variant">{e.progress}%</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-surface-dim p-5">
              <h2 className="mb-4 text-lg font-bold text-on-surface">Recent Activity</h2>
              <div className="flex flex-col gap-4">
                {notifications.slice(0, 6).map((n) => (
                  <div key={n._id} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#eaf1ff] text-xs font-bold text-secondary">
                      {user?.name?.[0]?.toUpperCase()}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm leading-snug text-on-surface">{n.message}</p>
                      <p className="text-xs text-on-surface-variant">{new Date(n.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
                {notifications.length === 0 && <p className="text-sm text-on-surface-variant">No activity yet.</p>}
              </div>
            </div>
          </div>
        </>
      )}
    </DashboardShell>
  )
}

export default StudentDashboard
