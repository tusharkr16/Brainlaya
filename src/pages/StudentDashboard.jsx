import { Link } from 'react-router-dom'
import DashboardShell from '../components/DashboardShell'
import { useMyEnrollments } from '../api/enrollments'
import { useAuthStore } from '../store/authStore'
import { useNotificationStore } from '../store/notificationStore'
import { LoadingState, ErrorState, EmptyState } from '../components/StateViews'

const IMG_BASE = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5001'

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
          <div className="mb-10 grid grid-cols-2 gap-5 lg:grid-cols-3">
            <div className="rounded-2xl border border-surface-dim bg-surface-container-lowest p-5">
              <p className="text-sm text-on-surface-variant">Enrolled Courses</p>
              <p className="mt-1 text-2xl font-extrabold text-on-surface">{enrollments.length}</p>
            </div>
            <div className="rounded-2xl border border-surface-dim bg-surface-container-lowest p-5">
              <p className="text-sm text-on-surface-variant">Average Progress</p>
              <p className="mt-1 text-2xl font-extrabold text-on-surface">{avgProgress}%</p>
            </div>
            <div className="rounded-2xl border border-surface-dim bg-surface-container-lowest p-5">
              <p className="text-sm text-on-surface-variant">Completed</p>
              <p className="mt-1 text-2xl font-extrabold text-on-surface">{enrollments.filter((e) => e.progress === 100).length}</p>
            </div>
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

            <div className="rounded-2xl border border-surface-dim bg-surface-container-lowest">
              <div className="border-b border-surface-dim p-6">
                <h2 className="text-xl font-bold text-on-surface">Recent Activity</h2>
              </div>
              <div className="flex flex-col divide-y divide-surface-dim">
                {notifications.slice(0, 6).map((n) => (
                  <div key={n._id} className="p-5">
                    <p className="text-sm text-on-surface">{n.message}</p>
                    <span className="mt-1 block text-xs text-on-surface-variant">{new Date(n.createdAt).toLocaleString()}</span>
                  </div>
                ))}
                {notifications.length === 0 && <p className="p-6 text-center text-sm text-on-surface-variant">No activity yet.</p>}
              </div>
            </div>
          </div>
        </>
      )}
    </DashboardShell>
  )
}

export default StudentDashboard
