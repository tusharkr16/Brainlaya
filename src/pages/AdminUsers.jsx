import { useState } from 'react'
import DashboardShell from '../components/DashboardShell'
import { Modal } from '@/components/ui/modal'
import { useAdminUsers, useSuspendUser, useReactivateUser, useChangeUserRole, useResetUser } from '../api/admin'
import { LoadingState, ErrorState, EmptyState } from '../components/StateViews'
import { useAuthStore } from '../store/authStore'

const ROLE_OPTIONS = ['student', 'teacher', 'admin']

function ResetUserModal({ user, onClose }) {
  const resetUser = useResetUser()
  const [confirmEmail, setConfirmEmail] = useState('')
  const [result, setResult] = useState(null)

  const matches = confirmEmail.trim().toLowerCase() === user.email.toLowerCase()

  const handleSubmit = (e) => {
    e.preventDefault()
    resetUser.mutate({ id: user._id, confirmEmail }, { onSuccess: (res) => setResult(res.data.tempPassword) })
  }

  return (
    <Modal open onClose={onClose} className="max-w-md p-7">
      {result ? (
        <div>
          <h3 className="mb-2 text-xl font-bold text-on-surface">Reset complete</h3>
          <p className="mb-4 text-sm text-on-surface-variant">
            {user.name}&apos;s password was changed and every session was revoked. Share this temporary password securely —
            it won&apos;t be shown again.
          </p>
          <p className="select-all rounded-lg border border-surface-dim bg-surface-container-low px-4 py-3 text-center font-mono text-sm font-bold text-on-surface">
            {result}
          </p>
          <button type="button" onClick={onClose} className="mt-5 w-full rounded-lg bg-secondary py-2.5 text-sm font-bold text-white hover:bg-secondary-hover">
            Done
          </button>
        </div>
      ) : (
        <div>
          <h3 className="mb-1 text-xl font-bold text-on-surface">Reset this user</h3>
          <p className="mb-5 text-sm text-on-surface-variant">
            This sets a new temporary password for <strong>{user.name}</strong> and signs them out everywhere. It does not
            touch their courses or enrollments. Type <span className="font-mono font-bold text-on-surface">{user.email}</span> to confirm.
          </p>
          {resetUser.error && <p className="mb-4 rounded-lg bg-error/10 px-4 py-2.5 text-sm font-medium text-error">{resetUser.error.message}</p>}
          <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
            <input
              type="email"
              required
              autoFocus
              placeholder={user.email}
              value={confirmEmail}
              onChange={(e) => setConfirmEmail(e.target.value)}
              className="rounded-lg border border-surface-dim px-4 py-2.5 text-sm text-on-surface outline-none focus:border-secondary"
            />
            <button
              type="submit"
              disabled={!matches || resetUser.isPending}
              className="rounded-lg bg-error px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-error/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {resetUser.isPending ? 'Resetting…' : 'Reset User'}
            </button>
          </form>
        </div>
      )}
    </Modal>
  )
}

function AdminUsers() {
  const currentUser = useAuthStore((s) => s.user)
  const [role, setRole] = useState('')
  const [q, setQ] = useState('')
  const [page, setPage] = useState(1)
  const { data, isPending, isError, error, refetch } = useAdminUsers({ role, q, page, limit: 20 })
  const suspendUser = useSuspendUser()
  const reactivateUser = useReactivateUser()
  const changeRole = useChangeUserRole()
  const [resettingUser, setResettingUser] = useState(null)

  const users = data?.data || []
  const meta = data?.meta
  const mutationError = suspendUser.error || reactivateUser.error || changeRole.error

  return (
    <DashboardShell active="Users">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-on-surface">Users</h1>
          <p className="mt-1 text-on-surface-variant">Manage teachers, students, and admins.</p>
        </div>
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Search name or email..."
            value={q}
            onChange={(e) => {
              setPage(1)
              setQ(e.target.value)
            }}
            className="rounded-lg border border-surface-dim bg-surface-container-lowest px-4 py-2.5 text-sm outline-none focus:border-secondary"
          />
          <select
            value={role}
            onChange={(e) => {
              setPage(1)
              setRole(e.target.value)
            }}
            className="rounded-lg border border-surface-dim bg-surface-container-lowest px-4 py-2.5 text-sm outline-none focus:border-secondary"
          >
            <option value="">All roles</option>
            {ROLE_OPTIONS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
      </div>

      {mutationError && (
        <p role="alert" className="mb-4 rounded-lg bg-error/10 px-4 py-2.5 text-sm font-medium text-error">
          {mutationError.message}
        </p>
      )}

      {isPending && <LoadingState />}
      {isError && <ErrorState message={error.message} onRetry={refetch} />}

      {!isPending && !isError && (
        users.length === 0 ? (
          <EmptyState title="No users found" />
        ) : (
          <>
            <div className="overflow-x-auto rounded-xl border border-surface-dim bg-surface-container-lowest">
              <table className="w-full text-left">
                <thead className="bg-surface-container-low text-xs font-semibold tracking-wide text-on-surface-variant uppercase">
                  <tr>
                    <th className="px-5 py-3">Name</th>
                    <th className="px-5 py-3">Role</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-dim">
                  {users.map((u) => (
                    <tr key={u._id}>
                      <td className="px-5 py-4">
                        <p className="font-semibold text-on-surface">{u.name}</p>
                        <p className="text-xs text-on-surface-variant">{u.email}</p>
                      </td>
                      <td className="px-5 py-4">
                        <select
                          value={u.role}
                          disabled={u._id === currentUser.id || changeRole.isPending}
                          onChange={(e) => changeRole.mutate({ id: u._id, role: e.target.value })}
                          className="rounded-lg border border-surface-dim bg-surface px-2.5 py-1.5 text-sm outline-none focus:border-secondary disabled:opacity-50"
                        >
                          {ROLE_OPTIONS.map((r) => (
                            <option key={r} value={r}>
                              {r}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={
                            u.status === 'active'
                              ? 'inline-flex items-center rounded-full bg-brand-green/15 px-3 py-1 text-xs font-semibold text-brand-green'
                              : 'inline-flex items-center rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700'
                          }
                        >
                          {u.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          {u.status === 'active' ? (
                            <button
                              type="button"
                              onClick={() => suspendUser.mutate(u._id)}
                              disabled={u._id === currentUser.id || suspendUser.isPending}
                              className="rounded-lg border border-surface-dim px-3 py-1.5 text-xs font-semibold text-on-surface transition-colors hover:bg-surface-container-low disabled:opacity-50"
                            >
                              Suspend
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => reactivateUser.mutate(u._id)}
                              disabled={reactivateUser.isPending}
                              className="rounded-lg border border-surface-dim px-3 py-1.5 text-xs font-semibold text-on-surface transition-colors hover:bg-surface-container-low disabled:opacity-50"
                            >
                              Reactivate
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => setResettingUser(u)}
                            className="rounded-lg border border-error/30 px-3 py-1.5 text-xs font-semibold text-error transition-colors hover:bg-error/10"
                          >
                            Reset
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
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

      {resettingUser && <ResetUserModal user={resettingUser} onClose={() => setResettingUser(null)} />}
    </DashboardShell>
  )
}

export default AdminUsers
