import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ShineBorder } from '@/components/ui/shine-border'
import promoThumb from '../assets/course-math.jpg'
import { COURSES } from '../data/courses'

const SUBJECTS = ['Mathematics', 'Science', 'Technology', 'Arts & Design']
const AVAILABILITY = ['Morning', 'Afternoon', 'Evening', 'Weekend']

const TOP_TEACHERS = [
  'https://avatars.githubusercontent.com/u/16860528',
  'https://avatars.githubusercontent.com/u/20110627',
  'https://avatars.githubusercontent.com/u/106103625',
]

const CATEGORY_STYLES = {
  Mathematics: 'bg-secondary text-white',
  Science: 'bg-brand-green text-white',
  'Arts & Design': 'bg-[#3b2f6b] text-white',
  Technology: 'bg-[#111827] text-white',
  Music: 'bg-[#7c2d12] text-white',
}

function StarIcon() {
  return (
    <svg viewBox="0 0 20 20" width="14" height="14" fill="#f59e0b" aria-hidden="true">
      <path d="M10 1.5l2.47 5.53 6.03.62-4.53 4.05 1.3 5.9L10 14.77l-5.27 2.83 1.3-5.9L1.5 7.65l6.03-.62L10 1.5z" />
    </svg>
  )
}

function CartIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="20" r="1.4" />
      <circle cx="17" cy="20" r="1.4" />
      <path d="M2 3h2l2.2 11.4a2 2 0 0 0 2 1.6h8.6a2 2 0 0 0 2-1.6L21 7H5.2" />
    </svg>
  )
}

function ChevronIcon() {
  return (
    <svg viewBox="0 0 20 20" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="m5 7.5 5 5 5-5" />
    </svg>
  )
}

function CourseCard({ course }) {
  return (
    <Link
      to={`/courses/${course.slug}`}
      className="block overflow-hidden rounded-2xl border border-surface-dim bg-surface-container-lowest transition-shadow hover:shadow-[var(--shadow-card-md)]"
    >
      <div className="relative h-40">
        <img src={course.thumb} alt="" className="h-full w-full object-cover" />
        <span className={`absolute top-4 left-4 rounded-md px-3 py-1 text-xs font-semibold ${CATEGORY_STYLES[course.category]}`}>
          {course.category}
        </span>
      </div>

      <div className="p-5">
        <div className="mb-2 flex items-center gap-1.5 text-sm">
          <StarIcon />
          <span className="font-semibold text-on-surface">{course.rating}</span>
          <span className="text-on-surface-variant">({course.reviews})</span>
        </div>

        <h3 className="mb-2 text-lg leading-snug font-bold text-on-surface">{course.title}</h3>

        <div className="mb-4 flex items-center gap-2">
          <img src={course.teacherAvatar} alt="" className="h-6 w-6 rounded-full object-cover" />
          <span className="text-sm text-on-surface-variant">{course.teacher}</span>
        </div>

        <div className="flex items-center justify-between border-t border-surface-dim pt-4">
          <span className="text-lg font-bold text-secondary">${course.price.toFixed(2)}</span>
          <span
            role="button"
            aria-label={`Add ${course.title} to cart`}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-secondary transition-colors hover:bg-surface-container-low"
          >
            <CartIcon />
          </span>
        </div>
      </div>
    </Link>
  )
}

function Courses() {
  const [subjects, setSubjects] = useState(['Mathematics'])
  const [availability, setAvailability] = useState('Afternoon')

  const toggleSubject = (subject) => {
    setSubjects((prev) =>
      prev.includes(subject) ? prev.filter((s) => s !== subject) : [...prev, subject]
    )
  }

  return (
    <div className="bg-surface px-16 py-10 max-lg:px-6">
      <div className="mx-auto grid max-w-7xl grid-cols-[260px_1fr] gap-10 max-lg:grid-cols-1">
        <aside className="max-lg:order-2">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-bold text-on-surface">Filters</h2>
            <button
              type="button"
              onClick={() => {
                setSubjects([])
                setAvailability(null)
              }}
              className="text-sm font-semibold text-secondary"
            >
              Clear all
            </button>
          </div>

          <div className="mb-6">
            <h3 className="mb-3 text-sm font-bold text-on-surface">Subject</h3>
            <div className="flex flex-col gap-2.5">
              {SUBJECTS.map((subject) => (
                <label key={subject} className="flex items-center gap-2.5 text-sm text-on-surface-variant">
                  <input
                    type="checkbox"
                    checked={subjects.includes(subject)}
                    onChange={() => toggleSubject(subject)}
                    className="h-4 w-4 rounded border-surface-dim accent-secondary"
                  />
                  {subject}
                </label>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h3 className="mb-3 text-sm font-bold text-on-surface">Grade Level</h3>
            <button
              type="button"
              className="flex w-full items-center justify-between rounded-lg border border-surface-dim bg-surface-container-lowest px-3.5 py-2.5 text-sm text-on-surface"
            >
              High School (9-12)
              <ChevronIcon />
            </button>
          </div>

          <div className="mb-6">
            <h3 className="mb-3 text-sm font-bold text-on-surface">Availability</h3>
            <div className="grid grid-cols-2 gap-2">
              {AVAILABILITY.map((slot) => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => setAvailability(slot)}
                  className={
                    availability === slot
                      ? 'rounded-lg border border-secondary px-3 py-2 text-sm font-semibold text-secondary'
                      : 'rounded-lg border border-surface-dim px-3 py-2 text-sm text-on-surface-variant'
                  }
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h3 className="mb-3 text-sm font-bold text-on-surface">Top Teachers</h3>
            <div className="flex items-center">
              {TOP_TEACHERS.map((url) => (
                <img
                  key={url}
                  src={url}
                  alt=""
                  className="-ml-2.5 h-9 w-9 rounded-full border-2 border-surface-container-lowest object-cover first:ml-0"
                />
              ))}
              <span className="-ml-2.5 flex h-9 w-9 items-center justify-center rounded-full border-2 border-surface-container-lowest bg-surface-container-low text-xs font-semibold text-on-surface-variant">
                +12
              </span>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="mb-3 text-sm font-bold text-on-surface">Location</h3>
            <button
              type="button"
              className="flex w-full items-center justify-between rounded-lg border border-surface-dim bg-surface-container-lowest px-3.5 py-2.5 text-sm text-on-surface"
            >
              United States
              <ChevronIcon />
            </button>
          </div>

          <div className="relative h-56 overflow-hidden rounded-2xl">
            <ShineBorder shineColor={['#ffffff']} />
            <img src={promoThumb} alt="" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-5 text-white">
              <span className="text-xs font-semibold text-white/80">Special Offer</span>
              <p className="mt-1 text-lg font-bold">Master Python for Data Science</p>
            </div>
          </div>
        </aside>

        <div className="max-lg:order-1">
          <div className="mb-8 flex items-end justify-between max-sm:flex-col max-sm:items-start max-sm:gap-4">
            <div>
              <h1 className="text-2xl font-bold text-on-surface">Explore Courses</h1>
              <p className="mt-1 text-sm text-on-surface-variant">
                Showing 1,240 results in Mathematics &amp; High School
              </p>
            </div>

            <label className="flex items-center gap-2 text-sm text-on-surface-variant">
              Sort by:
              <span className="flex items-center gap-2 rounded-lg border border-surface-dim bg-surface-container-lowest px-3.5 py-2 font-semibold text-on-surface">
                Most Popular
                <ChevronIcon />
              </span>
            </label>
          </div>

          <div className="grid grid-cols-3 gap-6 max-lg:grid-cols-2 max-sm:grid-cols-1">
            {COURSES.map((course) => (
              <CourseCard key={course.slug} course={course} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Courses
