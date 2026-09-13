import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import DashboardShell from '../components/DashboardShell'
import CourseForm from '../components/CourseForm'
import { useCourse, useUpdateCourse, useSubmitCourse, useDeleteCourse, useCourseStudents, usePostAnnouncement } from '../api/courses'
import { useLessons, useCreateLesson, useDeleteLesson } from '../api/lessons'
import { LoadingState, ErrorState, EmptyState } from '../components/StateViews'
import { STATUS_BADGE } from '../lib/constants'

const TABS = ['Details', 'Lessons', 'Students', 'Announcements']

function LessonsTab({ courseId }) {
  const { data, isPending, isError, error, refetch } = useLessons(courseId)
  const createLesson = useCreateLesson(courseId)
  const deleteLesson = useDeleteLesson(courseId)
  const [form, setForm] = useState({ title: '', content: '' })

  if (isPending) return <LoadingState />
  if (isError) return <ErrorState message={error.message} onRetry={refetch} />

  const lessons = data?.data || []

  const handleAdd = (e) => {
    e.preventDefault()
    createLesson.mutate(
      { title: form.title, content: form.content, order: lessons.length },
      { onSuccess: () => setForm({ title: '', content: '' }) }
    )
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleAdd} className="rounded-xl border border-surface-dim bg-surface-container-lowest p-5">
        <h3 className="mb-3 text-sm font-bold text-on-surface">Add a lesson</h3>
        {createLesson.error && <p className="mb-3 rounded-lg bg-error/10 px-3 py-2 text-xs font-medium text-error">{createLesson.error.message}</p>}
        <div className="grid gap-3">
          <input
            required
            placeholder="Lesson title"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            className="rounded-lg border border-surface-dim bg-surface px-3 py-2 text-sm outline-none focus:border-secondary"
          />
          <textarea
            required
            rows={3}
            placeholder="Lesson content (markdown supported)"
            value={form.content}
            onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
            className="resize-none rounded-lg border border-surface-dim bg-surface px-3 py-2 text-sm outline-none focus:border-secondary"
          />
          <button
            type="submit"
            disabled={createLesson.isPending}
            className="w-fit rounded-lg bg-secondary px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-secondary-hover disabled:opacity-60"
          >
            {createLesson.isPending ? 'Adding…' : 'Add Lesson'}
          </button>
        </div>
      </form>

      {lessons.length === 0 ? (
        <EmptyState title="No lessons yet" description="Add your first lesson above." />
      ) : (
        <ul className="divide-y divide-surface-dim rounded-xl border border-surface-dim bg-surface-container-lowest">
          {lessons.map((lesson, i) => (
            <li key={lesson._id} className="flex items-start justify-between gap-4 p-4">
              <div>
                <p className="text-sm font-semibold text-on-surface">
                  {i + 1}. {lesson.title}
                </p>
                <p className="mt-1 line-clamp-2 text-xs text-on-surface-variant">{lesson.content}</p>
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
      )}
    </div>
  )
}

function StudentsTab({ courseId }) {
  const { data, isPending, isError, error, refetch } = useCourseStudents(courseId)
  if (isPending) return <LoadingState />
  if (isError) return <ErrorState message={error.message} onRetry={refetch} />

  const enrollments = data?.data || []
  if (enrollments.length === 0) return <EmptyState title="No students enrolled yet" />

  return (
    <ul className="divide-y divide-surface-dim rounded-xl border border-surface-dim bg-surface-container-lowest">
      {enrollments.map((e) => (
        <li key={e._id} className="flex items-center justify-between gap-4 p-4">
          <div>
            <p className="text-sm font-semibold text-on-surface">{e.studentId?.name}</p>
            <p className="text-xs text-on-surface-variant">{e.studentId?.email}</p>
          </div>
          <span className="text-xs text-on-surface-variant">Enrolled {new Date(e.enrolledAt).toLocaleDateString()}</span>
        </li>
      ))}
    </ul>
  )
}

function AnnouncementsTab({ courseId }) {
  const postAnnouncement = usePostAnnouncement()
  const [message, setMessage] = useState('')
  const [sent, setSent] = useState(false)

  const handleSend = (e) => {
    e.preventDefault()
    postAnnouncement.mutate(
      { id: courseId, message },
      {
        onSuccess: () => {
          setMessage('')
          setSent(true)
          setTimeout(() => setSent(false), 3000)
        },
      }
    )
  }

  return (
    <form onSubmit={handleSend} className="rounded-xl border border-surface-dim bg-surface-container-lowest p-5">
      <h3 className="mb-1 text-sm font-bold text-on-surface">Post an update</h3>
      <p className="mb-3 text-xs text-on-surface-variant">Sent instantly to every enrolled student as a notification.</p>
      {postAnnouncement.error && <p className="mb-3 rounded-lg bg-error/10 px-3 py-2 text-xs font-medium text-error">{postAnnouncement.error.message}</p>}
      {sent && <p className="mb-3 rounded-lg bg-brand-green/10 px-3 py-2 text-xs font-medium text-brand-green">Announcement sent.</p>}
      <textarea
        required
        rows={3}
        placeholder="e.g. New lesson on graph algorithms is live!"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="w-full resize-none rounded-lg border border-surface-dim bg-surface px-3 py-2 text-sm outline-none focus:border-secondary"
      />
      <button
        type="submit"
        disabled={postAnnouncement.isPending}
        className="mt-3 w-fit rounded-lg bg-secondary px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-secondary-hover disabled:opacity-60"
      >
        {postAnnouncement.isPending ? 'Sending…' : 'Send Announcement'}
      </button>
    </form>
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
      {tab === 'Lessons' && <LessonsTab courseId={id} />}
      {tab === 'Students' && <StudentsTab courseId={id} />}
      {tab === 'Announcements' && <AnnouncementsTab courseId={id} />}
    </DashboardShell>
  )
}

export default TeacherCourseManage
