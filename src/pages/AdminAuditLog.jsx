import { useState } from 'react'
import DashboardShell from '../components/DashboardShell'
import { useAuditLog } from '../api/admin'
import { LoadingState, ErrorState, EmptyState } from '../components/StateViews'

function AdminAuditLog() {
  const [page, setPage] = useState(1)
  const { data, isPending, isError, error, refetch } = useAuditLog({ page, limit: 30 })
  const entries = data?.data || []
  const meta = data?.meta

  return (
    <DashboardShell active="Audit Log">
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-on-surface">Audit Log</h1>
        <p className="mt-1 text-on-surface-variant">Every admin action, for accountability.</p>
      </div>

      {isPending && <LoadingState />}
      {isError && <ErrorState message={error.message} onRetry={refetch} />}

      {!isPending && !isError && (
        entries.length === 0 ? (
          <EmptyState title="No admin actions recorded yet" />
        ) : (
          <>
            <ul className="divide-y divide-surface-dim rounded-xl border border-surface-dim bg-surface-container-lowest">
              {entries.map((entry) => (
                <li key={entry._id} className="flex items-center justify-between gap-4 p-4">
                  <div>
                    <p className="text-sm font-semibold text-on-surface">
                      {entry.actorId?.name} <span className="font-normal text-on-surface-variant">— {entry.action}</span>
                    </p>
                    <p className="text-xs text-on-surface-variant">
                      {entry.targetType} #{String(entry.targetId).slice(-6)}
                      {entry.meta ? ` — ${JSON.stringify(entry.meta)}` : ''}
                    </p>
                  </div>
                  <span className="shrink-0 text-xs text-on-surface-variant">{new Date(entry.timestamp).toLocaleString()}</span>
                </li>
              ))}
            </ul>

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
    </DashboardShell>
  )
}

export default AdminAuditLog
