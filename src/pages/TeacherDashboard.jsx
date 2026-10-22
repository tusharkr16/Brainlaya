import { Link } from 'react-router-dom'
import DashboardShell from '../components/DashboardShell'
import { useMyCourses } from '../api/courses'
import { useAuthStore } from '../store/authStore'
import { useNotificationStore } from '../store/notificationStore'
import { LoadingState, ErrorState } from '../components/StateViews'
import { STATUS_BADGE } from '../lib/constants'

function PlusIcon() {
  return (
    <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 4v12M4 10h12" />
    </svg>
  )
}

function BookOpenIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 6.5c-1.8-1.3-4.2-2-6.5-2A2 2 0 0 0 3.5 6.5v11c0 .8.6 1.3 1.4 1.1 2-.4 4.3.1 6 1.4V6.5Z" />
      <path d="M12 6.5c1.8-1.3 4.2-2 6.5-2a2 2 0 0 1 2 2v11c0 .8-.6 1.3-1.4 1.1-2-.4-4.3.1-6 1.4V6.5Z" />
    </svg>
  )
}

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
  { bg: '#9b7fff', text: 'text-white', sub: 'text-white/80', chip: 'bg-white/25 text-white' },
]

function StatTile({ style, label, value, note }) {
  return (
    <div className="flex min-w-[200px] flex-1 flex-col justify-between rounded-2xl p-5" style={{ background: style.bg }}>
      <div className="flex items-start justify-between">
        <p className={`text-sm font-semibold ${style.sub}`}>{label}</p>
        <span className={`flex h-7 w-7 items-center justify-center rounded-full ${style.chip}`}>
          <DotsIcon />
        </span>
      </div>
      <p className={`mt-4 text-[32px] leading-none font-extrabold ${style.text}`}>{value}</p>
      {note && <p className={`mt-3 text-xs font-semibold ${style.sub}`}>{note}</p>}
    </div>
  )
}

function TeacherDashboard() {
  const user = useAuthStore((s) => s.user)
  const { data, isPending, isError, error, refetch } = useMyCourses()
  const notifications = useNotificationStore((s) => s.items)

  const courses = data?.data || []
  const totalStudents = courses.reduce((sum, c) => sum + (c.enrollmentCount || 0), 0)
  const totalViews = courses.reduce((sum, c) => sum + (c.views || 0), 0)
  const pendingCount = courses.filter((c) => c.status === 'pending_approval').length
  const recentCourses = [...courses].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)).slice(0, 5)

  return (
    <DashboardShell active="Dashboard">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-on-surface">Welcome back, {user?.name?.split(' ')[0]}</h1>
          <p className="mt-1 text-on-surface-variant">Here&apos;s what&apos;s happening with your courses today.</p>
        </div>
        <Link
          to="/teacher/courses/new"
          className="flex items-center gap-2 rounded-xl bg-secondary px-5 py-3 text-sm font-bold text-white shadow-[var(--shadow-card-md)] transition-colors hover:bg-secondary-hover"
        >
          <PlusIcon />
          Create New Course
        </Link>
      </div>

      {isPending && <LoadingState label="Loading your dashboard…" />}
      {isError && <ErrorState message={error.message} onRetry={refetch} />}

      {!isPending && !isError && (
        <>
          <div className="mb-10 flex flex-wrap gap-5">
            <StatTile style={TILE_STYLES[0]} label="Total Students" value={totalStudents.toLocaleString()} />
            <StatTile style={TILE_STYLES[1]} label="Courses" value={courses.length} note="All statuses" />
            <StatTile style={TILE_STYLES[2]} label="Pending Review" value={pendingCount} />
            <StatTile style={TILE_STYLES[3]} label="Total Views" value={totalViews.toLocaleString()} />
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="overflow-hidden rounded-2xl border border-surface-dim lg:col-span-2">
              <div className="flex items-center justify-between border-b border-surface-dim p-6">
                <h2 className="text-xl font-bold text-on-surface">Recent Courses</h2>
                <Link to="/teacher/courses" className="text-sm font-semibold text-secondary hover:underline">
                  View All
                </Link>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-surface-container-low text-xs font-semibold tracking-wide text-on-surface-variant uppercase">
                    <tr>
                      <th className="px-6 py-3">Course Name</th>
                      <th className="px-6 py-3">Students</th>
                      <th className="px-6 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-dim">
                    {recentCourses.map((course) => {
                      const badge = STATUS_BADGE[course.status]
                      return (
                        <tr key={course._id} className="group cursor-pointer transition-colors hover:bg-surface-container-low">
                          <td className="px-6 py-4">
                            <Link to={`/teacher/courses/${course._id}`} className="flex items-center gap-3">
                              {course.thumbnail ? (
                                <img
                                  src={`${import.meta.env.VITE_SOCKET_URL || 'http://localhost:5001'}${course.thumbnail}`}
                                  alt=""
                                  className="h-12 w-12 rounded-lg object-cover"
                                />
                              ) : (
                                <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent-design text-secondary">
                                  <BookOpenIcon />
                                </span>
                              )}
                              <div>
                                <p className="font-semibold text-on-surface">{course.title}</p>
                                <p className="text-xs text-on-surface-variant">{course.category}</p>
                              </div>
                            </Link>
                          </td>
                          <td className="px-6 py-4 text-sm font-medium text-on-surface">{(course.enrollmentCount || 0).toLocaleString()}</td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${badge.className}`}>{badge.label}</span>
                          </td>
                        </tr>
                      )
                    })}
                    {recentCourses.length === 0 && (
                      <tr>
                        <td colSpan={3} className="px-6 py-10 text-center text-sm text-on-surface-variant">
                          No courses yet. Create your first course to get started.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
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

export default TeacherDashboard
