import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import DashboardShell from '../components/DashboardShell'
import CourseForm from '../components/CourseForm'
import { useCourse, useUpdateCourse, useSubmitCourse, useDeleteCourse, useCourseStudents, usePostAnnouncement } from '../api/courses'
import { useLessons, useCreateLesson, useDeleteLesson } from '../api/lessons'
import { LoadingState, ErrorState, EmptyState } from '../components/StateViews'
import { STATUS_BADGE } from '../lib/constants'

const TABS = ['Details', 'Curriculum', 'Students', 'Notify Students']

// ── Icons ──────────────────────────────────────────────────────────────────────
function CalendarIcon() {
  return <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3.5" y="5" width="17" height="15.5" rx="2" /><path d="M3.5 9.5h17M8 3v3.5M16 3v3.5" /></svg>
}
function LinkIcon() {
  return <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 15 15 9" /><path d="M11 6.5 12.5 5a3.5 3.5 0 0 1 5 5L16 11.5" /><path d="M13 17.5 11.5 19a3.5 3.5 0 0 1-5-5L8 12.5" /></svg>
}
function VideoIcon() {
  return <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="6" width="14" height="12" rx="2" /><path d="m22 8-6 4 6 4V8Z" /></svg>
}
function TextIcon() {
  return <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M4 7h16M4 12h10M4 17h7" /></svg>
}
function BellIcon() {
  return <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>
}
function PlayIcon() {
  return <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3" /></svg>
}
function ExternalIcon() {
  return <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14 21 3" /></svg>
}

// ── LessonsTab ─────────────────────────────────────────────────────────────────
function LessonsTab({ courseId }) {
  const { data, isPending, isError, error, refetch } = useLessons(courseId)
  const createLesson = useCreateLesson(courseId)
  const deleteLesson = useDeleteLesson(courseId)
  const EMPTY = { title: '', content: '', videoLink: '', scheduledAt: '', meetingLink: '', recordingLink: '' }
  const [form, setForm] = useState(EMPTY)
  const [mode, setMode] = useState('link') // 'link' | 'text'

  if (isPending) return <LoadingState />
  if (isError) return <ErrorState message={error.message} onRetry={refetch} />

  const lessons = data?.data || []

  const handleAdd = (e) => {
    e.preventDefault()
    createLesson.mutate(
      {
        title: form.title,
        content: form.content.trim() || '',
        videoLink: form.videoLink.trim() || null,
        order: lessons.length,
        scheduledAt: form.scheduledAt ? new Date(form.scheduledAt).toISOString() : null,
        meetingLink: form.meetingLink.trim() || null,
        recordingLink: form.recordingLink.trim() || null,
      },
      { onSuccess: () => setForm(EMPTY) }
    )
  }

  return (
    <div className="space-y-6">
      {/* Add lesson form */}
      <div className="rounded-2xl border border-surface-dim bg-surface-container-lowest overflow-hidden">
        <div className="px-5 pt-5 pb-4 border-b border-surface-dim">
          <h3 className="text-base font-bold text-on-surface mb-3">Add a lesson</h3>
          {/* Mode toggle */}
          <div className="inline-flex items-center gap-1 rounded-xl bg-surface-container p-1">
            <button
              type="button"
              onClick={() => setMode('link')}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${mode === 'link' ? 'bg-secondary text-white' : 'text-on-surface-variant hover:text-on-surface'}`}
            >
              <VideoIcon /> Video / Resource Link
            </button>
            <button
              type="button"
              onClick={() => setMode('text')}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${mode === 'text' ? 'bg-secondary text-white' : 'text-on-surface-variant hover:text-on-surface'}`}
            >
              <TextIcon /> Text Content
            </button>
          </div>
        </div>

        <form onSubmit={handleAdd} className="p-5">
          {createLesson.error && <p className="mb-4 rounded-lg bg-error/10 px-3 py-2 text-xs font-medium text-error">{createLesson.error.message}</p>}

          <div className="grid gap-4">
            {/* Title */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-on-surface-variant">Lesson Title *</label>
              <input
                required
                placeholder="e.g. Introduction to Variables"
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                className="rounded-xl border border-surface-dim bg-surface px-4 py-2.5 text-sm outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/10"
              />
            </div>

            {/* Video/Resource link (shown in link mode) */}
            {mode === 'link' && (
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-on-surface-variant">Video / Resource URL *</label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">
                    <VideoIcon />
                  </span>
                  <input
                    required={mode === 'link'}
                    type="url"
                    placeholder="https://youtube.com/watch?v=... or https://drive.google.com/..."
                    value={form.videoLink}
                    onChange={(e) => setForm((f) => ({ ...f, videoLink: e.target.value }))}
                    className="w-full rounded-xl border border-surface-dim bg-surface py-2.5 pl-9 pr-4 text-sm outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/10"
                  />
                </div>
                <p className="text-xs text-on-surface-variant mt-0.5">YouTube, Vimeo, Google Drive, Loom, Dropbox — any publicly accessible URL</p>
              </div>
            )}

            {/* Text content (shown in text mode) */}
            {mode === 'text' && (
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-on-surface-variant">Lesson Content</label>
                <textarea
                  rows={4}
                  placeholder="Write your lesson content here… (markdown supported)"
                  value={form.content}
                  onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
                  className="resize-none rounded-xl border border-surface-dim bg-surface px-4 py-2.5 text-sm outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/10"
                />
              </div>
            )}

            {/* Optional description (shown in link mode) */}
            {mode === 'link' && (
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-on-surface-variant">Description (optional)</label>
                <textarea
                  rows={2}
                  placeholder="Brief description of what students will learn in this lesson"
                  value={form.content}
                  onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
                  className="resize-none rounded-xl border border-surface-dim bg-surface px-4 py-2.5 text-sm outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/10"
                />
              </div>
            )}

            {/* Live session row */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-on-surface-variant">Live Session Time (optional)</label>
                <input
                  type="datetime-local"
                  value={form.scheduledAt}
                  onChange={(e) => setForm((f) => ({ ...f, scheduledAt: e.target.value }))}
                  className="rounded-xl border border-surface-dim bg-surface px-3 py-2.5 text-sm outline-none focus:border-secondary"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-on-surface-variant">Meeting Link (optional)</label>
                <input
                  type="url"
                  placeholder="https://zoom.us/j/..."
                  value={form.meetingLink}
                  onChange={(e) => setForm((f) => ({ ...f, meetingLink: e.target.value }))}
                  className="rounded-xl border border-surface-dim bg-surface px-3 py-2.5 text-sm outline-none focus:border-secondary"
                />
              </div>
            </div>

            {/* Recording link */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-on-surface-variant">Session Recording Link (optional)</label>
              <input
                type="url"
                placeholder="https://youtube.com/watch?v=... or Zoom recording URL"
                value={form.recordingLink}
                onChange={(e) => setForm((f) => ({ ...f, recordingLink: e.target.value }))}
                className="rounded-xl border border-surface-dim bg-surface px-3 py-2.5 text-sm outline-none focus:border-secondary"
              />
              <p className="text-xs text-on-surface-variant">Add after the session so students can review the recording.</p>
            </div>

            <div className="flex items-center justify-between pt-1">
              <p className="text-xs text-on-surface-variant">Scheduled time and meeting link are visible publicly on the course page.</p>
              <button
                type="submit"
                disabled={createLesson.isPending}
                className="flex items-center gap-2 rounded-xl bg-secondary px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-secondary-hover disabled:opacity-60"
              >
                {createLesson.isPending ? 'Adding…' : '+ Add Lesson'}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Lesson list */}
      {lessons.length === 0 ? (
        <EmptyState title="No lessons yet" description="Add your first lesson above." />
      ) : (
        <div className="rounded-2xl border border-surface-dim bg-surface-container-lowest overflow-hidden">
          <div className="px-5 py-3 border-b border-surface-dim flex items-center justify-between">
            <h3 className="text-sm font-bold text-on-surface">Curriculum ({lessons.length} {lessons.length === 1 ? 'lesson' : 'lessons'})</h3>
            <span className="text-xs text-on-surface-variant">Drag to reorder (coming soon)</span>
          </div>
          <ul className="divide-y divide-surface-dim">
            {lessons.map((lesson, i) => (
              <li key={lesson._id} className="flex items-start justify-between gap-4 px-5 py-4 hover:bg-surface-container-low transition-colors">
                <div className="flex items-start gap-3 min-w-0">
                  {/* Number */}
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-secondary/10 text-xs font-bold text-secondary">
                    {i + 1}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-on-surface leading-snug">{lesson.title}</p>

                    {/* Video link badge */}
                    {lesson.videoLink && (
                      <a
                        href={lesson.videoLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1.5 inline-flex items-center gap-1.5 rounded-lg bg-blue-50 border border-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-700 hover:bg-blue-100 transition-colors"
                      >
                        <PlayIcon /> Watch / View Resource <ExternalIcon />
                      </a>
                    )}

                    {lesson.recordingLink && (
                      <a
                        href={lesson.recordingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1.5 inline-flex items-center gap-1.5 rounded-lg bg-purple-50 border border-purple-100 px-2.5 py-1 text-xs font-semibold text-purple-700 hover:bg-purple-100 transition-colors"
                      >
                        <PlayIcon /> Recording <ExternalIcon />
                      </a>
                    )}
                    {lesson.content && (
                      <p className="mt-1 line-clamp-2 text-xs text-on-surface-variant">{lesson.content}</p>
                    )}

                    {(lesson.scheduledAt || lesson.meetingLink) && (
                      <div className="mt-2 flex flex-wrap items-center gap-3 text-xs font-semibold text-secondary">
                        {lesson.scheduledAt && (
                          <span className="flex items-center gap-1.5">
                            <CalendarIcon />
                            {new Date(lesson.scheduledAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
                          </span>
                        )}
                        {lesson.meetingLink && (
                          <a href={lesson.meetingLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:underline">
                            <LinkIcon /> Join Meeting
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => deleteLesson.mutate(lesson._id)}
                  disabled={deleteLesson.isPending}
                  className="shrink-0 rounded-lg border border-surface-dim px-3 py-1.5 text-xs font-semibold text-error transition-colors hover:bg-error/10 disabled:opacity-60"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

// ── StudentsTab ────────────────────────────────────────────────────────────────
function StudentsTab({ courseId }) {
  const { data, isPending, isError, error, refetch } = useCourseStudents(courseId)
  if (isPending) return <LoadingState />
  if (isError) return <ErrorState message={error.message} onRetry={refetch} />

  const enrollments = data?.data || []
  if (enrollments.length === 0) return <EmptyState title="No students enrolled yet" />

  return (
    <div className="rounded-2xl border border-surface-dim bg-surface-container-lowest overflow-hidden">
      <div className="px-5 py-3 border-b border-surface-dim">
        <h3 className="text-sm font-bold text-on-surface">{enrollments.length} students enrolled</h3>
      </div>
      <ul className="divide-y divide-surface-dim">
        {enrollments.map((e) => (
          <li key={e._id} className="flex items-center justify-between gap-4 px-5 py-4">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary/15 text-sm font-bold text-secondary shrink-0">
                {e.studentId?.name?.[0]?.toUpperCase() || 'S'}
              </span>
              <div>
                <p className="text-sm font-semibold text-on-surface">{e.studentId?.name}</p>
                <p className="text-xs text-on-surface-variant">{e.studentId?.email}</p>
              </div>
            </div>
            <span className="text-xs text-on-surface-variant">Enrolled {new Date(e.enrolledAt).toLocaleDateString()}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

// ── NotifyStudentsTab ──────────────────────────────────────────────────────────
const NOTIF_TEMPLATES = [
  { emoji: '📢', label: 'New lesson is live', text: 'A new lesson has been added to the course. Log in to check it out!' },
  { emoji: '📅', label: 'Upcoming live session', text: 'We have a live session coming up soon. Make sure to join — see the schedule in the Curriculum tab.' },
  { emoji: '🏆', label: 'Keep up the great work', text: "You're making amazing progress! Keep going — you're almost there." },
  { emoji: '📌', label: 'Important update', text: 'An important update has been posted for this course. Please log in to see the details.' },
]

function NotifyStudentsTab({ courseId }) {
  const postAnnouncement = usePostAnnouncement()
  const [message, setMessage] = useState('')
  const [sent, setSent] = useState(false)

  const handleSend = (e) => {
    e.preventDefault()
    if (!message.trim()) return
    postAnnouncement.mutate(
      { id: courseId, message: message.trim() },
      {
        onSuccess: () => {
          setMessage('')
          setSent(true)
          setTimeout(() => setSent(false), 4000)
        },
      }
    )
  }

  return (
    <div className="space-y-5">
      {/* Info banner */}
      <div className="flex items-start gap-3 rounded-2xl border border-blue-100 bg-blue-50 px-5 py-4">
        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
          <BellIcon />
        </span>
        <div>
          <p className="text-sm font-bold text-blue-900">Send a notification to all enrolled students</p>
          <p className="mt-0.5 text-xs text-blue-700">Your message is delivered instantly as an in-app notification to every student enrolled in this course.</p>
        </div>
      </div>

      {/* Quick templates */}
      <div className="rounded-2xl border border-surface-dim bg-surface-container-lowest p-5">
        <p className="mb-3 text-xs font-bold text-on-surface-variant uppercase tracking-wide">Quick Templates</p>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {NOTIF_TEMPLATES.map((t) => (
            <button
              key={t.label}
              type="button"
              onClick={() => setMessage(t.text)}
              className="flex items-start gap-2.5 rounded-xl border border-surface-dim bg-surface-container p-3 text-left transition-colors hover:border-secondary/40 hover:bg-secondary/5"
            >
              <span className="text-lg shrink-0">{t.emoji}</span>
              <div>
                <p className="text-xs font-semibold text-on-surface">{t.label}</p>
                <p className="mt-0.5 line-clamp-2 text-xs text-on-surface-variant">{t.text}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Compose box */}
      <form onSubmit={handleSend} className="rounded-2xl border border-surface-dim bg-surface-container-lowest p-5">
        <p className="mb-3 text-xs font-bold text-on-surface-variant uppercase tracking-wide">Compose Notification</p>

        {postAnnouncement.error && (
          <p className="mb-3 rounded-lg bg-error/10 px-3 py-2 text-xs font-medium text-error">{postAnnouncement.error.message}</p>
        )}
        {sent && (
          <div className="mb-3 flex items-center gap-2 rounded-lg bg-green-50 border border-green-100 px-3 py-2 text-xs font-semibold text-green-700">
            ✓ Notification sent to all enrolled students!
          </div>
        )}

        <textarea
          required
          rows={4}
          placeholder="e.g. New lesson on calculus derivatives is live — check it out now!"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full resize-none rounded-xl border border-surface-dim bg-surface px-4 py-3 text-sm outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/10"
        />

        <div className="mt-3 flex items-center justify-between">
          <span className="text-xs text-on-surface-variant">{message.length} / 500 characters</span>
          <button
            type="submit"
            disabled={postAnnouncement.isPending || !message.trim()}
            className="flex items-center gap-2 rounded-xl bg-secondary px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-secondary-hover disabled:opacity-60"
          >
            <BellIcon />
            {postAnnouncement.isPending ? 'Sending…' : 'Send Notification'}
          </button>
        </div>
      </form>
    </div>
  )
}

function TeacherCourseManage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [tab, setTab] = useState('Details')
  const { data, isPending, isError, error, refetch } = useCourse(id)
  const updateCourse = useUpdateCourse()
  const submitCourse = useSubmitCourse()
  const deleteCourse = useDeleteCourse()
  const [confirmDelete, setConfirmDelete] = useState(false)

  if (isPending) return <DashboardShell active="My Courses"><LoadingState /></DashboardShell>
  if (isError) return <DashboardShell active="My Courses"><ErrorState message={error.message} onRetry={refetch} /></DashboardShell>

  const course = data.data
  const badge = STATUS_BADGE[course.status]
  const canSubmit = course.status === 'draft' || course.status === 'rejected'

  const handleDelete = () => {
    if (!confirmDelete) return setConfirmDelete(true)
    deleteCourse.mutate({ id }, { onSuccess: () => navigate('/teacher/courses') })
  }

  return (
    <DashboardShell active="My Courses">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-extrabold text-on-surface">{course.title}</h1>
            <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${badge.className}`}>{badge.label}</span>
          </div>
          <p className="mt-1 text-on-surface-variant">{course.category}</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link
            to={`/courses/${id}`}
            className="rounded-lg border border-surface-dim px-4 py-2.5 text-sm font-semibold text-on-surface transition-colors hover:bg-surface-container-low"
          >
            View Public Page
          </Link>
          <Link
            to={`/teacher/courses/${id}/preview`}
            className="rounded-lg border border-surface-dim px-4 py-2.5 text-sm font-semibold text-on-surface transition-colors hover:bg-surface-container-low"
          >
            Preview as Student
          </Link>
          {canSubmit && (
            <button
              type="button"
              onClick={() => submitCourse.mutate(id)}
              disabled={submitCourse.isPending}
              className="rounded-lg bg-secondary px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-secondary-hover disabled:opacity-60"
            >
              {submitCourse.isPending ? 'Submitting…' : 'Submit for Approval'}
            </button>
          )}
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleteCourse.isPending}
            className="rounded-lg border border-surface-dim px-4 py-2.5 text-sm font-semibold text-error transition-colors hover:bg-error/10 disabled:opacity-60"
          >
            {confirmDelete ? 'Confirm Delete' : 'Delete'}
          </button>
        </div>
      </div>

      {deleteCourse.error && <p role="alert" className="mb-4 rounded-lg bg-error/10 px-4 py-2.5 text-sm font-medium text-error">{deleteCourse.error.message}</p>}
      {course.status === 'rejected' && course.rejectionReason && (
        <p className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <strong>Rejected:</strong> {course.rejectionReason}
        </p>
      )}
      {course.pendingChanges && (
        <p className="mb-4 rounded-lg border border-secondary/30 bg-accent-design px-4 py-3 text-sm text-secondary">
          You have edits pending admin review. The published version above is still what students see.
        </p>
      )}

      <div className="mb-6 inline-flex items-center gap-1 rounded-full border border-surface-dim bg-surface-container-lowest p-1">
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={
              tab === t
                ? 'rounded-full bg-secondary/10 px-4 py-2 text-sm font-bold text-secondary'
                : 'rounded-full px-4 py-2 text-sm font-medium text-on-surface-variant transition-colors hover:text-on-surface'
            }
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 'Details' && (
        <CourseForm
          initial={{ ...course, ...course.pendingChanges }}
          submitLabel={course.status === 'approved' ? 'Submit Changes for Review' : 'Save Changes'}
          submitting={updateCourse.isPending}
          error={updateCourse.error?.message}
          onSubmit={(body) => updateCourse.mutate({ id, body })}
        />
      )}
      {tab === 'Curriculum' && <LessonsTab courseId={id} />}
      {tab === 'Students' && <StudentsTab courseId={id} />}
      {tab === 'Notify Students' && <NotifyStudentsTab courseId={id} />}
    </DashboardShell>
  )
}

export default TeacherCourseManage
