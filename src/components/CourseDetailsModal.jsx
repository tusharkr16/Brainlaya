import { Modal } from '@/components/ui/modal'
import { useLessons } from '../api/lessons'
import { STATUS_BADGE } from '../lib/constants'

const IMG_BASE = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5001'

const FIELD_LABEL = { title: 'Title', description: 'Description', category: 'Category', price: 'Price', thumbnail: 'Thumbnail' }

function formatValue(field, value) {
  if (field === 'price') return value == null ? 'Free' : `$${value}`
  return value ?? '—'
}

function CourseDetailsModal({ course, onClose, actions }) {
  const { data: lessonsData } = useLessons(course._id)
  const badge = STATUS_BADGE[course.status]
  const lessons = lessonsData?.data || []

  return (
    <Modal open onClose={onClose} className="max-w-2xl max-h-[85vh] overflow-y-auto p-7">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <span className={`mb-2 inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${badge.className}`}>{badge.label}</span>
          <h2 className="text-2xl font-extrabold text-on-surface">{course.title}</h2>
          <p className="mt-1 text-sm text-on-surface-variant">
            by {course.teacherId?.name} ({course.teacherId?.email}) &bull; {course.category}
          </p>
        </div>
      </div>

      {course.thumbnail && (
        <img src={`${IMG_BASE}${course.thumbnail}`} alt="" className="mb-4 h-48 w-full rounded-lg object-cover" />
      )}

      <div className="mb-4 flex items-center gap-4 text-sm text-on-surface-variant">
        <span className="font-semibold text-on-surface">{course.price ? `$${course.price}` : 'Free'}</span>
        <span>{lessons.length} lesson{lessons.length === 1 ? '' : 's'}</span>
        <span>Updated {new Date(course.updatedAt).toLocaleDateString()}</span>
      </div>

      <p className="mb-6 whitespace-pre-line text-sm text-on-surface">{course.description}</p>

      {course.rejectionReason && (
        <p className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <strong>Previous rejection:</strong> {course.rejectionReason}
        </p>
      )}

      {course.pendingChanges && (
        <div className="mb-6">
          <h3 className="mb-2 text-sm font-bold text-on-surface">Proposed changes</h3>
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

      <div>
        <h3 className="mb-2 text-sm font-bold text-on-surface">Curriculum</h3>
        {lessons.length === 0 ? (
          <p className="text-sm text-on-surface-variant">No lessons added yet.</p>
        ) : (
          <ol className="list-inside list-decimal space-y-1 text-sm text-on-surface">
            {lessons.map((l) => (
              <li key={l._id}>{l.title}</li>
            ))}
          </ol>
        )}
      </div>

      {actions && <div className="mt-6 border-t border-surface-dim pt-5">{actions}</div>}
    </Modal>
  )
}

export default CourseDetailsModal
