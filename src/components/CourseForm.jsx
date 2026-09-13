import { useState } from 'react'
import { CATEGORIES } from '../lib/constants'
import { api } from '../lib/api'

function ChevronDownIcon() {
  return (
    <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-on-surface-variant">
      <path d="m5 7.5 5 5 5-5" />
    </svg>
  )
}

function UploadIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 15V3M7 8l5-5 5 5" />
      <path d="M4 15v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" />
    </svg>
  )
}

const inputClass =
  'w-full rounded-lg border border-surface-dim bg-surface-container-lowest px-4 py-2.5 text-sm text-on-surface placeholder:text-on-surface-variant/60 outline-none focus:border-secondary focus:ring-4 focus:ring-secondary/15'
const selectClass = `${inputClass} appearance-none pr-10`
const labelClass = 'block text-sm font-medium text-on-surface'

// Shared by "create course" and the teacher's course-detail edit tab. Owns
// the thumbnail upload (multer route) so both callers get it for free.
function CourseForm({ initial, submitLabel, onSubmit, submitting, error, onCancel, freeToggle = true }) {
  const [form, setForm] = useState({
    title: initial?.title || '',
    category: initial?.category || '',
    description: initial?.description || '',
    price: initial?.price ?? '',
    thumbnail: initial?.thumbnail || null,
  })
  const [uploading, setUploading] = useState(false)
  const [isFree, setIsFree] = useState(initial ? initial.price == null : false)

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))

  const handleThumbnail = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await api.upload('/uploads', fd)
      setForm((f) => ({ ...f, thumbnail: res.data.url }))
    } catch {
      // upload errors surface via the disabled state clearing; form still submittable without a thumbnail
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({
      title: form.title.trim(),
      category: form.category,
      description: form.description.trim(),
      price: isFree ? null : Number(form.price) || 0,
      thumbnail: form.thumbnail || null,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="overflow-hidden rounded-xl border border-surface-dim bg-surface-container-lowest shadow-[var(--shadow-card-sm)]">
      <div className="space-y-6 p-6 sm:p-8">
        {error && (
          <p role="alert" className="rounded-lg bg-error/10 px-4 py-2.5 text-sm font-medium text-error">
            {error}
          </p>
        )}

        <div className="space-y-1.5">
          <label className={labelClass} htmlFor="title">
            Course Title *
          </label>
          <input
            id="title"
            type="text"
            required
            minLength={3}
            placeholder="e.g. Advanced Calculus & Analytic Geometry"
            value={form.title}
            onChange={update('title')}
            className={inputClass}
          />
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-1.5">
            <label className={labelClass} htmlFor="category">
              Category *
            </label>
            <div className="relative">
              <select id="category" required value={form.category} onChange={update('category')} className={selectClass}>
                <option value="" disabled>
                  Select Category
                </option>
                {CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <ChevronDownIcon />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className={labelClass} htmlFor="price">
              Price (USD)
            </label>
            <div className="flex items-center gap-3">
              <input
                id="price"
                type="number"
                min="0"
                disabled={isFree}
                required={!isFree}
                placeholder="e.g. 89"
                value={isFree ? '' : form.price}
                onChange={update('price')}
                className={`${inputClass} disabled:opacity-50`}
              />
              {freeToggle && (
                <label className="flex shrink-0 items-center gap-2 text-xs font-semibold text-on-surface-variant">
                  <input type="checkbox" checked={isFree} onChange={(e) => setIsFree(e.target.checked)} className="h-4 w-4 rounded border-surface-dim" />
                  Free
                </label>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className={labelClass} htmlFor="description">
            Description *
          </label>
          <textarea
            id="description"
            required
            minLength={10}
            rows={4}
            placeholder="Give students a quick summary of what they'll learn..."
            value={form.description}
            onChange={update('description')}
            className={`${inputClass} resize-none`}
          />
        </div>

        <div className="space-y-1.5">
          <span className={labelClass}>Course Thumbnail</span>
          {form.thumbnail ? (
            <div className="relative overflow-hidden rounded-lg border border-surface-dim">
              <img src={`${import.meta.env.VITE_SOCKET_URL || 'http://localhost:5001'}${form.thumbnail}`} alt="" className="h-40 w-full object-cover" />
              <button
                type="button"
                onClick={() => setForm((f) => ({ ...f, thumbnail: null }))}
                className="absolute top-2 right-2 rounded-full bg-black/60 px-2.5 py-1 text-xs font-semibold text-white"
              >
                Remove
              </button>
            </div>
          ) : (
            <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-surface-dim bg-surface-container-low px-6 py-10 text-center transition-colors hover:bg-surface-container-high">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-container-lowest text-secondary">
                <UploadIcon />
              </span>
              <p className="text-sm font-semibold text-on-surface">{uploading ? 'Uploading…' : 'Click to upload or drag and drop'}</p>
              <p className="text-xs text-on-surface-variant">PNG, JPG or WEBP, up to 50MB</p>
              <input type="file" accept="image/*" onChange={handleThumbnail} className="hidden" disabled={uploading} />
            </label>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-3 border-t border-surface-dim p-6 sm:p-8">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-surface-dim px-5 py-2.5 text-sm font-semibold text-on-surface transition-colors hover:bg-surface-container-low"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={submitting || uploading}
          className="rounded-lg bg-secondary px-5 py-2.5 text-sm font-bold text-white shadow-[var(--shadow-card-sm)] transition-colors hover:bg-secondary-hover disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? 'Saving…' : submitLabel}
        </button>
      </div>
    </form>
  )
}

export default CourseForm
