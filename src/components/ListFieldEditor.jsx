export const inputClass =
  'w-full rounded-lg border border-surface-dim bg-surface-container-lowest px-4 py-2.5 text-sm text-on-surface placeholder:text-on-surface-variant/60 outline-none focus:border-secondary focus:ring-4 focus:ring-secondary/15'
export const selectClass = `${inputClass} appearance-none pr-10`
export const labelClass = 'block text-sm font-medium text-on-surface'

function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M12 5v14M5 12h14" />
    </svg>
  )
}

function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m-8 0 1 12a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1l1-12" />
    </svg>
  )
}

// Shared editor for a simple list-of-strings field (outcomes, requirements, subjects).
export function ListFieldEditor({ label, placeholder, items, onChange }) {
  const update = (i, value) => onChange(items.map((item, idx) => (idx === i ? value : item)))
  const remove = (i) => onChange(items.filter((_, idx) => idx !== i))
  const add = () => onChange([...items, ''])

  return (
    <div className="space-y-1.5">
      <span className={labelClass}>{label}</span>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <input
              type="text"
              placeholder={placeholder}
              value={item}
              onChange={(e) => update(i, e.target.value)}
              className={inputClass}
            />
            <button
              type="button"
              onClick={() => remove(i)}
              aria-label="Remove"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-on-surface-variant transition-colors hover:bg-error/10 hover:text-error"
            >
              <TrashIcon />
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={add}
        className="flex items-center gap-1.5 text-sm font-semibold text-secondary hover:underline"
      >
        <PlusIcon />
        Add item
      </button>
    </div>
  )
}

// Repeatable structured-entry editor (teaching experience: title/place/period/description).
export function EntryListEditor({ label, items, onChange, fields, addLabel = 'Add item' }) {
  const update = (i, key, value) => onChange(items.map((item, idx) => (idx === i ? { ...item, [key]: value } : item)))
  const remove = (i) => onChange(items.filter((_, idx) => idx !== i))
  const add = () => onChange([...items, Object.fromEntries(fields.map((f) => [f.key, '']))])

  return (
    <div className="space-y-1.5">
      <span className={labelClass}>{label}</span>
      <div className="space-y-3">
        {items.map((item, i) => (
          <div key={i} className="rounded-lg border border-surface-dim p-4">
            <div className="mb-2 flex items-start justify-between gap-2">
              <div className="grid flex-1 grid-cols-1 gap-2.5 sm:grid-cols-2">
                {fields.map((f) =>
                  f.type === 'textarea' ? (
                    <textarea
                      key={f.key}
                      rows={2}
                      placeholder={f.placeholder}
                      value={item[f.key] || ''}
                      onChange={(e) => update(i, f.key, e.target.value)}
                      className={`${inputClass} resize-none sm:col-span-2`}
                    />
                  ) : (
                    <input
                      key={f.key}
                      type="text"
                      placeholder={f.placeholder}
                      value={item[f.key] || ''}
                      onChange={(e) => update(i, f.key, e.target.value)}
                      className={inputClass}
                    />
                  )
                )}
              </div>
              <button
                type="button"
                onClick={() => remove(i)}
                aria-label="Remove"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-on-surface-variant transition-colors hover:bg-error/10 hover:text-error"
              >
                <TrashIcon />
              </button>
            </div>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={add}
        className="flex items-center gap-1.5 text-sm font-semibold text-secondary hover:underline"
      >
        <PlusIcon />
        {addLabel}
      </button>
    </div>
  )
}
