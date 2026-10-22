import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useMentors } from '../api/users'
import { LoadingState, ErrorState, EmptyState } from '../components/StateViews'

const IMG_BASE = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5001'

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  )
}

function ChevronNavIcon({ direction }) {
  return (
    <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d={direction === 'left' ? 'M12.5 15 7.5 10l5-5' : 'M7.5 15l5-5-5-5'} />
    </svg>
  )
}

function MentorCard({ mentor }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-surface-dim bg-surface-container-lowest">
      <div className="flex h-40 items-center justify-center bg-accent-design">
        {mentor.avatar ? (
          <img src={`${IMG_BASE}${mentor.avatar}`} alt={mentor.name} className="h-full w-full object-cover" />
        ) : (
          <span className="text-4xl font-bold text-secondary">{mentor.name?.[0]?.toUpperCase()}</span>
        )}
      </div>

      <div className="p-5">
        <h3 className="text-lg font-bold text-on-surface">{mentor.name}</h3>
        {mentor.headline && <p className="mb-2 text-sm font-semibold text-brand-green">{mentor.headline}</p>}
        {mentor.subjects?.length > 0 && (
          <p className="mb-3 text-xs text-on-surface-variant">{mentor.subjects.slice(0, 3).join(' • ')}</p>
        )}
        {mentor.sessionRate != null && (
          <p className="mb-4 text-lg font-extrabold text-on-surface">
            ${mentor.sessionRate}
            <span className="text-sm font-normal text-on-surface-variant">/hr</span>
          </p>
        )}
        <Link
          to={`/users/${mentor.id}`}
          className="flex w-full items-center justify-center rounded-lg bg-secondary py-2.5 text-sm font-bold text-white transition-colors hover:bg-secondary-hover"
        >
          View Profile
        </Link>
      </div>
    </div>
  )
}

function Mentors() {
  const [page, setPage] = useState(1)
  const [q, setQ] = useState('')
  const { data, isPending, isError, error, refetch } = useMentors({ page, limit: 12, q })

  const mentors = data?.data || []
  const meta = data?.meta

  return (
    <div className="bg-surface">
      <div className="px-16 pt-12 pb-8 max-lg:px-6">
        <div className="mx-auto max-w-7xl">
          <h1 className="mb-4 text-5xl font-extrabold text-on-surface max-lg:text-4xl">
            Find Your Perfect Mentor
          </h1>
          <p className="max-w-2xl text-lg text-on-surface-variant">
            Connect with world-class educators and industry experts. Tailored learning experiences
            for every grade level and subject.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3 rounded-2xl border border-surface-dim bg-surface-container-lowest p-4">
            <label className="flex min-w-[240px] flex-1 items-center gap-2.5 rounded-xl bg-surface-container-low px-4 py-3 text-on-surface-variant">
              <SearchIcon />
              <input
                type="text"
                placeholder="Search by name or expertise..."
                value={q}
                onChange={(e) => {
                  setPage(1)
                  setQ(e.target.value)
                }}
                className="w-full border-none bg-transparent text-sm text-on-surface outline-none placeholder:text-on-surface-variant"
              />
            </label>
          </div>
        </div>
      </div>

      <div className="px-16 py-10 max-lg:px-6">
        <div className="mx-auto max-w-7xl">
          {isPending && <LoadingState />}
          {isError && <ErrorState message={error.message} onRetry={refetch} />}

          {!isPending && !isError && (
            mentors.length === 0 ? (
              <EmptyState title="No mentors found" description="Try a different search." />
            ) : (
              <>
                <div className="grid grid-cols-4 gap-6 max-lg:grid-cols-2 max-sm:grid-cols-1">
                  {mentors.map((mentor) => (
                    <MentorCard key={mentor.id} mentor={mentor} />
                  ))}
                </div>

                {meta && meta.totalPages > 1 && (
                  <div className="mt-10 flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page <= 1}
                      aria-label="Previous page"
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-surface-dim text-on-surface disabled:opacity-40"
                    >
                      <ChevronNavIcon direction="left" />
                    </button>
                    <span className="px-3 text-sm font-semibold text-on-surface-variant">
                      Page {meta.page} of {meta.totalPages}
                    </span>
                    <button
                      type="button"
                      onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
                      disabled={page >= meta.totalPages}
                      aria-label="Next page"
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-surface-dim text-on-surface disabled:opacity-40"
                    >
                      <ChevronNavIcon direction="right" />
                    </button>
                  </div>
                )}
              </>
            )
          )}
        </div>
      </div>

      <div className="px-16 py-10 max-lg:px-6">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-2xl bg-linear-to-br from-secondary to-[#1d4fc4] px-10 py-14 text-center text-white">
          <h2 className="mb-4 text-4xl font-extrabold max-lg:text-3xl">Can't find the right fit?</h2>
          <p className="mx-auto mb-8 max-w-xl text-lg text-white/85">
            Our learning specialists can help you find a mentor tailored to your specific goals
            and schedule.
          </p>
          <div className="flex justify-center gap-4 max-sm:flex-col max-sm:items-stretch">
            <Link to="/courses" className="rounded-lg bg-white px-7 py-3.5 text-base font-bold text-secondary">
              Browse Courses
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Mentors
