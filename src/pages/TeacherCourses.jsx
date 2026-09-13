import { useState } from 'react'
import { Link } from 'react-router-dom'
import DashboardShell from '../components/DashboardShell'
import { useMyCourses, useSubmitCourse, useDeleteCourse } from '../api/courses'
import { LoadingState, ErrorState, EmptyState } from '../components/StateViews'
import { STATUS_BADGE } from '../lib/constants'

function PlusCircleIcon() {
  return (
    <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="10" cy="10" r="8.25" />
      <path d="M10 6.5v7M6.5 10h7" />
    </svg>
  )
}

function UsersIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="8" r="3.2" />
      <path d="M3.5 19c.6-3.2 3-5 5.5-5s4.9 1.8 5.5 5" />
      <circle cx="17" cy="9" r="2.6" />
      <path d="M15.2 14.3c1.9.4 3.4 1.9 3.8 4.2" />
    </svg>
  )
}

const TABS = [
  { key: 'all', label: 'All' },
  { key: 'draft', label: 'Draft' },
  { key: 'pending_approval', label: 'Pending' },
  { key: 'approved', label: 'Approved' },
  { key: 'rejected', label: 'Rejected' },
  { key: 'archived', label: 'Archived' },
]

const IMG_BASE = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5001'

function CourseCard({ course, onSubmit, onDelete, submitting, deleting }) {
  const badge = STATUS_BADGE[course.status]
  const canSubmit = course.status === 'draft' || course.status === 'rejected'
  const hasPending = Boolean(course.pendingChanges)

  return (
    <div className="overflow-hidden rounded-2xl border border-surface-dim bg-surface-container-lowest shadow-[var(--shadow-card-sm)] transition-shadow hover:shadow-[var(--shadow-card-md)]">
      <div className="relative h-40">
        {course.thumbnail ? (
          <img src={`${IMG_BASE}${course.thumbnail}`} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-accent-design text-secondary">No thumbnail</div>
        )}
        <span className={`absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold shadow-sm ${badge.className}`}>
          {badge.label}
        </span>
        {hasPending && (
          <span className="absolute top-3 right-3 inline-flex items-center rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-white shadow-sm">
            Edit pending review
          </span>
        )}
      </div>

      <div className="p-5">
        <p className="text-xs font-bold tracking-wide text-secondary uppercase">{course.category}</p>
        <Link to={`/courses/${course._id}`} className="mt-1 line-clamp-2 block text-lg font-bold text-on-surface hover:underline">
          {course.title}
        </Link>

        {course.status === 'rejected' && course.rejectionReason && (
          <p className="mt-2 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">{course.rejectionReason}</p>
        )}

        <div className="mt-3 flex items-center gap-3 text-sm text-on-surface-variant">
          <span className="flex items-center gap-1.5">
            <UsersIcon />
            {(course.enrollmentCount || 0).toLocaleString()} Students
          </span>
        </div>

        <div className="mt-4 flex gap-3 border-t border-surface-dim pt-4">
          <Link
            to={`/teacher/courses/${course._id}`}
            className="flex flex-1 items-center justify-center rounded-lg border border-surface-dim px-3 py-2.5 text-sm font-semibold text-on-surface transition-colors hover:bg-surface-container-low"
          >
            Manage
          </Link>
          {canSubmit && (
            <button
              type="button"
              disabled={submitting}
              onClick={() => onSubmit(course._id)}
              className="flex-1 rounded-lg bg-secondary px-3 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-secondary-hover disabled:opacity-60"
            >
              {submitting ? 'Submitting…' : 'Submit'}
            </button>
          )}
          {course.status !== 'archived' && (
            <button
              type="button"
              disabled={deleting}
              onClick={() => onDelete(course._id)}
              aria-label="Delete course"
              className="rounded-lg border border-surface-dim px-3 py-2.5 text-sm font-semibold text-error transition-colors hover:bg-error/10 disabled:opacity-60"
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

function TeacherCourses() {
  const [activeTab, setActiveTab] = useState('all')
  const { data, isPending, isError, error, refetch } = useMyCourses()
  const submitCourse = useSubmitCourse()
  const deleteCourse = useDeleteCourse()
  const [confirmDeleteId, setConfirmDeleteId] = useState(null)

  const courses = data?.data || []
  const visible = activeTab === 'all' ? courses : courses.filter((c) => c.status === activeTab)

  const handleDelete = (id) => {
    if (confirmDeleteId !== id) {
      setConfirmDeleteId(id)
      return
    }
    deleteCourse.mutate({ id }, { onSettled: () => setConfirmDeleteId(null) })
  }

  return (
    <DashboardShell active="My Courses">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-on-surface">My Courses</h1>
          <p className="mt-1 text-on-surface-variant">Manage your curriculum, review status, and student engagement.</p>
        </div>
        <Link
          to="/teacher/courses/new"
          className="flex items-center gap-2 rounded-full bg-secondary px-5 py-3 text-sm font-bold text-white shadow-[var(--shadow-card-md)] transition-colors hover:bg-secondary-hover"
        >
          <PlusCircleIcon />
          Create New Course
        </Link>
      </div>

      <div className="mb-8 inline-flex flex-wrap items-center gap-1 rounded-full border border-surface-dim bg-surface-container-lowest p-1">
        {TABS.map((tab) => {
          const count = tab.key === 'all' ? courses.length : courses.filter((c) => c.status === tab.key).length
          const isActive = tab.key === activeTab
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={
                isActive
                  ? 'flex items-center gap-2 rounded-full bg-secondary/10 px-4 py-2 text-sm font-bold text-secondary'
                  : 'flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-on-surface-variant transition-colors hover:text-on-surface'
              }
            >
              {tab.label}
              {count > 0 && <span className="rounded-full bg-surface-container-high px-1.5 py-0.5 text-xs font-bold">{count}</span>}
            </button>
          )
        })}
      </div>

      {deleteCourse.error && (
        <p role="alert" className="mb-4 rounded-lg bg-error/10 px-4 py-2.5 text-sm font-medium text-error">
          {deleteCourse.error.message}
        </p>
      )}

      {isPending && <LoadingState />}
      {isError && <ErrorState message={error.message} onRetry={refetch} />}

      {!isPending && !isError && (
        visible.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((course) => (
              <CourseCard
                key={course._id}
                course={course}
                onSubmit={(id) => submitCourse.mutate(id)}
                onDelete={handleDelete}
                submitting={submitCourse.isPending}
                deleting={deleteCourse.isPending}
              />
            ))}
          </div>
        ) : (
          <EmptyState title="No courses in this category yet." />
        )
      )}

      {confirmDeleteId && (
        <p className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full bg-on-surface px-5 py-3 text-sm font-semibold text-white shadow-[var(--shadow-card-lg)]">
          Click Delete again to confirm removing this course.
        </p>
      )}
    </DashboardShell>
  )
}

export default TeacherCourses
