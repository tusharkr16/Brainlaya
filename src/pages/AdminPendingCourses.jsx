import { useState } from 'react'
import DashboardShell from '../components/DashboardShell'
import { Modal } from '@/components/ui/modal'
import CourseDetailsModal from '../components/CourseDetailsModal'
import { usePendingCourses, useApproveCourse, useRejectCourse } from '../api/admin'
import { LoadingState, ErrorState, EmptyState } from '../components/StateViews'

function RejectModal({ course, onClose, onReject, submitting, error }) {
  const [reason, setReason] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    onReject(reason)
  }

  return (
    <Modal open onClose={onClose} className="max-w-md p-7">
      <h3 className="mb-1 text-xl font-bold text-on-surface">Reject changes</h3>
      <p className="mb-5 text-sm text-on-surface-variant">
        For &ldquo;{course.title}&rdquo; — the teacher will see this reason.
      </p>
      {error && <p className="mb-4 rounded-lg bg-error/10 px-4 py-2.5 text-sm font-medium text-error">{error}</p>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
        <textarea
          required
          minLength={3}
          rows={4}
          autoFocus
          placeholder="Explain what needs to change..."
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="rounded-lg border border-surface-dim px-4 py-2.5 text-sm text-on-surface outline-none focus:border-secondary"
        />
        <button
          type="submit"
          disabled={submitting}
          className="rounded-lg bg-error px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-error/90 disabled:opacity-60"
        >
          {submitting ? 'Rejecting…' : 'Reject'}
        </button>
      </form>
    </Modal>
  )
}

function AdminPendingCourses() {
  const { data, isPending, isError, error, refetch } = usePendingCourses()
  const approveCourse = useApproveCourse()
  const rejectCourse = useRejectCourse()
  const [rejectingCourse, setRejectingCourse] = useState(null)
  const [viewingCourse, setViewingCourse] = useState(null)

  const courses = data?.data || []

  return (
    <DashboardShell active="Approval Queue">
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-on-surface">Approval Queue</h1>
        <p className="mt-1 text-on-surface-variant">New course submissions and pending edits to live courses.</p>
      </div>

      {isPending && <LoadingState />}
      {isError && <ErrorState message={error.message} onRetry={refetch} />}

      {!isPending && !isError && (
        courses.length === 0 ? (
          <EmptyState title="Nothing waiting for review" description="You're all caught up." />
        ) : (
          <div className="space-y-4">
            {courses.map((course) => {
              const isEdit = course.status === 'approved' && course.pendingChanges
              return (
                <div key={course._id} className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-surface-dim bg-surface-container-lowest p-5">
                  <button type="button" onClick={() => setViewingCourse(course)} className="flex-1 text-left">
                    <span
                      className={
                        isEdit
                          ? 'mb-1 inline-block rounded-full bg-secondary/10 px-2.5 py-0.5 text-[11px] font-bold text-secondary'
                          : 'mb-1 inline-block rounded-full bg-amber-100 px-2.5 py-0.5 text-[11px] font-bold text-amber-700'
                      }
                    >
                      {isEdit ? 'Edit to live course' : 'New course submission'}
                    </span>
                    <p className="font-semibold text-on-surface hover:underline">{course.title}</p>
                    <p className="text-sm text-on-surface-variant">
                      by {course.teacherId?.name} &bull; {course.category}
                    </p>
                    {isEdit && (
                      <p className="mt-1 text-xs text-on-surface-variant">
                        Proposed: {Object.keys(course.pendingChanges).join(', ')}
                      </p>
                    )}
                  </button>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setViewingCourse(course)}
                      className="rounded-lg border border-surface-dim px-4 py-2.5 text-sm font-semibold text-on-surface transition-colors hover:bg-surface-container-low"
                    >
                      View Details
                    </button>
                    <button
                      type="button"
                      onClick={() => approveCourse.mutate(course._id)}
                      disabled={approveCourse.isPending}
                      className="rounded-lg bg-brand-green px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-brand-green/90 disabled:opacity-60"
                    >
                      Approve
                    </button>
                    <button
                      type="button"
                      onClick={() => setRejectingCourse(course)}
                      className="rounded-lg border border-error/30 px-4 py-2.5 text-sm font-bold text-error transition-colors hover:bg-error/10"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )
      )}

      {approveCourse.error && (
        <p role="alert" className="mt-4 rounded-lg bg-error/10 px-4 py-2.5 text-sm font-medium text-error">
          {approveCourse.error.message}
        </p>
      )}

      {rejectingCourse && (
        <RejectModal
          course={rejectingCourse}
          submitting={rejectCourse.isPending}
          error={rejectCourse.error?.message}
          onClose={() => setRejectingCourse(null)}
          onReject={(reason) =>
            rejectCourse.mutate(
              { id: rejectingCourse._id, reason },
              { onSuccess: () => setRejectingCourse(null) }
            )
          }
        />
      )}

      {viewingCourse && (
        <CourseDetailsModal
          course={viewingCourse}
          onClose={() => setViewingCourse(null)}
          actions={
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => approveCourse.mutate(viewingCourse._id, { onSuccess: () => setViewingCourse(null) })}
                disabled={approveCourse.isPending}
                className="flex-1 rounded-lg bg-brand-green px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-brand-green/90 disabled:opacity-60"
              >
                Approve
              </button>
              <button
                type="button"
                onClick={() => {
                  setRejectingCourse(viewingCourse)
                  setViewingCourse(null)
                }}
                className="flex-1 rounded-lg border border-error/30 px-4 py-2.5 text-sm font-bold text-error transition-colors hover:bg-error/10"
              >
                Reject
              </button>
            </div>
          }
        />
      )}
    </DashboardShell>
  )
}

export default AdminPendingCourses
