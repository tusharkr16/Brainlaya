import { useState } from 'react'
import { Link, useParams, Navigate } from 'react-router-dom'
import { getCourseBySlug, getRelatedCourses } from '../data/courses'

function StarIcon({ filled = true }) {
  return (
    <svg viewBox="0 0 20 20" width="16" height="16" fill={filled ? '#f59e0b' : '#d9dada'} aria-hidden="true">
      <path d="M10 1.5l2.47 5.53 6.03.62-4.53 4.05 1.3 5.9L10 14.77l-5.27 2.83 1.3-5.9L1.5 7.65l6.03-.62L10 1.5z" />
    </svg>
  )
}

function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" />
    </svg>
  )
}

function LanguageIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 6h9M8.5 4v2.5c0 3.5-2 6-5 7.5M6 10.5c1.5 1.8 4 3 7 3" />
      <path d="m13 20 3.5-8L20 20M14.2 17.5h4.6" />
    </svg>
  )
}

function RefreshIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 12a8 8 0 0 1 14-5.2M20 12a8 8 0 0 1-14 5.2" />
      <path d="M18 4v3.5h-3.5M6 20v-3.5h3.5" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#1d4e43" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="m8.5 12.5 2.3 2.3L16 10" />
    </svg>
  )
}

function InfinityIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 9a3 3 0 1 0 0 6c2.5 0 4.5-6 7-6a3 3 0 1 1 0 6c-2.5 0-4.5-6-7-6Z" />
    </svg>
  )
}

function DeviceIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="7" y="2" width="10" height="16" rx="1.5" />
      <path d="M4 9v9a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9" />
    </svg>
  )
}

function CertificateIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="5" />
      <path d="m8.5 12.5-1.5 8 5-2.5 5 2.5-1.5-8" />
    </svg>
  )
}

function ChevronDownIcon({ open }) {
  return (
    <svg
      viewBox="0 0 20 20"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={open ? 'rotate-180 transition-transform' : 'transition-transform'}
    >
      <path d="m5 7.5 5 5 5-5" />
    </svg>
  )
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 20 20" width="16" height="16" fill="currentColor" aria-hidden="true">
      <path d="M6 4.5v11l9-5.5-9-5.5z" />
    </svg>
  )
}

function LinkIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.5 14.5 14.5 9.5" />
      <path d="M11 7.5 12.5 6a3 3 0 1 1 4.2 4.2L15 11.7M13 16.5 11.5 18a3 3 0 1 1-4.2-4.2L9 12.3" />
    </svg>
  )
}

function GlobeIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a14 14 0 0 1 0 18 14 14 0 0 1 0-18Z" />
    </svg>
  )
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m4 7 8 6 8-6" />
    </svg>
  )
}

const RATING_BREAKDOWN = [
  { stars: 5, pct: 92 },
  { stars: 4, pct: 6 },
  { stars: 3, pct: 2 },
]

const REVIEWS = [
  {
    initials: 'JD',
    name: 'Jameson Davis',
    time: '2 weeks ago',
    body: 'This course completely changed how I approach my work. The strategic frameworks are immediately applicable and helped me secure a promotion within a month of completing the curriculum.',
  },
]

function CurriculumSection({ curriculum }) {
  const [openIndex, setOpenIndex] = useState(0)

  return (
    <div className="flex flex-col gap-4">
      {curriculum.map((module, i) => {
        const open = openIndex === i
        return (
          <div key={module.title} className="overflow-hidden rounded-xl border border-surface-dim bg-surface-container-lowest">
            <button
              type="button"
              onClick={() => setOpenIndex(open ? -1 : i)}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
            >
              <div className="flex items-center gap-4">
                <span className="text-2xl font-bold text-surface-dim">{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <p className="font-bold text-on-surface">{module.title}</p>
                  <p className="text-sm text-on-surface-variant">{module.meta}</p>
                </div>
              </div>
              <ChevronDownIcon open={open} />
            </button>

            {open && module.lessons && (
              <div className="border-t border-surface-dim px-5 py-2">
                {module.lessons.map((lesson) => {
                  const label = typeof lesson === 'string' ? lesson : lesson.title
                  const duration = typeof lesson === 'string' ? null : lesson.duration
                  return (
                    <div key={label} className="flex items-center justify-between gap-4 py-3">
                      <span className="flex items-center gap-3 text-sm text-on-surface">
                        <PlayIcon />
                        {label}
                      </span>
                      {duration && <span className="text-sm text-on-surface-variant">{duration}</span>}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

function CourseDetail() {
  const { slug } = useParams()
  const course = getCourseBySlug(slug)
  const [copied, setCopied] = useState(false)

  if (!course) return <Navigate to="/courses" replace />

  const related = getRelatedCourses(slug)

  const copyLink = () => {
    navigator.clipboard?.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="bg-surface">
      <div className="bg-[#eef3fb] px-16 py-10 max-lg:px-6">
        <div className="mx-auto grid max-w-7xl grid-cols-[1fr_460px] gap-14 max-lg:grid-cols-1">
          <div>
            <nav className="mb-4 flex items-center gap-2 text-sm text-on-surface-variant">
              <Link to="/">Home</Link>
              <span>&gt;</span>
              <Link to="/courses">Courses</Link>
              <span>&gt;</span>
              <span className="font-semibold text-secondary">{course.title}</span>
            </nav>

            <h1 className="mb-4 text-4xl leading-tight font-extrabold text-on-surface max-lg:text-3xl">
              {course.title}
            </h1>

            <div className="mb-5 flex items-center gap-3 text-sm">
              <span className="flex items-center gap-1 rounded-md bg-accent-design px-2.5 py-1 font-bold text-on-surface">
                {course.rating}
                <StarIcon />
              </span>
              <span className="text-on-surface-variant">
                ({course.reviewCount.toLocaleString()} reviews) &bull; {course.enrolled.toLocaleString()} students enrolled
              </span>
            </div>

            <p className="mb-6 max-w-xl text-lg leading-relaxed text-on-surface-variant">
              {course.subtitle}
            </p>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm font-medium text-on-surface">
              <span className="flex items-center gap-2">
                <ClockIcon />
                {course.duration}
              </span>
              <span className="flex items-center gap-2">
                <LanguageIcon />
                {course.languages}
              </span>
              <span className="flex items-center gap-2">
                <RefreshIcon />
                Last updated {course.updated}
              </span>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-surface-dim bg-surface-container-lowest shadow-[var(--shadow-card-lg)]">
            <img src={course.thumb} alt="" className="aspect-video w-full object-cover" />
            <div className="p-6">
              <div className="mb-5 flex items-center gap-3">
                <span className="text-3xl font-extrabold text-on-surface">${course.price.toFixed(2)}</span>
                <span className="text-lg text-on-surface-variant line-through">${course.originalPrice.toFixed(2)}</span>
                <span className="rounded-md bg-accent-marketing px-2.5 py-1 text-xs font-bold text-brand-green">
                  {course.discount}
                </span>
              </div>
              <button
                type="button"
                className="w-full rounded-lg bg-secondary py-4 text-base font-bold text-white transition-colors hover:bg-secondary-hover"
              >
                Enroll Now
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-16 py-14 max-lg:px-6">
        <div className="grid grid-cols-[1fr_320px] gap-14 max-lg:grid-cols-1">
          <div>
            <h2 className="mb-5 text-3xl font-extrabold text-on-surface">About this Course</h2>
            <div className="rounded-2xl border border-surface-dim bg-surface-container-lowest p-7">
              <p className="mb-6 leading-relaxed text-on-surface-variant">{course.teacherBio}</p>

              <div className="grid grid-cols-2 gap-x-6 gap-y-3 max-sm:grid-cols-1">
                {course.outcomes.map((outcome) => (
                  <div key={outcome} className="flex items-center gap-2.5">
                    <CheckIcon />
                    <span className="text-sm font-medium text-on-surface">{outcome}</span>
                  </div>
                ))}
              </div>
            </div>

            <h2 className="mt-14 mb-5 text-3xl font-extrabold text-on-surface">Course Curriculum</h2>
            <CurriculumSection curriculum={course.curriculum} />

            <h2 className="mt-14 mb-5 text-3xl font-extrabold text-on-surface">Meet your Teacher</h2>
            <div className="flex gap-6 rounded-2xl border border-surface-dim bg-surface-container-lowest p-7 max-sm:flex-col">
              <img src={course.teacherAvatar} alt={course.teacher} className="h-24 w-24 shrink-0 rounded-full object-cover" />
              <div>
                <p className="text-xl font-bold text-on-surface">{course.teacher}</p>
                <p className="mb-3 font-semibold text-secondary">{course.teacherRole}</p>
                <p className="mb-5 leading-relaxed text-on-surface-variant">{course.teacherBio}</p>
                <div className="flex gap-8">
                  <div>
                    <p className="text-xl font-extrabold text-on-surface">{course.teacherStats.years}</p>
                    <p className="text-sm text-on-surface-variant">Years Exp.</p>
                  </div>
                  <div>
                    <p className="text-xl font-extrabold text-on-surface">{course.teacherStats.students}</p>
                    <p className="text-sm text-on-surface-variant">Students</p>
                  </div>
                  <div>
                    <p className="text-xl font-extrabold text-on-surface">{course.teacherStats.rating}</p>
                    <p className="text-sm text-on-surface-variant">Avg. Rating</p>
                  </div>
                </div>
              </div>
            </div>

            <h2 className="mt-14 mb-5 flex items-center justify-between text-3xl font-extrabold text-on-surface">
              Student Reviews
              <Link to="#" className="text-base font-semibold text-secondary">View All</Link>
            </h2>

            <div className="mb-6 flex items-center gap-8 rounded-2xl bg-accent-design p-6 max-sm:flex-col max-sm:items-start">
              <div className="text-center">
                <p className="text-4xl font-extrabold text-secondary">{course.rating}</p>
                <div className="my-1 flex justify-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <StarIcon key={i} />
                  ))}
                </div>
                <p className="text-sm text-on-surface-variant">Course Rating</p>
              </div>
              <div className="flex-1 space-y-2">
                {RATING_BREAKDOWN.map((row) => (
                  <div key={row.stars} className="flex items-center gap-3">
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-surface-dim">
                      <div className="h-full rounded-full bg-secondary" style={{ width: `${row.pct}%` }} />
                    </div>
                    <span className="w-10 text-sm text-on-surface-variant">{row.pct}%</span>
                  </div>
                ))}
              </div>
            </div>

            {REVIEWS.map((review) => (
              <div key={review.name} className="rounded-2xl border border-surface-dim bg-surface-container-lowest p-6">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-design text-sm font-bold text-secondary">
                      {review.initials}
                    </span>
                    <div>
                      <p className="font-bold text-on-surface">{review.name}</p>
                      <div className="flex gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <StarIcon key={i} />
                        ))}
                      </div>
                    </div>
                  </div>
                  <span className="text-sm text-on-surface-variant">{review.time}</span>
                </div>
                <p className="leading-relaxed text-on-surface-variant">"{review.body}"</p>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-6">
            <div className="rounded-2xl border border-surface-dim bg-surface-container-lowest p-6">
              <h3 className="mb-4 font-bold text-on-surface">Course Highlights</h3>
              <div className="flex flex-col gap-3 text-sm text-on-surface">
                <span className="flex items-center gap-3">
                  <InfinityIcon />
                  {course.highlights[0]}
                </span>
                <span className="flex items-center gap-3">
                  <DeviceIcon />
                  {course.highlights[1]}
                </span>
                <span className="flex items-center gap-3">
                  <CertificateIcon />
                  {course.highlights[2]}
                </span>
              </div>
            </div>

            <div className="rounded-2xl border border-surface-dim bg-surface-container-lowest p-6">
              <h3 className="mb-4 font-bold text-on-surface">Share this course</h3>
              <button
                type="button"
                onClick={copyLink}
                className="mb-3 flex w-full items-center gap-2 rounded-lg border border-surface-dim px-4 py-2.5 text-sm font-medium text-on-surface"
              >
                <LinkIcon />
                {copied ? 'Copied!' : 'Copy Link'}
              </button>
              <div className="flex gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-surface-dim text-on-surface">
                  <GlobeIcon />
                </span>
                <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-surface-dim text-on-surface">
                  <MailIcon />
                </span>
              </div>
            </div>

            {related.length > 0 && (
              <div>
                <h3 className="mb-4 font-bold text-on-surface">Related Courses</h3>
                <div className="flex flex-col gap-4">
                  {related.map((r) => (
                    <Link
                      key={r.slug}
                      to={`/courses/${r.slug}`}
                      className="flex items-center gap-4 rounded-xl border border-surface-dim bg-surface-container-lowest p-4 transition-shadow hover:shadow-[var(--shadow-card-sm)]"
                    >
                      <img src={r.thumb} alt="" className="h-14 w-14 rounded-lg object-cover" />
                      <div>
                        <p className="font-semibold text-on-surface">{r.title}</p>
                        <p className="font-bold text-secondary">${r.price.toFixed(2)}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CourseDetail
