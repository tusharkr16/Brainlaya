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
                <div>
                  <p className="font-semibold text-on-surface">
                    {readOnly ? lesson.title : `${i + 1}. ${lesson.title}`}
                  </p>
                  <p className="mt-1 whitespace-pre-line text-sm text-on-surface-variant">{lesson.content}</p>
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
