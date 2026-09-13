import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCourses } from '../api/courses'
import { LoadingState, ErrorState, EmptyState } from '../components/StateViews'
import { CATEGORIES } from '../lib/constants'

const IMG_BASE = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5001'

function SearchIcon() {
  return (
    <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="9" r="6.5" />
      <path d="m18 18-4-4" />
    </svg>
  )
}

function UsersIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="8" r="3.2" />
      <path d="M3.5 19c.6-3.2 3-5 5.5-5s4.9 1.8 5.5 5" />
      <circle cx="17" cy="9" r="2.6" />
      <path d="M15.2 14.3c1.9.4 3.4 1.9 3.8 4.2" />
    </svg>
  )
}

function CourseCard({ course }) {
  return (
    <Link
      to={`/courses/${course._id}`}
      className="overflow-hidden rounded-2xl border border-surface-dim bg-surface-container-lowest shadow-[var(--shadow-card-sm)] transition-shadow hover:shadow-[var(--shadow-card-md)]"
    >
      <div className="h-40 bg-accent-design">
        {course.thumbnail && <img src={`${IMG_BASE}${course.thumbnail}`} alt="" className="h-full w-full object-cover" />}
      </div>
      <div className="p-5">
        <p className="text-xs font-bold tracking-wide text-secondary uppercase">{course.category}</p>
        <h3 className="mt-1 line-clamp-2 text-lg font-bold text-on-surface">{course.title}</h3>
        <p className="mt-1 text-sm text-on-surface-variant">By {course.teacherId?.name}</p>

        <div className="mt-4 flex items-center justify-between border-t border-surface-dim pt-4">
          <span className="flex items-center gap-1.5 text-xs text-on-surface-variant">
            <UsersIcon />
            {(course.enrollmentCount || 0).toLocaleString()} enrolled
          </span>
          <span className="text-lg font-extrabold text-on-surface">{course.price ? `$${course.price}` : 'Free'}</span>
        </div>
      </div>
    </Link>
  )
}

function Courses() {
  const [q, setQ] = useState('')
  const [category, setCategory] = useState('')
  const [free, setFree] = useState(false)
  const [page, setPage] = useState(1)

  const { data, isPending, isError, error, refetch } = useCourses({ q, category, free: free || undefined, page, limit: 12 })
  const courses = data?.data || []
  const meta = data?.meta

  return (
    <div className="mx-auto max-w-7xl px-8 py-10 max-lg:px-5">
      <h1 className="text-3xl font-extrabold text-on-surface">Explore Courses</h1>
      <p className="mt-1 text-on-surface-variant">Live, approved courses from Brainlaya instructors.</p>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <label className="flex flex-1 min-w-[220px] items-center gap-2 rounded-full border border-surface-dim bg-surface-container-low px-4 py-2.5 text-on-surface-variant focus-within:border-secondary">
          <SearchIcon />
          <input
            type="text"
            placeholder="Search courses..."
            value={q}
            onChange={(e) => {
              setPage(1)
              setQ(e.target.value)
            }}
            className="w-full border-none bg-transparent text-sm text-on-surface outline-none placeholder:text-on-surface-variant"
          />
        </label>

        <select
          value={category}
          onChange={(e) => {
            setPage(1)
            setCategory(e.target.value)
          }}
          className="rounded-full border border-surface-dim bg-surface-container-low px-4 py-2.5 text-sm text-on-surface outline-none focus:border-secondary"
        >
          <option value="">All categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <label className="flex items-center gap-2 rounded-full border border-surface-dim bg-surface-container-low px-4 py-2.5 text-sm text-on-surface">
          <input
            type="checkbox"
            checked={free}
            onChange={(e) => {
              setPage(1)
              setFree(e.target.checked)
            }}
            className="h-4 w-4 rounded border-surface-dim"
          />
          Free only
        </label>
      </div>

      <div className="mt-8">
        {isPending && <LoadingState />}
        {isError && <ErrorState message={error.message} onRetry={refetch} />}
        {!isPending && !isError && courses.length === 0 && (
          <EmptyState title="No courses match your filters" description="Try a different search or clear the filters." />
        )}
        {!isPending && !isError && courses.length > 0 && (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {courses.map((course) => (
                <CourseCard key={course._id} course={course} />
              ))}
            </div>

            {meta && meta.totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-3">
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
        )}
      </div>
    </div>
  )
}

export default Courses
