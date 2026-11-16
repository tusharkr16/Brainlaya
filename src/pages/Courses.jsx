import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCourses } from '../api/courses'
import { LoadingState, ErrorState, EmptyState } from '../components/StateViews'
import { CATEGORIES } from '../lib/constants'

const IMG_BASE = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5001'

const CATEGORY_COLORS = {
  Technology:  { bg: '#e0f2fe', text: '#0369a1' },
  Science:     { bg: '#dcfce7', text: '#166534' },
  Design:      { bg: '#fae8ff', text: '#86198f' },
  Mathematics: { bg: '#fff7ed', text: '#9a3412' },
  Business:    { bg: '#fef9c3', text: '#854d0e' },
  Marketing:   { bg: '#ffe4e6', text: '#9f1239' },
  Arts:        { bg: '#f0fdf4', text: '#14532d' },
  Other:       { bg: '#f1f5f9', text: '#475569' },
}

function getCategoryStyle(cat) {
  return CATEGORY_COLORS[cat] || CATEGORY_COLORS.Other
}

function StarIcon() {
  return (
    <svg viewBox="0 0 16 16" width="12" height="12" fill="#f59e0b">
      <path d="M8 1.5l1.6 3.3 3.7.5-2.7 2.6.6 3.6L8 9.8 4.8 11.5l.6-3.6L2.7 5.3l3.7-.5z" />
    </svg>
  )
}


function SearchIcon() {
  return (
    <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="9" r="6" />
      <path d="m16 16-3.5-3.5" />
    </svg>
  )
}

function XIcon() {
  return (
    <svg viewBox="0 0 20 20" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="m5 5 10 10M15 5 5 15" />
    </svg>
  )
}

// Placeholder gradient thumbnails when no image
const THUMB_GRADIENTS = [
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
]

function getGradient(id) {
  const idx = id ? parseInt(id.slice(-2), 16) % THUMB_GRADIENTS.length : 0
  return THUMB_GRADIENTS[idx]
}

function CourseCard({ course }) {
  const initials = course.teacherId?.name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || 'T'

  return (
    <Link
      to={`/courses/${course._id}`}
      className="flex flex-col overflow-hidden rounded-2xl border border-surface-dim bg-surface-container-lowest transition-shadow hover:shadow-[var(--shadow-card-md)]"
    >
      <div className="relative h-56 shrink-0 overflow-hidden">
        {course.thumbnail ? (
          <img
            src={`${IMG_BASE}${course.thumbnail}`}
            alt={course.title}
            className="h-full w-full object-cover object-top"
          />
        ) : (
          <div className="h-full w-full" style={{ background: getGradient(course._id) }} />
        )}
        {!course.price && (
          <span className="absolute top-4 left-4 rounded-full bg-emerald-500 px-3.5 py-1.5 text-xs font-semibold text-white">
            Free
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col bg-surface-container-low p-6">
        <div className="mb-2 flex items-center gap-1.5 text-sm">
          <StarIcon />
          <span className="font-semibold text-on-surface">4.8</span>
          <span className="text-on-surface-variant">({(course.enrollmentCount || 0).toLocaleString()} students)</span>
        </div>

        <h3 className="mb-2 line-clamp-2 text-xl leading-snug font-bold text-on-surface">{course.title}</h3>
        <p className="line-clamp-2 text-sm leading-relaxed text-on-surface-variant">{course.description}</p>

        <div className="mt-auto flex items-center justify-between border-t border-surface-dim pt-4">
          <div className="flex min-w-0 items-center gap-2">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary/20 text-xs font-bold text-secondary">
              {initials}
            </span>
            <span className="truncate text-sm font-medium text-on-surface">{course.teacherId?.name || 'Instructor'}</span>
          </div>
          {course.price ? (
            <span className="shrink-0 text-lg font-bold text-secondary">${course.price}.00</span>
          ) : (
            <span className="shrink-0 text-base font-bold text-emerald-500">Free</span>
          )}
        </div>
      </div>
    </Link>
  )
}

function CourseCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-surface-dim bg-surface-container-lowest animate-pulse">
      <div className="h-56 bg-surface-container" />
      <div className="p-5 space-y-3">
        <div className="h-4 w-20 rounded bg-gray-100" />
        <div className="h-5 w-4/5 rounded bg-gray-100" />
        <div className="h-4 w-full rounded bg-gray-100" />
        <div className="h-4 w-1/3 rounded bg-gray-100" />
      </div>
    </div>
  )
}

function Courses() {
  const [q, setQ] = useState('')
  const [category, setCategory] = useState('')
  const [free, setFree] = useState(false)
  const [page, setPage] = useState(1)

  const { data, isPending, isError, error, refetch } = useCourses({
    q,
    category,
    free: free || undefined,
    page,
    limit: 12,
  })
  const courses = data?.data || []
  const meta = data?.meta

  const hasFilters = q || category || free

  function clearFilters() {
    setQ('')
    setCategory('')
    setFree(false)
    setPage(1)
  }

  return (
    <div style={{ background: '#f8faff', minHeight: '100vh' }}>
      {/* Hero strip */}
      <div style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 60%, #3b82f6 100%)' }} className="px-6 py-14 text-center">
        <p className="text-blue-200 text-sm font-semibold tracking-widest uppercase mb-3">Learn at your pace</p>
        <h1 className="text-4xl font-extrabold text-white leading-tight">
          Find your next skill
        </h1>
        <p className="mt-3 text-blue-100 text-base max-w-lg mx-auto">
          Browse expert-led courses across technology, design, science, and more.
        </p>

        {/* Search bar in hero */}
        <div className="mt-8 mx-auto max-w-xl">
          <label className="flex items-center gap-3 rounded-2xl bg-white px-5 py-3.5 shadow-lg focus-within:ring-2 focus-within:ring-blue-300">
            <SearchIcon />
            <input
              type="text"
              placeholder="Search courses, topics, instructors…"
              value={q}
              onChange={(e) => { setPage(1); setQ(e.target.value) }}
              className="flex-1 border-none bg-transparent text-sm text-gray-800 outline-none placeholder:text-gray-400"
            />
            {q && (
              <button type="button" onClick={() => { setQ(''); setPage(1) }} className="text-gray-400 hover:text-gray-600">
                <XIcon />
              </button>
            )}
          </label>
        </div>

        {/* Stats row */}
        <div className="mt-8 flex items-center justify-center gap-8">
          {[['500+', 'Courses'], ['50k+', 'Students'], ['100+', 'Instructors']].map(([num, label]) => (
            <div key={label} className="text-center">
              <p className="text-2xl font-extrabold text-white">{num}</p>
              <p className="text-xs font-medium text-blue-200 mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-5 py-8 lg:px-8">
        {/* Filter bar */}
        <div className="mb-8 flex items-center gap-3">
          {/* Category pills — scrollable on small screens */}
          <div className="flex flex-1 gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <button
              type="button"
              onClick={() => { setCategory(''); setPage(1) }}
              className={`shrink-0 rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors ${
                !category
                  ? 'border-blue-600 bg-blue-600 text-white'
                  : 'border-gray-200 bg-white text-gray-600 hover:border-blue-400 hover:text-blue-600'
              }`}
            >
              All
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => { setCategory(cat === category ? '' : cat); setPage(1) }}
                className={`shrink-0 rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors ${
                  category === cat
                    ? 'border-blue-600 bg-blue-600 text-white'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-blue-400 hover:text-blue-600'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Free toggle */}
          <label className="flex shrink-0 cursor-pointer items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-1.5 text-sm font-semibold text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors">
            <input
              type="checkbox"
              checked={free}
              onChange={(e) => { setFree(e.target.checked); setPage(1) }}
              className="h-3.5 w-3.5 accent-blue-600"
            />
            Free only
          </label>
        </div>

        {/* Results header */}
        <div className="mb-5 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            {isPending ? 'Loading…' : `${meta?.total ?? courses.length} course${(meta?.total ?? courses.length) !== 1 ? 's' : ''}`}
            {hasFilters && ' matching your filters'}
          </p>
          {hasFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:underline"
            >
              <XIcon /> Clear filters
            </button>
          )}
        </div>

        {/* Grid */}
        {isPending && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => <CourseCardSkeleton key={i} />)}
          </div>
        )}

        {isError && <ErrorState message={error.message} onRetry={refetch} />}

        {!isPending && !isError && courses.length === 0 && (
          <EmptyState
            title="No courses match your filters"
            description="Try a different search term or clear the category filter."
            action={
              hasFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700"
                >
                  Clear filters
                </button>
              )
            }
          />
        )}

        {!isPending && !isError && courses.length > 0 && (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {courses.map((course) => (
                <CourseCard key={course._id} course={course} />
              ))}
            </div>

            {meta && meta.totalPages > 1 && (
              <div className="mt-10 flex items-center justify-center gap-2">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 hover:border-blue-400 hover:text-blue-600 disabled:opacity-40 transition-colors"
                >
                  ← Previous
                </button>
                <span className="px-4 text-sm text-gray-500">
                  Page {meta.page} of {meta.totalPages}
                </span>
                <button
                  type="button"
                  disabled={page >= meta.totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 hover:border-blue-400 hover:text-blue-600 disabled:opacity-40 transition-colors"
                >
                  Next →
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
