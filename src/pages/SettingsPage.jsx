import { useState } from 'react'
import DashboardShell from '../components/DashboardShell'
import { api } from '../lib/api'

function LockIcon() {
  return <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="10" width="14" height="10" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></svg>
}
function EyeIcon({ open }) {
  return open ? (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
  ) : (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
  )
}

function PasswordSection() {
  const [current, setCurrent] = useState('')
  const [next, setNext]       = useState('')
  const [confirm, setConfirm] = useState('')
  const [showCurr, setShowCurr] = useState(false)
  const [showNext, setShowNext] = useState(false)
  const [status, setStatus]   = useState(null) // { ok, msg }
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (next !== confirm) return setStatus({ ok: false, msg: 'New passwords do not match.' })
    if (next.length < 8)  return setStatus({ ok: false, msg: 'Password must be at least 8 characters.' })
    setLoading(true)
    setStatus(null)
    try {
      await api.patch('/users/me/password', { currentPassword: current, newPassword: next })
      setStatus({ ok: true, msg: 'Password updated successfully.' })
      setCurrent(''); setNext(''); setConfirm('')
    } catch (err) {
      setStatus({ ok: false, msg: err.message || 'Something went wrong.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-surface-dim bg-surface-container-lowest p-6 space-y-5 max-w-md">
      <div className="flex items-center gap-3 mb-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-secondary"><LockIcon /></span>
        <div>
          <h2 className="font-bold text-on-surface">Change Password</h2>
          <p className="text-xs text-on-surface-variant">Keep your account secure with a strong password.</p>
        </div>
      </div>

      {status && (
        <div className={`rounded-xl px-4 py-3 text-sm font-medium ${status.ok ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
          {status.msg}
        </div>
      )}

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-semibold text-on-surface-variant">Current Password</label>
        <div className="relative">
          <input
            type={showCurr ? 'text' : 'password'}
            value={current}
            onChange={(e) => setCurrent(e.target.value)}
            required
            className="w-full rounded-xl border border-surface-dim bg-white px-4 py-2.5 pr-10 text-sm text-on-surface outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20"
          />
          <button type="button" onClick={() => setShowCurr(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant">
            <EyeIcon open={showCurr} />
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-semibold text-on-surface-variant">New Password</label>
        <div className="relative">
          <input
            type={showNext ? 'text' : 'password'}
            value={next}
            onChange={(e) => setNext(e.target.value)}
            required
            minLength={8}
            className="w-full rounded-xl border border-surface-dim bg-white px-4 py-2.5 pr-10 text-sm text-on-surface outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20"
          />
          <button type="button" onClick={() => setShowNext(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant">
            <EyeIcon open={showNext} />
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-semibold text-on-surface-variant">Confirm New Password</label>
        <input
          type="password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
          className="w-full rounded-xl border border-surface-dim bg-white px-4 py-2.5 text-sm text-on-surface outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-secondary py-2.5 text-sm font-bold text-white hover:opacity-90 disabled:opacity-50 transition-all"
      >
        {loading ? 'Updating…' : 'Update Password'}
      </button>
    </form>
  )
}

function SettingsPage() {
  return (
    <DashboardShell active="Settings">
      <div className="mb-7">
        <h1 className="text-3xl font-extrabold text-on-surface">Settings</h1>
        <p className="mt-1 text-sm text-on-surface-variant">Manage your account preferences.</p>
      </div>
      <div className="space-y-8">
        <PasswordSection />
      </div>
    </DashboardShell>
  )
}

export default SettingsPage
