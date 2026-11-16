import { useEffect, useState } from 'react'
import { useCourse } from '../api/courses'
import { useLessons, useCompleteLesson } from '../api/lessons'
import { LoadingState, ErrorState, EmptyState } from './StateViews'

function CheckIcon() {
  return (
    <svg viewBox="0 0 20 20" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="m4 10 4 4 8-8" />
    </svg>
  )
}
function PlayIcon() {
  return <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3" /></svg>
}
function VideoIcon() {
  return <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="2" y="6" width="14" height="12" rx="2" /><path d="m22 8-6 4 6 4V8Z" /></svg>
}
function LockIcon() {
  return <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="5" y="10" width="14" height="10" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></svg>
}
function ExternalIcon() {
  return <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14 21 3" /></svg>
}

function formatCountdown(ms) {
  if (ms <= 0) return null
  const totalSecs = Math.ceil(ms / 1000)
  const days  = Math.floor(totalSecs / 86400)
  const hours = Math.floor((totalSecs % 86400) / 3600)
  const mins  = Math.floor((totalSecs % 3600) / 60)
  const secs  = totalSecs % 60
  if (days > 0)  return `Starts in ${days}d ${hours}h`
  if (hours > 0) return `Starts in ${hours}h ${mins}m`
  if (mins > 0)  return `Starts in ${mins}m ${secs}s`
  return `Starts in ${secs}s`
}

// Join button — disabled with live countdown until scheduledAt, then becomes a link.
function JoinButton({ meetingLink, scheduledAt }) {
  const [now, setNow] = useState(Date.now())

  useEffect(() => {
    // Tick every second while within 1 hour of the session; every 30s otherwise.
    const scheduled = new Date(scheduledAt).getTime()
    const tick = () => {
      const remaining = scheduled - Date.now()
      setNow(Date.now())
      timer = setTimeout(tick, remaining > 0 && remaining < 3_600_000 ? 1000 : 30_000)
    }
    let timer = setTimeout(tick, 0)
    return () => clearTimeout(timer)
  }, [scheduledAt])

  const scheduled = new Date(scheduledAt).getTime()
  const remaining = scheduled - now
  const isLive = remaining <= 0
  const countdown = formatCountdown(remaining)

  if (isLive) {
    return (
      <a
        href={meetingLink}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold text-white transition-all hover:-translate-y-0.5 hover:shadow-lg"
        style={{ background: 'linear-gradient(135deg, #16a34a, #15803d)', boxShadow: '0 4px 12px rgba(22,163,74,0.35)' }}
      >
        <PlayIcon /> Join Live Session <ExternalIcon />
      </a>
    )
  }

  return (
    <div className="flex flex-col gap-1.5">
      <div
        className="inline-flex cursor-not-allowed items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-4 py-2 text-xs font-semibold text-gray-400"
        title={`Session starts at ${new Date(scheduledAt).toLocaleString()}`}
      >
        <LockIcon />
        <span>Join Live Session</span>
        <span className="ml-1 rounded-md bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-700">
          {countdown}
        </span>
      </div>
      <p className="text-[11px] text-on-surface-variant">
        Unlocks at {new Date(scheduledAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
      </p>
    </div>
  )
}

// Shared by the student's real "My Learning" page and the teacher's
// read-only course preview — same lesson list and layout either way, just
// without the mark-complete affordance (and without a progress bar that
// would be meaningless for a non-enrolled teacher) when readOnly.
function LessonPlayer({ courseId, readOnly = false }) {
  const { data: courseData } = useCourse(courseId)
  const { data, isPending, isError, error, refetch } = useLessons(courseId)
  const completeLesson = useCompleteLesson(courseId)

  const lessons = data?.data || []
  const completedCount = lessons.filter((l) => l.completed).length
  const progress = lessons.length ? Math.round((completedCount / lessons.length) * 100) : 0

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-on-surface">{courseData?.data?.title || 'Course'}</h1>
        {readOnly ? (
          <p className="mt-2 inline-flex items-center gap-2 rounded-full bg-accent-design px-3 py-1.5 text-xs font-semibold text-secondary">
            Preview mode — this is what an enrolled student sees
          </p>
        ) : (
          <div className="mt-3 flex items-center gap-3">
            <div className="h-2 w-64 max-w-full overflow-hidden rounded-full bg-surface-container-high">
              <div className="h-full rounded-full bg-secondary transition-all" style={{ width: `${progress}%` }} />
            </div>
            <span className="text-sm font-semibold text-on-surface-variant">{progress}% complete</span>
          </div>
        )}
      </div>

      {isPending && <LoadingState />}
      {isError && <ErrorState message={error.message} onRetry={refetch} />}

      {!isPending && !isError && (
        lessons.length === 0 ? (
          <EmptyState title="No lessons published yet" description="Check back soon." />
        ) : (
          <ul className="divide-y divide-surface-dim rounded-xl border border-surface-dim bg-surface-container-lowest">
            {lessons.map((lesson, i) => (
              <li key={lesson._id} className="flex items-start gap-4 p-5">
                {/* Completion toggle */}
                {readOnly ? (
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-surface-dim text-xs font-bold text-on-surface-variant">
                    {i + 1}
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => !lesson.completed && completeLesson.mutate(lesson._id)}
                    disabled={lesson.completed || completeLesson.isPending}
                    aria-label={lesson.completed ? 'Completed' : 'Mark complete'}
                    className={
                      lesson.completed
                        ? 'mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-green text-white'
                        : 'mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-surface-dim text-transparent transition-colors hover:border-secondary'
                    }
                  >
                    <CheckIcon />
                  </button>
                )}

                {/* Lesson body */}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-on-surface">
                    {readOnly ? lesson.title : `${i + 1}. ${lesson.title}`}
                  </p>

                  {/* Video / resource link */}
                  {lesson.videoLink && (
                    <a
                      href={lesson.videoLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-flex items-center gap-1.5 rounded-xl border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 transition-colors hover:bg-blue-100"
                    >
                      <VideoIcon /> Watch / View Resource <ExternalIcon />
                    </a>
                  )}

                  {/* Text content */}
                  {lesson.content && (
                    <p className="mt-2 whitespace-pre-line text-sm text-on-surface-variant">{lesson.content}</p>
                  )}

                  {/* Live session join button */}
                  {lesson.meetingLink && lesson.scheduledAt && (
                    <div className="mt-3">
                      <JoinButton meetingLink={lesson.meetingLink} scheduledAt={lesson.scheduledAt} />
                    </div>
                  )}

                  {/* Meeting link without a scheduled time — always accessible */}
                  {lesson.meetingLink && !lesson.scheduledAt && (
                    <a
                      href={lesson.meetingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-flex items-center gap-1.5 rounded-xl border border-green-200 bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700 transition-colors hover:bg-green-100"
                    >
                      <PlayIcon /> Join Session <ExternalIcon />
                    </a>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )
      )}
      {!readOnly && completeLesson.error && (
        <p role="alert" className="mt-4 rounded-lg bg-error/10 px-4 py-2.5 text-sm font-medium text-error">
          {completeLesson.error.message}
        </p>
      )}
    </div>
  )
}

export default LessonPlayer
