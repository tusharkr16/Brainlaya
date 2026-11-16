import { Link } from 'react-router-dom'
import DashboardShell from '../components/DashboardShell'
import { useUpcomingSessions } from '../api/enrollments'
import { LoadingState, ErrorState } from '../components/StateViews'

const IMG_BASE = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5001'

function VideoIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="6" width="14" height="12" rx="2" /><path d="m22 8-6 4 6 4V8Z" />
    </svg>
  )
}
function PlayIcon() {
  return <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3" /></svg>
}
function ExternalIcon() {
  return (
    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14 21 3" />
    </svg>
  )
}

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function groupByDate(sessions) {
  const groups = {}
  sessions.forEach((s) => {
    const d = new Date(s.scheduledAt)
    const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
    if (!groups[key]) groups[key] = { date: d, sessions: [] }
    groups[key].sessions.push(s)
  })
  return Object.values(groups).sort((a, b) => a.date - b.date)
}

function formatCountdown(ms) {
  if (ms <= 0) return 'Live now'
  const h = Math.floor(ms / 3600000)
  const m = Math.floor((ms % 3600000) / 60000)
  if (h >= 24) return `in ${Math.floor(h / 24)}d ${h % 24}h`
  if (h > 0) return `in ${h}h ${m}m`
  return `in ${m}m`
}

function StudentSchedule() {
  const { data, isPending, isError, error, refetch } = useUpcomingSessions()
  const sessions = data?.data || []
  const groups = groupByDate(sessions)

  return (
    <DashboardShell active="Schedule">
      <div className="mb-7">
        <h1 className="text-3xl font-extrabold text-on-surface">Schedule</h1>
        <p className="mt-1 text-sm text-on-surface-variant">Your upcoming live classes across all enrolled courses.</p>
      </div>

      {isPending && <LoadingState />}
      {isError && <ErrorState message={error.message} onRetry={refetch} />}

      {!isPending && !isError && (
        groups.length === 0 ? (
          <div className="flex flex-col items-center rounded-2xl border border-surface-dim bg-surface-container-lowest py-20 text-center">
            <span className="mb-4 text-5xl">📅</span>
            <p className="text-lg font-bold text-on-surface">No upcoming sessions</p>
            <p className="mt-2 max-w-xs text-sm text-on-surface-variant">
              When your teachers schedule live classes, they'll appear here with direct join links.
            </p>
            <Link
              to="/courses"
              className="mt-6 rounded-xl bg-secondary px-6 py-2.5 text-sm font-bold text-white hover:bg-secondary-hover transition-colors"
            >
              Explore Courses
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {groups.map((g) => {
              const today = new Date()
              const isToday = g.date.toDateString() === today.toDateString()
              const isTomorrow = g.date.toDateString() === new Date(today.getTime() + 86400000).toDateString()
              const label = isToday ? 'Today' : isTomorrow ? 'Tomorrow' : `${DAY_NAMES[g.date.getDay()]}, ${MONTH_NAMES[g.date.getMonth()]} ${g.date.getDate()}`

              return (
                <div key={g.date.toISOString()}>
                  {/* Date header */}
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex flex-col items-center rounded-xl border border-surface-dim bg-surface-container-lowest px-3 py-2 text-center w-14">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">{MONTH_NAMES[g.date.getMonth()]}</span>
                      <span className="text-2xl font-extrabold text-on-surface leading-none">{g.date.getDate()}</span>
                    </div>
                    <div>
                      <p className="font-bold text-on-surface text-lg">{label}</p>
                      <p className="text-xs text-on-surface-variant">{g.sessions.length} session{g.sessions.length !== 1 ? 's' : ''}</p>
                    </div>
                  </div>

                  <div className="space-y-3 ml-17">
                    {g.sessions.map((s) => {
                      const dt = new Date(s.scheduledAt)
                      const remaining = dt.getTime() - Date.now()
                      const isLive = remaining <= 0
                      const countdown = formatCountdown(remaining)
                      const course = s.courseId

                      return (
                        <div key={s._id} className="flex items-start gap-4 rounded-2xl border border-surface-dim bg-surface-container-lowest p-5 transition-all hover:border-secondary/40 hover:shadow-sm">
                          {/* Time column */}
                          <div className="w-16 shrink-0 text-center">
                            <p className="text-sm font-bold text-on-surface">{dt.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}</p>
                          </div>

                          {/* Icon */}
                          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${isLive ? 'bg-green-100 text-green-700' : 'bg-blue-50 text-secondary'}`}>
                            <VideoIcon />
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-3 flex-wrap">
                              <div className="min-w-0">
                                <p className="font-semibold text-on-surface leading-snug">{s.title}</p>
                                {course && (
                                  <p className="mt-0.5 text-xs text-on-surface-variant">{course.title} · {course.category}</p>
                                )}
                              </div>
                              <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${isLive ? 'bg-green-100 text-green-700' : 'bg-amber-50 text-amber-700 border border-amber-200'}`}>
                                {countdown}
                              </span>
                            </div>
                            <div className="mt-3">
                              {isLive ? (
                                <a href={s.meetingLink} target="_blank" rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold text-white transition-all hover:opacity-90"
                                  style={{ background: 'linear-gradient(135deg, #16a34a, #15803d)' }}>
                                  <PlayIcon /> Join Now <ExternalIcon />
                                </a>
                              ) : (
                                <button disabled
                                  className="inline-flex cursor-not-allowed items-center gap-1.5 rounded-xl border border-surface-dim bg-surface-container-low px-4 py-2 text-xs font-semibold text-on-surface-variant">
                                  <PlayIcon /> Join Session
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        )
      )}
    </DashboardShell>
  )
}

export default StudentSchedule
