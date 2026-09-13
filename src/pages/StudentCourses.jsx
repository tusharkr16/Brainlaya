import { Link } from 'react-router-dom'
import DashboardShell from '../components/DashboardShell'
import { useMyEnrollments } from '../api/enrollments'
import { LoadingState, ErrorState, EmptyState } from '../components/StateViews'

const IMG_BASE = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5001'

function StudentCourses() {
  const { data, isPending, isError, error, refetch } = useMyEnrollments()
  const enrollments = data?.data || []

  return (
    <DashboardShell active="My Learning">
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-on-surface">My Learning</h1>
        <p className="mt-1 text-on-surface-variant">Every course you're currently enrolled in.</p>
      </div>

      {isPending && <LoadingState />}
      {isError && <ErrorState message={error.message} onRetry={refetch} />}

      {!isPending && !isError && (
        enrollments.length === 0 ? (
          <EmptyState
            title="You haven't enrolled in anything yet"
            action={
              <Link to="/courses" className="rounded-lg bg-secondary px-4 py-2 text-sm font-bold text-white hover:bg-secondary-hover">
                Browse Courses
              </Link>
            }
          />
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {enrollments.map((e) => (
              <Link
                key={e.enrollmentId}
                to={`/student/courses/${e.course._id}`}
                className="overflow-hidden rounded-2xl border border-surface-dim bg-surface-container-lowest shadow-[var(--shadow-card-sm)] transition-shadow hover:shadow-[var(--shadow-card-md)]"
              >
                <div className="h-36 bg-accent-design">
                  {e.course.thumbnail && <img src={`${IMG_BASE}${e.course.thumbnail}`} alt="" className="h-full w-full object-cover" />}
                </div>
                <div className="p-5">
                  <p className="text-xs font-bold tracking-wide text-secondary uppercase">{e.course.category}</p>
                  <h3 className="mt-1 line-clamp-2 text-lg font-bold text-on-surface">{e.course.title}</h3>
                  <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-surface-container-high">
                    <div className="h-full rounded-full bg-secondary" style={{ width: `${e.progress}%` }} />
                  </div>
                  <p className="mt-2 text-xs text-on-surface-variant">{e.progress}% complete</p>
                </div>
              </Link>
            ))}
          </div>
        )
      )}
    </DashboardShell>
  )
}

export default StudentCourses
