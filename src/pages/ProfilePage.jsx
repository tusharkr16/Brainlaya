import { useState } from 'react'
import DashboardShell from '../components/DashboardShell'
import { useAuthStore } from '../store/authStore'
import { useUpdateProfile } from '../api/users'
import { api } from '../lib/api'

const ROLE_LABEL = { teacher: 'Instructor', student: 'Student', admin: 'Administrator' }
const IMG_BASE = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5001'

function ProfilePage() {
  const user = useAuthStore((s) => s.user)
  const updateProfile = useUpdateProfile()
  const [name, setName] = useState(user?.name || '')
  const [avatar, setAvatar] = useState(user?.avatar || null)
  const [uploading, setUploading] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleAvatar = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await api.upload('/uploads', fd)
      setAvatar(res.data.url)
    } catch {
      // ignore, avatar stays unset
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setSaved(false)
    updateProfile.mutate({ name, avatar }, { onSuccess: () => setSaved(true) })
  }

  return (
    <DashboardShell active="Profile">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-3xl font-extrabold text-on-surface">Profile</h1>
        <p className="mt-1 text-on-surface-variant">Manage how you appear across Brainlaya.</p>

        <form onSubmit={handleSubmit} className="mt-6 rounded-xl border border-surface-dim bg-surface-container-lowest p-6 sm:p-8">
          {updateProfile.error && (
            <p role="alert" className="mb-4 rounded-lg bg-error/10 px-4 py-2.5 text-sm font-medium text-error">
              {updateProfile.error.message}
            </p>
          )}
          {saved && (
            <p className="mb-4 rounded-lg bg-brand-green/10 px-4 py-2.5 text-sm font-medium text-brand-green">Profile updated.</p>
          )}

          <div className="mb-6 flex items-center gap-4">
            {avatar ? (
              <img src={`${IMG_BASE}${avatar}`} alt="" className="h-16 w-16 rounded-full object-cover" />
            ) : (
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-accent-design text-xl font-bold text-secondary">
                {name?.[0]?.toUpperCase()}
              </span>
            )}
            <label className="cursor-pointer rounded-lg border border-surface-dim px-4 py-2 text-sm font-semibold text-on-surface transition-colors hover:bg-surface-container-low">
              {uploading ? 'Uploading…' : 'Change photo'}
              <input type="file" accept="image/*" onChange={handleAvatar} className="hidden" disabled={uploading} />
            </label>
          </div>

          <div className="space-y-4">
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-on-surface">Full name</span>
              <input
                type="text"
                required
                minLength={2}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="rounded-lg border border-surface-dim bg-surface px-4 py-2.5 text-sm outline-none focus:border-secondary"
              />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-on-surface">Email</span>
              <input
                type="email"
                disabled
                value={user?.email}
                className="rounded-lg border border-surface-dim bg-surface-container-low px-4 py-2.5 text-sm text-on-surface-variant"
              />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-on-surface">Role</span>
              <input
                disabled
                value={ROLE_LABEL[user?.role]}
                className="rounded-lg border border-surface-dim bg-surface-container-low px-4 py-2.5 text-sm text-on-surface-variant"
              />
            </label>
          </div>

          <button
            type="submit"
            disabled={updateProfile.isPending || uploading}
            className="mt-6 rounded-lg bg-secondary px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-secondary-hover disabled:opacity-60"
          >
            {updateProfile.isPending ? 'Saving…' : 'Save Changes'}
          </button>
        </form>
      </div>
    </DashboardShell>
  )
}

export default ProfilePage
