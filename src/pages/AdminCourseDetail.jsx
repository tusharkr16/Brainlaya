import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import DashboardShell from '../components/DashboardShell'
import { Modal } from '@/components/ui/modal'
import { useCourse } from '../api/courses'
import { useApproveCourse, useRejectCourse, useArchiveCourse } from '../api/admin'
import { useLessons } from '../api/lessons'
import { LoadingState, ErrorState } from '../components/StateViews'
import { STATUS_BADGE } from '../lib/constants'

const IMG_BASE = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5001'

const FIELD_LABEL = {
  title: 'Title',
  description: 'Description',
  category: 'Category',
  price: 'Price',
  thumbnail: 'Thumbnail',
  outcomes: "What you'll learn",
  requirements: 'Requirements',
}

function formatValue(field, value) {
  if (field === 'price') return value == null ? 'Free' : `$${value}`
  if (Array.isArray(value)) return value.length ? value.join('; ') : '—'
  return value ?? '—'
}

function CheckCircleIcon() {
  return (
    <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-brand-green">
      <circle cx="10" cy="10" r="7.5" />
      <path d="m7 10 2 2 4-4" />
    </svg>
  )
}

function RejectModal({ course, onClose }) {
  const rejectCourse = useRejectCourse()
  const [reason, setReason] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    rejectCourse.mutate({ id: course._id, reason }, { onSuccess: onClose })
  }

  return (
    <Modal open onClose={onClose} className="max-w-md p-7">
      <h3 className="mb-1 text-xl font-bold text-on-surface">Reject changes</h3>
      <p className="mb-5 text-sm text-on-surface-variant">
        For &ldquo;{course.title}&rdquo; — the teacher will see this reason.
      </p>
      {rejectCourse.error && (
        <p className="mb-4 rounded-lg bg-error/10 px-4 py-2.5 text-sm font-medium text-error">{rejectCourse.error.message}</p>
      )}
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
          disabled={rejectCourse.isPending}
          className="rounded-lg bg-error px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-error/90 disabled:opacity-60"
        >
          {rejectCourse.isPending ? 'Rejecting…' : 'Reject'}
        </button>
      </form>
    </Modal>
  )
}

function AdminCourseDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data, isPending, isError, error, refetch } = useCourse(id)
  const { data: lessonsData } = useLessons(id)
  const approveCourse = useApproveCourse()
  const archiveCourse = useArchiveCourse()
  const [rejecting, setRejecting] = useState(false)

  if (isPending) return <DashboardShell active="All Courses"><LoadingState /></DashboardShell>
  if (isError) return <DashboardShell active="All Courses"><ErrorState message={error.message} onRetry={refetch} /></DashboardShell>

  const course = data.data
  const lessons = lessonsData?.data || []
  const badge = STATUS_BADGE[course.status]
  const canReview = course.status === 'pending_approval' || Boolean(course.pendingChanges)

  return (
    <DashboardShell active="All Courses">
      <Link to="/admin/courses" className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-secondary hover:underline">
        ← Back to All Courses
      </Link>

      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <span className={`mb-2 inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${badge.className}`}>{badge.label}</span>
          <h1 className="text-2xl font-extrabold text-on-surface">{course.title}</h1>
          <p className="mt-1 text-on-surface-variant">
            by {course.teacherId?.name} ({course.teacherId?.email}) &bull; {course.category}
          </p>
        </div>

        {canReview && (
          <div className="flex gap-3">
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
              onClick={() => setRejecting(true)}
              className="rounded-lg border border-error/30 px-4 py-2.5 text-sm font-bold text-error transition-colors hover:bg-error/10"
            >
              Reject
            </button>
          </div>
        )}
        {course.status === 'approved' && !course.pendingChanges && (
          <button
            type="button"
            onClick={() => archiveCourse.mutate(course._id)}
            disabled={archiveCourse.isPending}
            className="rounded-lg border border-surface-dim px-4 py-2.5 text-sm font-semibold text-on-surface transition-colors hover:bg-surface-container-low"
          >
            Archive
          </button>
        )}
      </div>

      {approveCourse.error && (
        <p role="alert" className="mb-4 rounded-lg bg-error/10 px-4 py-2.5 text-sm font-medium text-error">{approveCourse.error.message}</p>
      )}

      {course.rejectionReason && (
        <p className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <strong>Previous rejection:</strong> {course.rejectionReason}
        </p>
      )}

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="lg:col-span-7">
          {course.thumbnail && (
            <img src={`${IMG_BASE}${course.thumbnail}`} alt="" className="mb-6 h-56 w-full rounded-xl object-cover" />
          )}

          <div className="mb-8">
            <h2 className="mb-3 text-lg font-bold text-on-surface">About this Course</h2>
            <div className="rounded-xl border border-surface-dim bg-surface-container-lowest p-6">
              <p className="whitespace-pre-line text-on-surface-variant">{course.description}</p>
            </div>
          </div>

          {course.outcomes?.length > 0 && (
            <div className="mb-8">
              <h2 className="mb-3 text-lg font-bold text-on-surface">What You&apos;ll Learn</h2>
              <div className="grid grid-cols-1 gap-3 rounded-xl border border-surface-dim bg-surface-container-lowest p-6 sm:grid-cols-2">
                {course.outcomes.map((o) => (
                  <div key={o} className="flex items-start gap-2.5 text-sm text-on-surface-variant">
                    <CheckCircleIcon />
                    {o}
                  </div>
                ))}
              </div>
            </div>
          )}

          {course.requirements?.length > 0 && (
            <div className="mb-8">
              <h2 className="mb-3 text-lg font-bold text-on-surface">Requirements</h2>
              <ul className="rounded-xl border border-surface-dim bg-surface-container-lowest p-6">
                {course.requirements.map((r) => (
                  <li key={r} className="flex items-start gap-2.5 text-sm text-on-surface-variant [&:not(:last-child)]:mb-2.5">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-outline" />
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div>
            <h2 className="mb-3 text-lg font-bold text-on-surface">Curriculum</h2>
            {lessons.length === 0 ? (
              <p className="rounded-xl border border-dashed border-surface-dim bg-surface-container-lowest p-6 text-sm text-on-surface-variant">
                No lessons added yet.
              </p>
            ) : (
              <ol className="list-inside list-decimal space-y-1.5 rounded-xl border border-surface-dim bg-surface-container-lowest p-6 text-sm text-on-surface">
                {lessons.map((l) => (
                  <li key={l._id}>{l.title}</li>
                ))}
              </ol>
            )}
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="space-y-6 lg:sticky lg:top-6">
            <div className="rounded-xl border border-surface-dim bg-surface-container-lowest p-6">
              <h4 className="mb-3 text-sm font-bold text-on-surface">Details</h4>
              <ul className="space-y-2.5 text-sm text-on-surface-variant">
                <li className="flex justify-between"><span>Price</span><span className="font-semibold text-on-surface">{course.price ? `$${course.price}` : 'Free'}</span></li>
                <li className="flex justify-between"><span>Lessons</span><span className="font-semibold text-on-surface">{lessons.length}</span></li>
                <li className="flex justify-between"><span>Enrolled</span><span className="font-semibold text-on-surface">{course.enrollmentCount ?? 0}</span></li>
                <li className="flex justify-between"><span>Updated</span><span className="font-semibold text-on-surface">{new Date(course.updatedAt).toLocaleDateString()}</span></li>
              </ul>
            </div>

            {course.pendingChanges && (
              <div>
                <h4 className="mb-3 text-sm font-bold text-on-surface">Proposed changes</h4>
                <div className="overflow-hidden rounded-lg border border-secondary/30">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-accent-design text-xs font-semibold text-secondary uppercase">
                      <tr>
                        <th className="px-3 py-2">Field</th>
                        <th className="px-3 py-2">Current</th>
                        <th className="px-3 py-2">Proposed</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-surface-dim">
                      {Object.entries(course.pendingChanges).map(([field, value]) => (
                        <tr key={field}>
                          <td className="px-3 py-2 font-semibold text-on-surface">{FIELD_LABEL[field] || field}</td>
                          <td className="px-3 py-2 text-on-surface-variant">{formatValue(field, course[field])}</td>
                          <td className="px-3 py-2 text-secondary">{formatValue(field, value)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {rejecting && <RejectModal course={course} onClose={() => { setRejecting(false); navigate('/admin/courses/pending') }} />}
    </DashboardShell>
  )
}

export default AdminCourseDetail
