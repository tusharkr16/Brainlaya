import { useState } from 'react'
import { Link } from 'react-router-dom'
import DashboardShell from '../components/DashboardShell'
import CourseDetailsModal from '../components/CourseDetailsModal'
import { useAdminCourses, useArchiveCourse } from '../api/admin'
import { useDeleteCourse } from '../api/courses'
import { LoadingState, ErrorState, EmptyState } from '../components/StateViews'
import { STATUS_BADGE } from '../lib/constants'

function AdminCourses() {
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(1)
  const { data, isPending, isError, error, refetch } = useAdminCourses({ status, page, limit: 20 })
  const archiveCourse = useArchiveCourse()
  const deleteCourse = useDeleteCourse()
  const [confirmDeleteId, setConfirmDeleteId] = useState(null)
  const [viewingCourse, setViewingCourse] = useState(null)

  const courses = data?.data || []
  const meta = data?.meta

  const handleDelete = (id) => {
    if (confirmDeleteId !== id) return setConfirmDeleteId(id)
    deleteCourse.mutate({ id, force: true }, { onSettled: () => setConfirmDeleteId(null) })
  }

  return (
    <DashboardShell active="All Courses">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-on-surface">All Courses</h1>
          <p className="mt-1 text-on-surface-variant">Every course on the platform, regardless of status.</p>
        </div>
        <select
          value={status}
          onChange={(e) => {
            setPage(1)
            setStatus(e.target.value)
          }}
          className="rounded-lg border border-surface-dim bg-surface-container-lowest px-4 py-2.5 text-sm outline-none focus:border-secondary"
        >
          <option value="">All statuses</option>
          {Object.entries(STATUS_BADGE).map(([key, meta]) => (
            <option key={key} value={key}>
              {meta.label}
            </option>
          ))}
        </select>
      </div>

      {isPending && <LoadingState />}
      {isError && <ErrorState message={error.message} onRetry={refetch} />}
      {(archiveCourse.error || deleteCourse.error) && (
        <p role="alert" className="mb-4 rounded-lg bg-error/10 px-4 py-2.5 text-sm font-medium text-error">
          {(archiveCourse.error || deleteCourse.error).message}
        </p>
      )}

      {!isPending && !isError && (
        courses.length === 0 ? (
          <EmptyState title="No courses found" />
        ) : (
          <>
            <div className="overflow-hidden rounded-xl border border-surface-dim bg-surface-container-lowest">
              <table className="w-full text-left">
                <thead className="bg-surface-container-low text-xs font-semibold tracking-wide text-on-surface-variant uppercase">
                  <tr>
                    <th className="px-5 py-3">Course</th>
                    <th className="px-5 py-3">Teacher</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-dim">
                  {courses.map((course) => {
                    const badge = STATUS_BADGE[course.status]
                    return (
                      <tr key={course._id}>
                        <td className="px-5 py-4">
                          <button type="button" onClick={() => setViewingCourse(course)} className="text-left">
                            <p className="font-semibold text-on-surface hover:underline">{course.title}</p>
                            <p className="text-xs text-on-surface-variant">{course.category}</p>
                          </button>
                        </td>
                        <td className="px-5 py-4 text-sm text-on-surface">{course.teacherId?.name}</td>
                        <td className="px-5 py-4">
                          <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${badge.className}`}>{badge.label}</span>
                        </td>
                        <td className="px-5 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            {course.status !== 'archived' && (
                              <button
                                type="button"
                                onClick={() => archiveCourse.mutate(course._id)}
                                disabled={archiveCourse.isPending}
                                className="rounded-lg border border-surface-dim px-3 py-1.5 text-xs font-semibold text-on-surface transition-colors hover:bg-surface-container-low disabled:opacity-60"
                              >
                                Archive
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => handleDelete(course._id)}
                              disabled={deleteCourse.isPending}
                              className="rounded-lg border border-error/30 px-3 py-1.5 text-xs font-semibold text-error transition-colors hover:bg-error/10 disabled:opacity-60"
                            >
                              {confirmDeleteId === course._id ? 'Confirm?' : 'Delete'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {meta && meta.totalPages > 1 && (
              <div className="mt-6 flex items-center justify-center gap-3">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="rounded-lg border border-surface-dim px-4 py-2 text-sm font-semibold text-on-surface disabled:opacity-40"
                >
                  Previous
                </button>
                <span className="text-sm text-on-surface-variant">
                  Page {meta.page} of {meta.totalPages}
                </span>
                <button
                  type="button"
                  disabled={page >= meta.totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="rounded-lg border border-surface-dim px-4 py-2 text-sm font-semibold text-on-surface disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )
      )}

      <p className="mt-6 text-xs text-on-surface-variant">
        Looking for what needs a decision? Head to the{' '}
        <Link to="/admin/courses/pending" className="font-semibold text-secondary hover:underline">
          approval queue
        </Link>
        .
      </p>

      {viewingCourse && <CourseDetailsModal course={viewingCourse} onClose={() => setViewingCourse(null)} />}
    </DashboardShell>
  )
}

export default AdminCourses
