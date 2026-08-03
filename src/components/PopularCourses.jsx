import { Link } from 'react-router-dom'
import { COURSES } from '../data/courses'

function StarIcon() {
  return (
    <svg viewBox="0 0 20 20" width="14" height="14" fill="#f59e0b" aria-hidden="true">
      <path d="M10 1.5l2.47 5.53 6.03.62-4.53 4.05 1.3 5.9L10 14.77l-5.27 2.83 1.3-5.9L1.5 7.65l6.03-.62L10 1.5z" />
    </svg>
  )
}

function CourseCard({ course }) {
  return (
    <Link
      to={`/courses/${course.slug}`}
      className="block w-80 shrink-0 overflow-hidden rounded-2xl border border-surface-dim bg-surface-container-lowest transition-shadow hover:shadow-[var(--shadow-card-md)]"
    >
      <div className="relative h-56">
        <img src={course.thumb} alt="" className="h-full w-full object-cover" draggable="false" />
        {course.category === 'Mathematics' && (
          <span className="absolute top-4 left-4 rounded-full bg-on-surface px-3.5 py-1.5 text-xs font-semibold text-white">
            Bestseller
          </span>
        )}
      </div>

      <div className="bg-surface-container-low p-6">
        <div className="mb-2 flex items-center gap-1.5 text-sm">
          <StarIcon />
          <span className="font-semibold text-on-surface">{course.rating}</span>
          <span className="text-on-surface-variant">({course.reviews} reviews)</span>
        </div>

        <h3 className="mb-2 text-xl leading-snug font-bold text-on-surface">{course.title}</h3>
        <p className="mb-4 text-sm leading-relaxed text-on-surface-variant">{course.subtitle}</p>

        <div className="flex items-center justify-between border-t border-surface-dim pt-4">
          <div className="flex items-center gap-2">
            <img src={course.teacherAvatar} alt="" className="h-8 w-8 rounded-full object-cover" />
            <span className="text-sm font-medium text-on-surface">{course.teacher}</span>
          </div>
          <span className="text-lg font-bold text-secondary">${course.price.toFixed(2)}</span>
        </div>
      </div>
    </Link>
  )
}

function PopularCourses() {
  return (
    <section className="overflow-hidden bg-surface-container-lowest py-20 max-lg:py-14">
      <div className="mx-auto max-w-7xl px-16 max-lg:px-6">
        <h2 className="text-center text-4xl font-extrabold text-on-surface max-lg:text-3xl">
          Most Popular Courses
        </h2>
        <p className="mt-4 text-center text-lg text-on-surface-variant">
          Top-rated pathways chosen by our global community.
        </p>
      </div>

      <div className="group mt-14 [mask-image:linear-gradient(90deg,transparent,#000_5%,#000_95%,transparent)]">
        <div className="animate-marquee flex w-max gap-6 group-hover:[animation-play-state:paused]">
          {[...COURSES, ...COURSES].map((course, i) => (
            <CourseCard key={`${course.slug}-${i}`} course={course} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default PopularCourses
