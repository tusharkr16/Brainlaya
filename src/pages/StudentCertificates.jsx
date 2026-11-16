import { Link } from 'react-router-dom'
import DashboardShell from '../components/DashboardShell'
import { useMyEnrollments } from '../api/enrollments'
import { LoadingState, ErrorState } from '../components/StateViews'

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

function AwardIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="6" />
      <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
    </svg>
  )
}
function DownloadIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  )
}

function StudentCertificates() {
  const { data, isPending, isError, error, refetch } = useMyEnrollments()
  const enrollments = data?.data || []
  const completed = enrollments.filter((e) => e.progress === 100)

  return (
    <DashboardShell active="Certificates">
      <div className="mb-7">
        <h1 className="text-3xl font-extrabold text-on-surface">Certificates</h1>
        <p className="mt-1 text-sm text-on-surface-variant">Your earned certificates for completed courses.</p>
      </div>

      {isPending && <LoadingState />}
      {isError && <ErrorState message={error.message} onRetry={refetch} />}

      {!isPending && !isError && (
        completed.length === 0 ? (
          <div className="flex flex-col items-center rounded-2xl border border-surface-dim bg-surface-container-lowest py-20 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-50 text-amber-500">
              <AwardIcon />
            </div>
            <p className="text-lg font-bold text-on-surface">No certificates yet</p>
            <p className="mt-2 max-w-xs text-sm text-on-surface-variant">
              Complete 100% of a course to earn your certificate. Keep learning!
            </p>
            <Link to="/student/courses" className="mt-6 rounded-xl bg-secondary px-6 py-2.5 text-sm font-bold text-white hover:bg-secondary-hover transition-colors">
              Continue Learning
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {completed.map((e) => (
              <div key={e.enrollmentId} className="group flex flex-col overflow-hidden rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-white shadow-sm">
                <div className="relative h-32 overflow-hidden" style={{ background: thumbGrad(e.course._id) }}>
                  {e.course.thumbnail && (
                    <img src={`${IMG_BASE}${e.course.thumbnail}`} alt="" className="h-full w-full object-cover opacity-60" />
                  )}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 text-amber-500 shadow-lg">
                      <AwardIcon />
                    </div>
                  </div>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <span className="text-xs font-bold uppercase tracking-widest text-amber-600">{e.course.category}</span>
                  <h3 className="mt-1 font-bold text-on-surface leading-snug line-clamp-2">{e.course.title}</h3>
                  <p className="mt-1 text-xs text-on-surface-variant">
                    Completed {new Date(e.enrolledAt).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
                  </p>
                  <div className="mt-auto pt-4 flex items-center gap-2">
                    <button
                      type="button"
                      title="Certificate download coming soon"
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold text-white hover:bg-amber-600 transition-colors"
                    >
                      <DownloadIcon /> Download Certificate
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </DashboardShell>
  )
}

export default StudentCertificates
