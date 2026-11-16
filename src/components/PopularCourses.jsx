import { useState } from 'react'
import { Link } from 'react-router-dom'
import { COURSES } from '../data/courses'

const TABS = ['All', ...new Set(COURSES.map(c => c.category))]

function StarIcon() {
  return (
    <svg viewBox="0 0 20 20" width="13" height="13" fill="#f59e0b" aria-hidden="true">
      <path d="M10 1.5l2.47 5.53 6.03.62-4.53 4.05 1.3 5.9L10 14.77l-5.27 2.83 1.3-5.9L1.5 7.65l6.03-.62L10 1.5z" />
    </svg>
  )
}

function ArrowRightIcon() {
  return (
    <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 10h12M11 5l5 5-5 5" />
    </svg>
  )
}

function CourseCard({ course }) {
  return (
    <Link
      to="/courses"
      className="group flex flex-col overflow-hidden rounded-2xl border border-surface-dim bg-surface-container-lowest transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-card-md)]"
    >
      {/* Thumbnail */}
      <div className="relative h-44 shrink-0 overflow-hidden">
        <img
          src={course.thumb}
          alt={course.title}
          className="h-full w-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
          draggable="false"
        />
        {course.discount && (
          <span className="absolute top-3 left-3 rounded-md bg-secondary px-2 py-0.5 text-[11px] font-bold text-white shadow-sm">
            {course.discount}
          </span>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-4">
        <h3 className="mb-1 line-clamp-2 text-sm font-bold leading-snug text-on-surface">
          {course.title}
        </h3>
        <p className="mb-3 text-xs text-on-surface-variant truncate">{course.teacher}</p>

        {/* Rating row */}
        <div className="mb-3 flex items-center gap-1.5">
          <span className="rounded border border-amber-400 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700 bg-amber-50">
            Top rated
          </span>
          <StarIcon />
          <span className="text-xs font-bold text-on-surface">{course.rating}</span>
          <span className="text-xs text-on-surface-variant">({course.reviews})</span>
        </div>

        {/* Price row */}
        <div className="mt-auto flex items-center justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="text-base font-extrabold text-on-surface">${course.price}</span>
            {course.originalPrice && (
              <span className="text-xs text-on-surface-variant line-through">${course.originalPrice}</span>
            )}
          </div>
          <span className="rounded-lg border border-secondary px-2.5 py-1 text-xs font-semibold text-secondary transition-colors group-hover:bg-secondary group-hover:text-white">
            Explore →
          </span>
        </div>
      </div>
    </Link>
  )
}

function PopularCourses() {
  const [activeTab, setActiveTab] = useState('All')
  const filtered = activeTab === 'All' ? COURSES : COURSES.filter(c => c.category === activeTab)

  return (
    <section className="bg-surface-container-lowest py-20 max-lg:py-14">
      <div className="mx-auto max-w-7xl px-16 max-lg:px-6">
        {/* Heading */}
        <h2 className="text-4xl font-extrabold text-on-surface max-lg:text-3xl">
          Skills to advance your future
        </h2>
        <p className="mt-3 text-base text-on-surface-variant max-w-xl">
          Expert-led courses across every discipline — learn at your pace, on your schedule.
        </p>

        {/* Category tabs */}
        <div className="mt-8 flex gap-1 border-b border-surface-dim overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {TABS.map(tab => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`shrink-0 pb-3 px-4 text-sm font-semibold transition-colors border-b-2 ${
                activeTab === tab
                  ? 'border-on-surface text-on-surface'
                  : 'border-transparent text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Cards */}
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {filtered.map(course => (
            <CourseCard key={course.slug} course={course} />
          ))}
        </div>

        {/* Show all link */}
        <Link
          to="/courses"
          className="mt-7 inline-flex items-center gap-1.5 text-sm font-semibold text-secondary hover:underline"
        >
          {activeTab === 'All' ? 'Browse all courses' : `Show all ${activeTab} courses`}
          <ArrowRightIcon />
        </Link>
      </div>
    </section>
  )
}

export default PopularCourses
