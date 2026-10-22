import { useState } from 'react'
import { Link } from 'react-router-dom'
import DashboardShell from '../components/DashboardShell'
import { useAuthStore } from '../store/authStore'
import { useUpdateProfile } from '../api/users'
import { api } from '../lib/api'
import { ListFieldEditor, EntryListEditor, inputClass, labelClass } from '../components/ListFieldEditor'

const ROLE_LABEL = { teacher: 'Instructor', student: 'Student', admin: 'Administrator' }
const IMG_BASE = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5001'

const EXPERIENCE_FIELDS = [
  { key: 'title', placeholder: 'Title, e.g. Senior Lecturer' },
  { key: 'place', placeholder: 'Place, e.g. University of Massachusetts' },
  { key: 'period', placeholder: 'Period, e.g. 2018 - Present' },
  { key: 'description', placeholder: 'What you did here...', type: 'textarea' },
]

function ProfilePage() {
  const user = useAuthStore((s) => s.user)
  const isTeacher = user?.role === 'teacher'
  const updateProfile = useUpdateProfile()
  const [name, setName] = useState(user?.name || '')
  const [avatar, setAvatar] = useState(user?.avatar || null)
  const [headline, setHeadline] = useState(user?.headline || '')
  const [bio, setBio] = useState(user?.bio || '')
  const [subjects, setSubjects] = useState(user?.subjects?.length ? user.subjects : [''])
  const [languages, setLanguages] = useState(user?.languages?.length ? user.languages : [''])
  const [location, setLocation] = useState(user?.location || '')
  const [sessionRate, setSessionRate] = useState(user?.sessionRate ?? '')
  const [availability, setAvailability] = useState(user?.availability || '')
  const [teachingExperience, setTeachingExperience] = useState(user?.teachingExperience?.length ? user.teachingExperience : [])
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
    const body = { name, avatar }
    if (isTeacher) {
      Object.assign(body, {
        headline: headline.trim() || null,
        bio: bio.trim() || null,
        subjects: subjects.map((s) => s.trim()).filter(Boolean),
        languages: languages.map((l) => l.trim()).filter(Boolean),
        location: location.trim() || null,
        sessionRate: sessionRate === '' ? null : Number(sessionRate),
        availability: availability.trim() || null,
        teachingExperience: teachingExperience.filter((e) => e.title?.trim() && e.place?.trim() && e.period?.trim()),
      })
    }
    updateProfile.mutate(body, { onSuccess: () => setSaved(true) })
  }

  return (
    <DashboardShell active="Profile">
      <div className="mx-auto max-w-2xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-on-surface">Profile</h1>
            <p className="mt-1 text-on-surface-variant">Manage how you appear across Brainlaya.</p>
          </div>
          {isTeacher && (
            <Link
              to={`/users/${user.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-surface-dim px-4 py-2.5 text-sm font-semibold text-on-surface transition-colors hover:bg-surface-container-low"
            >
              Preview Public Profile
            </Link>
          )}
        </div>

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
                className={inputClass}
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

          {isTeacher && (
            <div className="mt-8 space-y-6 border-t border-surface-dim pt-6">
              <h2 className="text-lg font-bold text-on-surface">Mentor Profile</h2>
              <p className="-mt-4 text-sm text-on-surface-variant">
                This is what students see on your public mentor profile.
              </p>

              <label className="flex flex-col gap-1.5">
                <span className={labelClass}>Headline</span>
                <input
                  type="text"
                  placeholder="e.g. Advanced Mathematics & Physics"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  className={inputClass}
                />
              </label>

              <label className="flex flex-col gap-1.5">
                <span className={labelClass}>About Me</span>
                <textarea
                  rows={5}
                  placeholder="Tell students about your teaching style and experience..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className={`${inputClass} resize-none`}
                />
              </label>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label className="flex flex-col gap-1.5">
                  <span className={labelClass}>Location</span>
                  <input
                    type="text"
                    placeholder="e.g. Boston, MA (Online)"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className={inputClass}
                  />
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className={labelClass}>Session Rate (USD/hr)</span>
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g. 85"
                    value={sessionRate}
                    onChange={(e) => setSessionRate(e.target.value)}
                    className={inputClass}
                  />
                </label>
              </div>

              <ListFieldEditor
                label="Subjects Offered"
                placeholder="e.g. Calculus (I-III)"
                items={subjects}
                onChange={setSubjects}
              />

              <ListFieldEditor
                label="Languages"
                placeholder="e.g. English"
                items={languages}
                onChange={setLanguages}
              />

              <label className="flex flex-col gap-1.5">
                <span className={labelClass}>Availability</span>
                <textarea
                  rows={3}
                  placeholder="Describe your general availability, e.g. Weekday evenings and weekend mornings (ET)..."
                  value={availability}
                  onChange={(e) => setAvailability(e.target.value)}
                  className={`${inputClass} resize-none`}
                />
              </label>

              <EntryListEditor
                label="Teaching Experience"
                items={teachingExperience}
                onChange={setTeachingExperience}
                fields={EXPERIENCE_FIELDS}
                addLabel="Add experience"
              />
            </div>
          )}

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
