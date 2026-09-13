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

function UsersIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="8" r="3.2" />
      <path d="M3.5 19c.6-3.2 3-5 5.5-5s4.9 1.8 5.5 5" />
      <circle cx="17" cy="9" r="2.6" />
      <path d="M15.2 14.3c1.9.4 3.4 1.9 3.8 4.2" />
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

function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" />
    </svg>
  )
}

function EyeIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12c1.8-4 5.8-7 10-7s8.2 3 10 7c-1.8 4-5.8 7-10 7s-8.2-3-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

function StatCard({ icon: Icon, label, value, note }) {
  return (
    <div className="rounded-2xl border border-surface-dim bg-surface-container-lowest p-5 shadow-[var(--shadow-card-sm)] transition-shadow hover:shadow-[var(--shadow-card-md)]">
      <div className="mb-4 flex items-center justify-between">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-design text-secondary">
          <Icon />
        </span>
        {note && <span className="text-xs font-semibold text-on-surface-variant">{note}</span>}
      </div>
      <p className="text-sm text-on-surface-variant">{label}</p>
      <p className="mt-1 text-2xl font-extrabold text-on-surface">{value}</p>
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
          <div className="mb-10 grid grid-cols-2 gap-5 lg:grid-cols-4">
            <StatCard icon={UsersIcon} label="Total Students" value={totalStudents.toLocaleString()} />
            <StatCard icon={BookOpenIcon} label="Courses" value={courses.length} note="All statuses" />
            <StatCard icon={ClockIcon} label="Pending Review" value={pendingCount} />
            <StatCard icon={EyeIcon} label="Total Views" value={totalViews.toLocaleString()} />
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="overflow-hidden rounded-2xl border border-surface-dim bg-surface-container-lowest lg:col-span-2">
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

export default TeacherDashboard
