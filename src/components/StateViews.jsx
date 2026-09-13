function SpinnerIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" className="animate-spin text-secondary" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.5" strokeOpacity="0.2" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  )
}

export function LoadingState({ label = 'Loading…' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-surface-dim bg-surface-container-lowest p-16 text-center">
      <SpinnerIcon />
      <p className="text-sm text-on-surface-variant">{label}</p>
    </div>
  )
}

export function EmptyState({ title = 'Nothing here yet', description, action }) {
  return (
    <div className="rounded-2xl border border-dashed border-surface-dim bg-surface-container-lowest p-16 text-center">
      <p className="font-semibold text-on-surface">{title}</p>
      {description && <p className="mt-1 text-sm text-on-surface-variant">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}

export function ErrorState({ message = 'Something went wrong.', onRetry }) {
  return (
    <div className="rounded-2xl border border-error/30 bg-error/5 p-10 text-center">
      <p className="font-semibold text-error">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 rounded-lg border border-error/30 px-4 py-2 text-sm font-semibold text-error transition-colors hover:bg-error/10"
        >
          Try again
        </button>
      )}
    </div>
  )
}

// Drop-in wrapper for a React Query result: picks the right state view, or
// renders children when data is ready. Keeps every screen's loading/empty/
// error handling identical instead of hand-rolled per page.
export function QueryState({ query, empty, emptyProps, children }) {
  if (query.isPending) return <LoadingState />
  if (query.isError) return <ErrorState message={query.error?.message} onRetry={query.refetch} />
  if (empty && empty(query.data)) return <EmptyState {...emptyProps} />
  return children(query.data)
}
