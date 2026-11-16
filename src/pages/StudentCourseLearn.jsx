import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import DashboardShell from '../components/DashboardShell'
import LessonPlayer from '../components/LessonPlayer'
import { useCourse } from '../api/courses'
import { useLessons } from '../api/lessons'
import { LoadingState } from '../components/StateViews'

function BookIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  )
}
function VideoIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="6" width="14" height="12" rx="2" /><path d="m22 8-6 4 6 4V8Z" />
    </svg>
  )
}
function ListIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" />
      <line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
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

const TABS = [
  { id: 'curriculum', label: 'Curriculum', icon: ListIcon },
  { id: 'live', label: 'Live Classes', icon: VideoIcon },
  { id: 'overview', label: 'Overview', icon: BookIcon },
]

function OverviewTab({ course }) {
  if (!course) return <LoadingState />
  const IMG_BASE = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5001'
  return (
    <div className="max-w-2xl space-y-6">
      {course.thumbnail && (
        <div className="overflow-hidden rounded-2xl">
          <img src={`${IMG_BASE}${course.thumbnail}`} alt={course.title} className="w-full object-cover max-h-56" />
        </div>
      )}
      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-secondary">{course.category}</span>
        <h2 className="mt-1 text-2xl font-extrabold text-on-surface">{course.title}</h2>
        {course.description && (
          <p className="mt-3 text-sm leading-relaxed text-on-surface-variant whitespace-pre-line">{course.description}</p>
        )}
      </div>
      {course.outcomes?.length > 0 && (
        <div className="rounded-2xl border border-surface-dim bg-surface-container-low p-5">
          <h3 className="mb-3 font-bold text-on-surface">What you'll learn</h3>
          <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {course.outcomes.map((o, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-on-surface-variant">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-700 text-[10px] font-bold">✓</span>
                {o}
              </li>
            ))}
          </ul>
        </div>
      )}
      {course.requirements?.length > 0 && (
        <div className="rounded-2xl border border-surface-dim p-5">
          <h3 className="mb-3 font-bold text-on-surface">Requirements</h3>
          <ul className="list-disc list-inside space-y-1 text-sm text-on-surface-variant">
            {course.requirements.map((r, i) => <li key={i}>{r}</li>)}
          </ul>
        </div>
      )}
    </div>
  )
}

function LiveClassesTab({ lessons }) {
  const liveLessons = lessons.filter((l) => l.meetingLink && l.scheduledAt)
  const always = lessons.filter((l) => l.meetingLink && !l.scheduledAt)
  if (liveLessons.length === 0 && always.length === 0) {
    return (
      <div className="flex flex-col items-center py-16 text-center">
        <span className="mb-3 text-4xl">📡</span>
        <p className="font-semibold text-on-surface">No live classes scheduled yet</p>
        <p className="mt-1 text-sm text-on-surface-variant">Your teacher will add live session details here.</p>
      </div>
    )
  }
  return (
    <div className="max-w-2xl space-y-4">
      {liveLessons.map((l) => {
        const dt = new Date(l.scheduledAt)
        const remaining = dt.getTime() - Date.now()
        const isLive = remaining <= 0
        return (
          <div key={l._id} className="flex items-start gap-4 rounded-2xl border border-surface-dim bg-surface-container-lowest p-5">
            <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${isLive ? 'bg-green-100 text-green-700' : 'bg-blue-50 text-secondary'}`}>
              <VideoIcon />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-on-surface">{l.title}</p>
              <p className="mt-0.5 text-xs text-on-surface-variant">
                {dt.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })} · {dt.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
              </p>
              <div className="mt-3">
                {isLive ? (
                  <a href={l.meetingLink} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold text-white"
                    style={{ background: 'linear-gradient(135deg, #16a34a, #15803d)' }}>
                    <PlayIcon /> Join Now <ExternalIcon />
                  </a>
                ) : (
                  <span className="inline-flex items-center gap-1.5 rounded-xl bg-amber-50 border border-amber-200 px-3 py-1.5 text-xs font-semibold text-amber-700">
                    Starts {remaining > 86400000 ? `in ${Math.floor(remaining / 86400000)}d` : remaining > 3600000 ? `in ${Math.floor(remaining / 3600000)}h` : `in ${Math.floor(remaining / 60000)}m`}
                  </span>
                )}
              </div>
            </div>
          </div>
        )
      })}
      {always.map((l) => (
        <div key={l._id} className="flex items-start gap-4 rounded-2xl border border-surface-dim bg-surface-container-lowest p-5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-50 text-green-700">
            <VideoIcon />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-on-surface">{l.title}</p>
            <p className="mt-0.5 text-xs text-on-surface-variant">Always available</p>
            <a href={l.meetingLink} target="_blank" rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-1.5 rounded-xl bg-green-50 border border-green-200 px-3 py-1.5 text-xs font-semibold text-green-700 hover:bg-green-100 transition-colors">
              <PlayIcon /> Join Session <ExternalIcon />
            </a>
          </div>
        </div>
      ))}
    </div>
  )
}

function StudentCourseLearn() {
  const { id } = useParams()
  const [tab, setTab] = useState('curriculum')
  const { data: courseData } = useCourse(id)
  const { data: lessonsData } = useLessons(id)
  const course = courseData?.data
  const lessons = lessonsData?.data || []

  const liveCount = lessons.filter((l) => l.meetingLink).length

  return (
    <DashboardShell active="My Learning">
      {/* Breadcrumb */}
      <div className="mb-5 flex items-center gap-2 text-sm text-on-surface-variant">
        <Link to="/student/courses" className="hover:text-secondary transition-colors">My Learning</Link>
        <span>/</span>
        <span className="text-on-surface font-semibold line-clamp-1">{course?.title || '…'}</span>
      </div>

      {/* Tab bar */}
      <div className="mb-6 flex gap-1 border-b border-surface-dim">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold transition-all border-b-2 -mb-px ${
              tab === t.id
                ? 'border-secondary text-secondary'
                : 'border-transparent text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <t.icon />
            {t.label}
            {t.id === 'live' && liveCount > 0 && (
              <span className="rounded-full bg-blue-100 px-1.5 py-0.5 text-[10px] font-bold text-secondary">{liveCount}</span>
            )}
          </button>
        ))}
      </div>

      {tab === 'curriculum' && <LessonPlayer courseId={id} />}
      {tab === 'live' && <LiveClassesTab lessons={lessons} />}
      {tab === 'overview' && <OverviewTab course={course} />}
    </DashboardShell>
  )
}

export default StudentCourseLearn
