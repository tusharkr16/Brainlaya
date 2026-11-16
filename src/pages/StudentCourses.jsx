import { Link } from 'react-router-dom'
import DashboardShell from '../components/DashboardShell'
import { useMyEnrollments } from '../api/enrollments'
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

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor">
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="m5 12 5 5L20 7" />
    </svg>
  )
}

function StudentCourses() {
  const { data, isPending, isError, error, refetch } = useMyEnrollments()
  const enrollments = data?.data || []

  const completed = enrollments.filter((e) => e.progress === 100)
  const inProgress = enrollments.filter((e) => e.progress > 0 && e.progress < 100)
  const notStarted = enrollments.filter((e) => e.progress === 0)

  return (
    <DashboardShell active="My Learning">
      <div className="mb-7 flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-extrabold text-on-surface">My Learning</h1>
          <p className="mt-1 text-on-surface-variant text-sm">Track progress across all your enrolled courses.</p>
        </div>
        <Link
          to="/courses"
          className="rounded-xl bg-secondary px-5 py-2.5 text-sm font-bold text-white hover:bg-secondary-hover transition-colors"
        >
          + Explore Courses
        </Link>
      </div>

      {isPending && <LoadingState />}
      {isError && <ErrorState message={error.message} onRetry={refetch} />}

      {!isPending && !isError && (
        enrollments.length === 0 ? (
          <EmptyState
            title="You haven't enrolled in anything yet"
            description="Browse the course catalog and start your first lesson today."
            action={
              <Link to="/courses" className="rounded-xl bg-secondary px-5 py-2.5 text-sm font-bold text-white hover:bg-secondary-hover">
                Browse Courses
              </Link>
            }
          />
        ) : (
          <>
            {/* Summary pills */}
            <div className="mb-7 flex flex-wrap gap-3 text-sm">
              <span className="rounded-full border border-surface-dim bg-surface-container-lowest px-4 py-1.5 font-semibold text-on-surface">
                All ({enrollments.length})
              </span>
              {inProgress.length > 0 && (
                <span className="rounded-full bg-blue-50 px-4 py-1.5 font-semibold text-blue-700">
                  In Progress ({inProgress.length})
                </span>
              )}
              {completed.length > 0 && (
                <span className="rounded-full bg-green-50 px-4 py-1.5 font-semibold text-green-700">
                  Completed ({completed.length})
                </span>
              )}
              {notStarted.length > 0 && (
                <span className="rounded-full bg-gray-50 px-4 py-1.5 font-semibold text-on-surface-variant">
                  Not Started ({notStarted.length})
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {enrollments.map((e) => {
                const isDone = e.progress === 100
                const isNew = e.progress === 0
                return (
                  <Link
                    key={e.enrollmentId}
                    to={`/student/courses/${e.course._id}`}
                    className="group flex flex-col overflow-hidden rounded-2xl border border-surface-dim bg-surface-container-lowest transition-all hover:-translate-y-1 hover:shadow-lg"
                    style={{ textDecoration: 'none' }}
                  >
                    {/* Thumbnail */}
                    <div className="relative h-40 overflow-hidden" style={{ background: thumbGrad(e.course._id) }}>
                      {e.course.thumbnail && (
                        <img src={`${IMG_BASE}${e.course.thumbnail}`} alt="" className="h-full w-full object-cover" />
                      )}
                      {/* Status badge */}
                      <div className="absolute top-3 right-3">
                        {isDone ? (
                          <span className="flex items-center gap-1 rounded-full bg-green-500 px-2.5 py-1 text-xs font-bold text-white shadow">
                            <CheckIcon /> Done
                          </span>
                        ) : isNew ? (
                          <span className="rounded-full bg-blue-600 px-2.5 py-1 text-xs font-bold text-white shadow">
                            New
                          </span>
                        ) : null}
                      </div>
                    </div>

                    <div className="flex flex-1 flex-col p-5">
                      <p className="text-xs font-bold text-secondary uppercase tracking-wide">{e.course.category}</p>
                      <h3 className="mt-1 font-bold text-on-surface leading-snug line-clamp-2 group-hover:text-secondary transition-colors">
                        {e.course.title}
                      </h3>

                      {/* Progress */}
                      <div className="mt-auto pt-4">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-xs text-on-surface-variant">Progress</span>
                          <span className="text-xs font-bold" style={{ color: isDone ? '#16a34a' : '#2563eb' }}>
                            {e.progress}%
                          </span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-surface-container-high">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{
                              width: `${e.progress}%`,
                              background: isDone ? '#16a34a' : 'linear-gradient(90deg, #2563eb, #60a5fa)',
                            }}
                          />
                        </div>

                        <div className="mt-3 flex items-center justify-between">
                          <span className="text-xs text-on-surface-variant">
                            Enrolled {new Date(e.enrolledAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                          </span>
                          <span className="flex items-center gap-1.5 rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-600">
                            <PlayIcon />
                            {isNew ? 'Start' : isDone ? 'Review' : 'Resume'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </>
        )
      )}
    </DashboardShell>
  )
}

export default StudentCourses
