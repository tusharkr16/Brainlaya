import { Link, useParams } from 'react-router-dom'
import { useTeacherProfile } from '../api/users'
import { LoadingState, ErrorState } from '../components/StateViews'

const IMG_BASE = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5001'

function LocationIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 21s7-6.3 7-11.5A7 7 0 0 0 5 9.5C5 14.7 12 21 12 21Z" />
      <circle cx="12" cy="9.5" r="2.5" />
    </svg>
  )
}

function LanguageIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a14 14 0 0 1 0 18 14 14 0 0 1 0-18Z" />
    </svg>
  )
}

function MessageIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 5h16v11H8l-4 4V5Z" />
    </svg>
  )
}

const SUBJECT_COLORS = [
  'bg-[#e5edfd] text-[#2563eb]',
  'bg-[#dcede9] text-[#1d4e43]',
  'bg-[#ede4fd] text-[#7c3aed]',
  'bg-[#fbe2e8] text-[#be123c]',
]

function MentorProfile() {
  const { id } = useParams()
  const { data, isPending, isError, error, refetch } = useTeacherProfile(id)

  if (isPending) return <div className="mx-auto max-w-5xl px-8 py-16"><LoadingState /></div>
  if (isError) return <div className="mx-auto max-w-5xl px-8 py-16"><ErrorState message={error.message} onRetry={refetch} /></div>

  const mentor = data.data

  return (
    <div className="bg-surface px-8 py-10 max-lg:px-5">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex flex-col gap-6 rounded-2xl border border-surface-dim bg-surface-container-lowest p-6 sm:flex-row sm:items-center">
          {mentor.avatar ? (
            <img src={`${IMG_BASE}${mentor.avatar}`} alt="" className="h-24 w-24 shrink-0 rounded-xl object-cover" />
          ) : (
            <span className="flex h-24 w-24 shrink-0 items-center justify-center rounded-xl bg-accent-design text-3xl font-bold text-secondary">
              {mentor.name?.[0]?.toUpperCase()}
            </span>
          )}
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-extrabold text-on-surface">{mentor.name}</h1>
            {mentor.headline && <p className="mt-0.5 font-semibold text-secondary">{mentor.headline}</p>}
            {mentor.bio && <p className="mt-2 line-clamp-2 text-sm text-on-surface-variant">{mentor.bio}</p>}

            <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-on-surface-variant">
              {mentor.languages?.length > 0 && (
                <span className="flex items-center gap-1.5">
                  <LanguageIcon />
                  {mentor.languages.join(', ')}
                </span>
              )}
              {mentor.location && (
                <span className="flex items-center gap-1.5">
                  <LocationIcon />
                  {mentor.location}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
          <div className="space-y-6">
            {mentor.bio && (
              <div className="rounded-2xl border border-surface-dim bg-surface-container-lowest p-6">
                <h2 className="mb-3 text-lg font-bold text-on-surface">About Me</h2>
                <p className="whitespace-pre-line text-sm leading-relaxed text-on-surface-variant">{mentor.bio}</p>
              </div>
            )}

            {mentor.subjects?.length > 0 && (
              <div className="rounded-2xl border border-surface-dim bg-surface-container-lowest p-6">
                <h2 className="mb-4 text-lg font-bold text-on-surface">Subjects Offered</h2>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {mentor.subjects.map((subject, i) => (
                    <div key={subject} className={`rounded-xl p-4 ${SUBJECT_COLORS[i % SUBJECT_COLORS.length]}`}>
                      <p className="font-bold">{subject}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {mentor.teachingExperience?.length > 0 && (
              <div className="rounded-2xl border border-surface-dim bg-surface-container-lowest p-6">
                <h2 className="mb-4 text-lg font-bold text-on-surface">Teaching Experience</h2>
                <div className="space-y-5">
                  {mentor.teachingExperience.map((entry, i) => (
                    <div key={i} className="flex gap-4">
                      <span className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${i === 0 ? 'bg-secondary' : 'bg-surface-dim'}`} />
                      <div>
                        <p className="font-bold text-on-surface">{entry.title}</p>
                        <p className="text-sm font-semibold text-secondary">
                          {entry.place} &bull; {entry.period}
                        </p>
                        {entry.description && (
                          <p className="mt-1 text-sm text-on-surface-variant">{entry.description}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {mentor.courses?.length > 0 && (
              <div className="rounded-2xl border border-surface-dim bg-surface-container-lowest p-6">
                <h2 className="mb-4 text-lg font-bold text-on-surface">Courses by {mentor.name}</h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {mentor.courses.map((course) => (
                    <Link
                      key={course._id}
                      to={`/courses/${course._id}`}
                      className="flex gap-3 rounded-xl border border-surface-dim p-3 transition-shadow hover:shadow-[var(--shadow-card-md)]"
                    >
                      <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-accent-design">
                        {course.thumbnail && <img src={`${IMG_BASE}${course.thumbnail}`} alt="" className="h-full w-full object-cover" />}
                      </div>
                      <div className="min-w-0">
                        <p className="line-clamp-2 text-sm font-semibold text-on-surface">{course.title}</p>
                        <p className="mt-1 text-sm font-bold text-secondary">{course.price ? `$${course.price}` : 'Free'}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4 lg:sticky lg:top-6 lg:self-start">
            {mentor.sessionRate != null && (
              <div className="rounded-2xl border border-surface-dim bg-surface-container-lowest p-6 text-center">
                <p className="text-sm text-on-surface-variant">Session Rate</p>
                <p className="mt-1 text-3xl font-extrabold text-on-surface">
                  ${mentor.sessionRate}
                  <span className="text-base font-normal text-on-surface-variant">/hr</span>
                </p>
              </div>
            )}

            {mentor.availability && (
              <div className="rounded-2xl border border-surface-dim bg-surface-container-lowest p-6">
                <h3 className="mb-2 text-sm font-bold text-on-surface">Availability</h3>
                <p className="text-sm whitespace-pre-line text-on-surface-variant">{mentor.availability}</p>
              </div>
            )}

            <a
              href={`mailto:${mentor.email}`}
              className="flex items-center justify-center gap-2 rounded-xl bg-secondary py-3 text-sm font-bold text-white transition-colors hover:bg-secondary-hover"
            >
              <MessageIcon />
              Message Mentor
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MentorProfile
