import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useCourse, useCourses } from '../api/courses'
import { useEnroll, useUnenroll, useMyEnrollments } from '../api/enrollments'
import { useLessons } from '../api/lessons'
import { useTeacherProfile } from '../api/users'
import { useAuthStore } from '../store/authStore'
import { getSocket } from '../lib/socket'
import { LoadingState, ErrorState } from '../components/StateViews'

const IMG_BASE = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5001'

function ChevronRightIcon() {
  return (
    <svg viewBox="0 0 20 20" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m7.5 5 5 5-5 5" />
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
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`shrink-0 text-on-surface-variant transition-transform ${open ? 'rotate-180' : ''}`}
    >
      <path d="m5 7.5 5 5 5-5" />
    </svg>
  )
}

function UsersIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="8" r="3.2" />
      <path d="M3.5 19c.6-3.2 3-5 5.5-5s4.9 1.8 5.5 5" />
      <circle cx="17" cy="9" r="2.6" />
      <path d="M15.2 14.3c1.9.4 3.4 1.9 3.8 4.2" />
    </svg>
  )
}

function BookIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 6.5c-1.8-1.3-4.2-2-6.5-2A2 2 0 0 0 3.5 6.5v11c0 .8.6 1.3 1.4 1.1 2-.4 4.3.1 6 1.4V6.5Z" />
      <path d="M12 6.5c1.8-1.3 4.2-2 6.5-2a2 2 0 0 1 2 2v11c0 .8-.6 1.3-1.4 1.1-2-.4-4.3.1-6 1.4V6.5Z" />
    </svg>
  )
}

function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" />
    </svg>
  )
}

function CheckCircleIcon() {
  return (
    <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-brand-green">
      <circle cx="10" cy="10" r="7.5" />
      <path d="m7 10 2 2 4-4" />
    </svg>
  )
}

function LinkIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 15 15 9" />
      <path d="M11 6.5 12.5 5a3.5 3.5 0 0 1 5 5L16 11.5" />
      <path d="M13 17.5 11.5 19a3.5 3.5 0 0 1-5-5L8 12.5" />
    </svg>
  )
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m4 7 8 6 8-6" />
    </svg>
  )
}

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="10" width="14" height="10" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </svg>
  )
}

const WHATS_INCLUDED = [
  'Full lifetime access',
  'Learn at your own pace',
  "Direct updates from your instructor",
  'Access on any device',
]

function formatDate(iso) {
  return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
}

function CourseDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const { data, isPending, isError, error, refetch } = useCourse(id)
  const course = data?.data

  const { data: myEnrollments } = useMyEnrollments(user?.role === 'student')
  const isEnrolled = (myEnrollments?.data || []).some((e) => e.course._id === id)
  const isOwner = Boolean(user && course && user.id === course.teacherId?._id)
  const canSeeLessons = Boolean(user && (isEnrolled || user.role === 'admin' || isOwner))
  const { data: lessonsData } = useLessons(id, canSeeLessons)
  const { data: teacherProfile } = useTeacherProfile(course?.teacherId?._id)
  const { data: relatedData } = useCourses(course ? { category: course.category, limit: 4 } : {}, Boolean(course))

  const enroll = useEnroll()
  const unenroll = useUnenroll()
  const [liveCount, setLiveCount] = useState(null)
  const [expandedLessonId, setExpandedLessonId] = useState(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const socket = getSocket()
    if (!socket || !id) return
    socket.emit('course:watch', id)
    const onCount = (payload) => {
      if (payload.courseId === id) setLiveCount(payload.count)
    }
    socket.on('course:enrollment-count', onCount)
    return () => {
      socket.emit('course:unwatch', id)
      socket.off('course:enrollment-count', onCount)
    }
  }, [id])

  if (isPending) return <div className="mx-auto max-w-5xl px-8 py-16"><LoadingState /></div>
  if (isError) return <div className="mx-auto max-w-5xl px-8 py-16"><ErrorState message={error.message} onRetry={refetch} /></div>

  const enrollmentCount = liveCount ?? course.enrollmentCount
  const lessons = lessonsData?.data || []
  const relatedCourses = (relatedData?.data || []).filter((c) => c._id !== id).slice(0, 3)
  const teacherCourseCount = teacherProfile?.data?.courses?.length

  const handleEnrollClick = () => {
    if (!user) return navigate('/login', { state: { from: `/courses/${id}` } })
    if (isEnrolled) unenroll.mutate(id)
    else enroll.mutate(id)
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="bg-surface">
      {/* Hero */}
      <section className="border-b border-surface-dim bg-surface-container-low py-10 lg:py-16">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-8 max-lg:px-5 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <nav className="mb-4 flex items-center gap-1.5 text-xs text-on-surface-variant">
              <Link to="/" className="hover:text-secondary">Home</Link>
              <ChevronRightIcon />
              <Link to="/courses" className="hover:text-secondary">Courses</Link>
              <ChevronRightIcon />
              <span className="line-clamp-1 text-secondary">{course.title}</span>
            </nav>

            <p className="text-xs font-bold tracking-wide text-secondary uppercase">{course.category}</p>
            <h1 className="mt-2 text-3xl leading-tight font-extrabold text-on-surface lg:text-4xl">{course.title}</h1>
            <p className="mt-4 text-on-surface-variant">
              By <span className="font-semibold text-on-surface">{course.teacherId?.name}</span>
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-5 text-sm text-on-surface-variant">
              <span className="flex items-center gap-1.5">
                <UsersIcon />
                {enrollmentCount.toLocaleString()} enrolled
              </span>
              <span className="flex items-center gap-1.5">
                <BookIcon />
                {lessons.length || course.lessonCount || 0} lessons
              </span>
              <span className="flex items-center gap-1.5">
                <ClockIcon />
                Updated {formatDate(course.updatedAt)}
              </span>
            </div>

            <p className="mt-6 max-w-2xl whitespace-pre-line text-on-surface-variant">{course.description}</p>
          </div>

          {/* Floating enroll card */}
          <div className="lg:col-span-5">
            <div className="overflow-hidden rounded-2xl border border-surface-dim bg-surface-container-lowest shadow-[var(--shadow-card-lg)] lg:sticky lg:top-28">
              <div className="aspect-video bg-accent-design">
                {course.thumbnail && <img src={`${IMG_BASE}${course.thumbnail}`} alt="" className="h-full w-full object-cover" />}
              </div>
              <div className="p-6">
                <span className="text-3xl font-extrabold text-on-surface">{course.price ? `$${course.price}` : 'Free'}</span>

                {isOwner ? (
                  <p className="mt-4 rounded-lg bg-accent-design px-4 py-3 text-sm text-secondary">
                    This is your course — students see an Enroll button here.
                  </p>
                ) : (
                  (!user || user.role === 'student') && (
                    <button
                      type="button"
                      onClick={handleEnrollClick}
                      disabled={enroll.isPending || unenroll.isPending}
                      className={
                        isEnrolled
                          ? 'mt-4 w-full rounded-xl border border-error/30 py-3.5 text-sm font-bold text-error transition-colors hover:bg-error/10 disabled:opacity-60'
                          : 'mt-4 w-full rounded-xl bg-secondary py-3.5 text-sm font-bold text-white transition-colors hover:bg-secondary-hover disabled:opacity-60'
                      }
                    >
                      {enroll.isPending || unenroll.isPending ? 'Please wait…' : isEnrolled ? 'Unenroll' : 'Enroll Now'}
                    </button>
                  )
                )}
                {isEnrolled && (
                  <Link to={`/student/courses/${id}`} className="mt-3 block text-center text-sm font-semibold text-secondary hover:underline">
                    Go to course →
                  </Link>
                )}
                {(enroll.error || unenroll.error) && (
                  <p role="alert" className="mt-3 rounded-lg bg-error/10 px-4 py-2.5 text-sm font-medium text-error">
                    {(enroll.error || unenroll.error).message}
                  </p>
                )}

                <div className="mt-6 border-t border-surface-dim pt-6">
                  <h4 className="mb-3 text-sm font-bold text-on-surface">What's included</h4>
                  <ul className="space-y-2.5">
                    {WHATS_INCLUDED.map((item) => (
                      <li key={item} className="flex items-center gap-2.5 text-sm text-on-surface-variant">
                        <CheckCircleIcon />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main content */}
      <section className="mx-auto max-w-7xl px-8 py-12 max-lg:px-5 lg:grid lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-7">
          <div className="mb-10">
            <h2 className="mb-4 text-xl font-bold text-on-surface">About this Course</h2>
            <div className="rounded-xl border border-surface-dim bg-surface-container-lowest p-6">
              <p className="whitespace-pre-line text-on-surface-variant">{course.description}</p>
            </div>
          </div>

          <div className="mb-10">
            <h2 className="mb-4 text-xl font-bold text-on-surface">Course Curriculum</h2>
            {canSeeLessons ? (
              lessons.length === 0 ? (
                <p className="rounded-xl border border-dashed border-surface-dim bg-surface-container-lowest p-6 text-sm text-on-surface-variant">
                  No lessons published yet.
                </p>
              ) : (
                <div className="space-y-2">
                  {lessons.map((lesson, i) => {
                    const isOpen = expandedLessonId === lesson._id
                    return (
                      <div key={lesson._id} className="overflow-hidden rounded-xl border border-surface-dim bg-surface-container-lowest">
                        <button
                          type="button"
                          onClick={() => setExpandedLessonId(isOpen ? null : lesson._id)}
                          className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-surface-container-low"
                        >
                          <span className="flex items-center gap-4">
                            <span className="text-lg font-extrabold text-outline">{String(i + 1).padStart(2, '0')}</span>
                            <span className="font-semibold text-on-surface">{lesson.title}</span>
                            {lesson.completed && (
                              <span className="rounded-full bg-brand-green/15 px-2 py-0.5 text-[11px] font-bold text-brand-green">Done</span>
                            )}
                          </span>
                          <ChevronDownIcon open={isOpen} />
                        </button>
                        {isOpen && (
                          <div className="border-t border-surface-dim px-5 py-4 text-sm whitespace-pre-line text-on-surface-variant">
                            {lesson.content}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )
            ) : (
              <div className="flex items-center gap-3 rounded-xl border border-dashed border-surface-dim bg-surface-container-lowest p-6 text-sm text-on-surface-variant">
                <LockIcon />
                {user ? 'Enroll to unlock the full curriculum.' : 'Log in and enroll to unlock the full curriculum.'}
              </div>
            )}
          </div>

          <div>
            <h2 className="mb-4 text-xl font-bold text-on-surface">Meet your Instructor</h2>
            <div className="flex flex-col gap-5 rounded-xl border border-surface-dim bg-surface-container-lowest p-6 sm:flex-row sm:items-center">
              {course.teacherId?.avatar ? (
                <img src={`${IMG_BASE}${course.teacherId.avatar}`} alt="" className="h-20 w-20 shrink-0 rounded-full object-cover" />
              ) : (
                <span className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-accent-design text-2xl font-bold text-secondary">
                  {course.teacherId?.name?.[0]?.toUpperCase()}
                </span>
              )}
              <div>
                <h3 className="text-lg font-bold text-on-surface">{course.teacherId?.name}</h3>
                {teacherCourseCount !== undefined && (
                  <p className="mt-1 text-sm text-on-surface-variant">
                    {teacherCourseCount} course{teacherCourseCount === 1 ? '' : 's'} on Brainlaya
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="mt-10 lg:col-span-5 lg:mt-0">
          <div className="space-y-6 lg:sticky lg:top-28">
            <div className="rounded-xl border border-surface-dim bg-surface-container-lowest p-6">
              <h4 className="mb-3 text-sm font-bold text-on-surface">Course Highlights</h4>
              <ul className="space-y-2.5 text-sm text-on-surface-variant">
                <li className="flex items-center gap-2.5">
                  <CheckCircleIcon />
                  {lessons.length || course.lessonCount || 0} lessons
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircleIcon />
                  Category: {course.category}
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircleIcon />
                  Last updated {formatDate(course.updatedAt)}
                </li>
              </ul>
            </div>

            <div className="rounded-xl border border-surface-dim bg-surface-container-lowest p-6">
              <h4 className="mb-3 text-sm font-bold text-on-surface">Share this course</h4>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-surface-dim py-2.5 text-sm font-semibold text-on-surface transition-colors hover:bg-surface-container-low"
                >
                  <LinkIcon />
                  {copied ? 'Copied!' : 'Copy Link'}
                </button>
                <a
                  href={`mailto:?subject=${encodeURIComponent(course.title)}&body=${encodeURIComponent(window.location.href)}`}
                  aria-label="Share via email"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-surface-dim transition-colors hover:bg-surface-container-low"
                >
                  <MailIcon />
                </a>
              </div>
            </div>

            {relatedCourses.length > 0 && (
              <div>
                <h4 className="mb-3 text-sm font-bold text-on-surface">Related Courses</h4>
                <div className="space-y-3">
                  {relatedCourses.map((rc) => (
                    <Link
                      key={rc._id}
                      to={`/courses/${rc._id}`}
                      className="flex gap-3 rounded-xl border border-surface-dim bg-surface-container-lowest p-3 transition-shadow hover:shadow-[var(--shadow-card-md)]"
                    >
                      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-accent-design">
                        {rc.thumbnail && <img src={`${IMG_BASE}${rc.thumbnail}`} alt="" className="h-full w-full object-cover" />}
                      </div>
                      <div className="flex flex-col justify-center">
                        <p className="line-clamp-2 text-sm font-semibold text-on-surface">{rc.title}</p>
                        <span className="mt-1 text-sm font-bold text-secondary">{rc.price ? `$${rc.price}` : 'Free'}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}

export default CourseDetail
