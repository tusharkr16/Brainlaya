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

// ── Icons ──────────────────────────────────────────────────────────────────────

function ChevronRight() {
  return (
    <svg viewBox="0 0 20 20" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="m7.5 5 5 5-5 5" />
    </svg>
  )
}

function ChevronDown({ open }) {
  return (
    <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
      className={`shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>
      <path d="m5 7.5 5 5 5-5" />
    </svg>
  )
}

function StarFilled() {
  return <svg viewBox="0 0 20 20" width="16" height="16" fill="#f59e0b"><path d="M10 2l2.4 4.9 5.4.8-3.9 3.8.9 5.4L10 14.4l-4.8 2.5.9-5.4L2.2 7.7l5.4-.8L10 2Z" /></svg>
}

function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <circle cx="12" cy="12" r="9" /><path d="M12 7v5l3.5 2" />
    </svg>
  )
}

function TranslateIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a14 14 0 0 1 0 18 14 14 0 0 1 0-18Z" />
    </svg>
  )
}

function RefreshIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <path d="M3 12a9 9 0 1 0 9-9 9 9 0 0 0-6.36 2.64L3 8" />
      <path d="M3 3v5h5" />
    </svg>
  )
}

function PlayCircle({ className = '' }) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className={className}>
      <circle cx="12" cy="12" r="9" /><path d="M10 8.5 15.5 12 10 15.5V8.5Z" />
    </svg>
  )
}

function CheckCircle() {
  return (
    <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="#006a61" strokeWidth="1.8" strokeLinecap="round" className="shrink-0">
      <circle cx="10" cy="10" r="7.5" /><path d="m7 10 2 2 4-4" />
    </svg>
  )
}

function InfinityIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#2563eb" strokeWidth="1.8" strokeLinecap="round">
      <path d="M12 12c-2-2.5-4-4-6-4a4 4 0 0 0 0 8c2 0 4-1.5 6-4Zm0 0c2 2.5 4 4 6 4a4 4 0 0 0 0-8c-2 0-4 1.5-6 4Z" />
    </svg>
  )
}

function MobileIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#2563eb" strokeWidth="1.8" strokeLinecap="round">
      <rect x="7" y="2" width="10" height="20" rx="2" /><path d="M12 18h.01" />
    </svg>
  )
}

function BadgeIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#2563eb" strokeWidth="1.8" strokeLinecap="round">
      <path d="M12 2l2 4 5 .5-3.5 3.5 1 5L12 13l-4.5 2 1-5L5 6.5 10 6l2-4Z" />
    </svg>
  )
}

function LinkIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <path d="M9 15 15 9" /><path d="M11 6.5 12.5 5a3.5 3.5 0 0 1 5 5L16 11.5" />
      <path d="M13 17.5 11.5 19a3.5 3.5 0 0 1-5-5L8 12.5" />
    </svg>
  )
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <rect x="3" y="5" width="18" height="14" rx="2" /><path d="m4 7 8 6 8-6" />
    </svg>
  )
}

function ShareIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
      <path d="M8.6 13.5 15.4 17M15.4 7 8.6 10.5" />
    </svg>
  )
}

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <rect x="5" y="10" width="14" height="10" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </svg>
  )
}

function GlobeIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a14 14 0 0 1 0 18 14 14 0 0 1 0-18Z" />
    </svg>
  )
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString(undefined, { month: '2-digit', year: 'numeric' })
}

// ── Component ──────────────────────────────────────────────────────────────────

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
  const { data: lessonsData } = useLessons(id)
  const { data: teacherProfile } = useTeacherProfile(course?.teacherId?._id)
  const { data: relatedData } = useCourses(course ? { category: course.category, limit: 4 } : {}, Boolean(course))

  const enroll = useEnroll()
  const unenroll = useUnenroll()
  const [liveCount, setLiveCount] = useState(null)
  const [expandedLesson, setExpandedLesson] = useState(null)
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
  const teacher = teacherProfile?.data

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
    <div style={{ fontFamily: 'Inter, sans-serif', background: '#fff', color: '#121c28' }}>

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section style={{ background: '#f0f2ff', borderBottom: '1px solid #e0e4f0', padding: '48px 0 0' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', display: 'grid', gridTemplateColumns: '1fr 380px', gap: 40, alignItems: 'start' }}>

          {/* LEFT */}
          <div style={{ paddingBottom: 48 }}>
            {/* Breadcrumb */}
            <nav style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#6b7280', marginBottom: 20 }}>
              <Link to="/" style={{ color: '#6b7280', textDecoration: 'none' }} onMouseEnter={e => e.target.style.color='#2563eb'} onMouseLeave={e => e.target.style.color='#6b7280'}>Home</Link>
              <ChevronRight />
              <Link to="/courses" style={{ color: '#6b7280', textDecoration: 'none' }} onMouseEnter={e => e.target.style.color='#2563eb'} onMouseLeave={e => e.target.style.color='#6b7280'}>Courses</Link>
              <ChevronRight />
              <span style={{ color: '#2563eb' }}>{course.title?.split(' ').slice(0, 4).join(' ')}</span>
            </nav>

            {/* Title */}
            <h1 style={{ fontFamily: 'Manrope, sans-serif', fontSize: 32, fontWeight: 700, lineHeight: 1.25, letterSpacing: '-0.01em', margin: '0 0 16px', color: '#121c28' }}>
              {course.title}
            </h1>

            {/* Rating */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: '#fef3c7', borderRadius: 8, padding: '4px 10px' }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#92400e' }}>4.9</span>
                <StarFilled />
              </div>
              <span style={{ fontSize: 14, color: '#6b7280' }}>
                ({enrollmentCount.toLocaleString()} students enrolled)
              </span>
            </div>

            {/* Description */}
            <p style={{ fontSize: 16, lineHeight: 1.7, color: '#4b5563', marginBottom: 24, maxWidth: 560 }}>
              {course.description}
            </p>

            {/* Meta */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, fontSize: 14, fontWeight: 600, color: '#374151' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#374151' }}>
                <ClockIcon />{lessons.length || course.lessonCount || 0} Hours Content
              </span>
              {course.language && (
                <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#374151' }}>
                  <TranslateIcon />{course.language}
                </span>
              )}
              <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#374151' }}>
                <RefreshIcon />Last updated {formatDate(course.updatedAt)}
              </span>
            </div>
          </div>

          {/* RIGHT — Floating card */}
          <div style={{ marginTop: -48, position: 'relative', zIndex: 10 }}>
            <div style={{ background: '#fff', borderRadius: 16, overflow: 'hidden', boxShadow: '0 10px 40px rgba(0,0,0,0.12)', border: '1px solid #e5e7eb' }}>
              {/* Thumbnail */}
              <div style={{ aspectRatio: '16/9', background: '#e0e4f0', overflow: 'hidden' }}>
                {course.thumbnail
                  ? <img src={`${IMG_BASE}${course.thumbnail}`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <PlayCircle className="opacity-30" />
                    </div>
                }
              </div>

              <div style={{ padding: '20px 24px 24px' }}>
                {/* Price */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                  <span style={{ fontSize: 28, fontWeight: 800, color: '#111827', fontFamily: 'Manrope, sans-serif' }}>
                    {course.price ? `$${course.price}` : 'Free'}
                  </span>
                  {course.price > 0 && (
                    <>
                      <span style={{ fontSize: 15, color: '#9ca3af', textDecoration: 'line-through' }}>${Math.round(course.price * 1.6)}.00</span>
                      <span style={{ fontSize: 12, fontWeight: 700, background: '#d1fae5', color: '#065f46', borderRadius: 6, padding: '2px 8px' }}>
                        38% OFF
                      </span>
                    </>
                  )}
                </div>

                {/* Enroll button */}
                {isOwner ? (
                  <p style={{ borderRadius: 10, background: '#eff6ff', padding: '12px 16px', fontSize: 14, color: '#1d4ed8', marginBottom: 12 }}>
                    This is your course — students see an Enroll button here.
                  </p>
                ) : (!user || user.role === 'student') ? (
                  <button
                    type="button"
                    onClick={handleEnrollClick}
                    disabled={enroll.isPending || unenroll.isPending}
                    style={{
                      width: '100%', padding: '14px', borderRadius: 10, fontSize: 16, fontWeight: 700,
                      cursor: 'pointer', border: 'none', marginBottom: 8,
                      background: isEnrolled ? '#fff' : '#2563eb',
                      color: isEnrolled ? '#dc2626' : '#fff',
                      boxShadow: isEnrolled ? 'inset 0 0 0 1px #fca5a5' : '0 4px 12px rgba(37,99,235,0.35)',
                      transition: 'opacity 0.15s',
                    }}
                  >
                    {enroll.isPending || unenroll.isPending ? 'Please wait…' : isEnrolled ? 'Unenroll' : 'Enroll Now'}
                  </button>
                ) : null}

                {isEnrolled && (
                  <Link to={`/student/courses/${id}`} style={{ display: 'block', textAlign: 'center', fontSize: 14, fontWeight: 600, color: '#2563eb', textDecoration: 'none', marginTop: 8 }}>
                    Go to course →
                  </Link>
                )}
                {(enroll.error || unenroll.error) && (
                  <p style={{ marginTop: 8, borderRadius: 8, background: '#fef2f2', padding: '10px 14px', fontSize: 14, color: '#dc2626' }}>
                    {(enroll.error || unenroll.error).message}
                  </p>
                )}

                {/* What's included */}
                <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid #f3f4f6' }}>
                  <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {[
                      [<InfinityIcon />, `${lessons.length || course.lessonCount || 0} on-demand lessons`],
                      [<MobileIcon />, 'Access on mobile and TV'],
                      [<BadgeIcon />, 'Certificate of completion'],
                    ].map(([icon, label]) => (
                      <li key={label} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: '#4b5563' }}>
                        {icon}{label}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── BODY ─────────────────────────────────────────────────────────── */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 24px', display: 'grid', gridTemplateColumns: '1fr 380px', gap: 40, alignItems: 'start' }}>

        {/* LEFT COLUMN */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>

          {/* About */}
          <div>
            <h2 style={{ fontFamily: 'Manrope, sans-serif', fontSize: 22, fontWeight: 700, marginBottom: 16, color: '#111827' }}>About this Course</h2>
            <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
              <p style={{ fontSize: 15, lineHeight: 1.7, color: '#4b5563', margin: 0 }}>{course.description}</p>
              {course.outcomes?.length > 0 && (
                <ul style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 16px', listStyle: 'none', margin: 0, padding: 0 }}>
                  {course.outcomes.map((o) => (
                    <li key={o} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 14, color: '#374151' }}>
                      <CheckCircle />{o}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Requirements */}
          {course.requirements?.length > 0 && (
            <div>
              <h2 style={{ fontFamily: 'Manrope, sans-serif', fontSize: 22, fontWeight: 700, marginBottom: 16, color: '#111827' }}>Requirements</h2>
              <ul style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: '20px 24px', listStyle: 'none', margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {course.requirements.map((r) => (
                  <li key={r} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 14, color: '#4b5563' }}>
                    <span style={{ marginTop: 6, width: 6, height: 6, borderRadius: '50%', background: '#9ca3af', flexShrink: 0 }} />{r}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Curriculum */}
          <div>
            <h2 style={{ fontFamily: 'Manrope, sans-serif', fontSize: 22, fontWeight: 700, marginBottom: 16, color: '#111827' }}>Course Curriculum</h2>
            {lessons.length === 0 ? (
              <p style={{ border: '1px dashed #d1d5db', borderRadius: 12, padding: 24, fontSize: 14, color: '#9ca3af' }}>No lessons published yet.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {lessons.map((lesson, i) => {
                  const isOpen = expandedLesson === lesson._id
                  return (
                    <div key={lesson._id} style={{ border: '1px solid #e5e7eb', borderRadius: 10, overflow: 'hidden', background: '#fff' }}>
                      <button
                        type="button"
                        onClick={() => setExpandedLesson(isOpen ? null : lesson._id)}
                        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, padding: '14px 20px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                          <span style={{ fontFamily: 'Manrope, sans-serif', fontSize: 20, fontWeight: 700, color: '#9ca3af', minWidth: 28 }}>
                            {String(i + 1).padStart(2, '0')}
                          </span>
                          <div>
                            <div style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>{lesson.title}</div>
                            {lesson.scheduledAt && (
                              <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#2563eb', marginTop: 2 }}>
                                <ClockIcon />
                                {new Date(lesson.scheduledAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
                              </div>
                            )}
                            {lesson.meetingLink && (
                              <a href={lesson.meetingLink} target="_blank" rel="noopener noreferrer"
                                onClick={e => e.stopPropagation()}
                                style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#2563eb', textDecoration: 'none', marginTop: 2 }}>
                                <LinkIcon />Join meeting
                              </a>
                            )}
                          </div>
                        </div>
                        <ChevronDown open={isOpen} />
                      </button>

                      {isOpen && (
                        <div style={{ borderTop: '1px solid #f3f4f6', padding: '12px 20px 16px 62px' }}>
                          {canSeeLessons ? (
                            <p style={{ fontSize: 14, lineHeight: 1.7, color: '#4b5563', margin: 0, whiteSpace: 'pre-line' }}>{lesson.content}</p>
                          ) : (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: '#9ca3af' }}>
                              <LockIcon />
                              {user ? 'Enroll to unlock full lesson content.' : 'Log in and enroll to unlock full lesson content.'}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Instructor */}
          <div>
            <h2 style={{ fontFamily: 'Manrope, sans-serif', fontSize: 22, fontWeight: 700, marginBottom: 16, color: '#111827' }}>Meet your Teacher</h2>
            <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 24, display: 'flex', gap: 20 }}>
              {course.teacherId?.avatar ? (
                <img src={`${IMG_BASE}${course.teacherId.avatar}`} alt="" style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover', flexShrink: 0, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }} />
              ) : (
                <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 700, color: '#2563eb', flexShrink: 0 }}>
                  {course.teacherId?.name?.[0]?.toUpperCase()}
                </div>
              )}
              <div style={{ flex: 1 }}>
                <h3 style={{ fontFamily: 'Manrope, sans-serif', fontSize: 20, fontWeight: 700, margin: '0 0 2px', color: '#111827' }}>
                  {course.teacherId?.name}
                </h3>
                {teacher?.headline && (
                  <p style={{ fontSize: 13, fontWeight: 600, color: '#059669', margin: '0 0 10px' }}>{teacher.headline}</p>
                )}
                {teacher?.bio && (
                  <p style={{ fontSize: 14, lineHeight: 1.7, color: '#4b5563', margin: '0 0 16px', display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {teacher.bio}
                  </p>
                )}
                <div style={{ display: 'flex', gap: 28 }}>
                  {teacher?.teachingExperience?.length > 0 && (
                    <div>
                      <div style={{ fontSize: 20, fontWeight: 700, color: '#111827' }}>{teacher.teachingExperience.length}+</div>
                      <div style={{ fontSize: 12, color: '#6b7280' }}>Years Exp.</div>
                    </div>
                  )}
                  <div>
                    <div style={{ fontSize: 20, fontWeight: 700, color: '#111827' }}>{enrollmentCount.toLocaleString()}</div>
                    <div style={{ fontSize: 12, color: '#6b7280' }}>Students</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 20, fontWeight: 700, color: '#111827' }}>4.8</div>
                    <div style={{ fontSize: 12, color: '#6b7280' }}>Avg. Rating</div>
                  </div>
                  {teacher && (
                    <div style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: 2 }}>
                      <Link to={`/users/${course.teacherId?._id}`} style={{ fontSize: 13, fontWeight: 600, color: '#2563eb', textDecoration: 'none' }}>
                        View Profile →
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Reviews */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <h2 style={{ fontFamily: 'Manrope, sans-serif', fontSize: 22, fontWeight: 700, margin: 0, color: '#111827' }}>Student Reviews</h2>
              <button style={{ fontSize: 14, fontWeight: 600, color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer' }}>View All</button>
            </div>

            {/* Rating summary */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 16, marginBottom: 20 }}>
              <div style={{ background: '#eff6ff', borderRadius: 12, padding: '20px 16px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ fontFamily: 'Manrope, sans-serif', fontSize: 52, fontWeight: 800, color: '#1d4ed8', lineHeight: 1 }}>4.9</div>
                <div style={{ display: 'flex', gap: 2, margin: '8px 0 4px' }}>
                  {[1,2,3,4,5].map(n => <StarFilled key={n} />)}
                </div>
                <span style={{ fontSize: 12, color: '#6b7280' }}>Course Rating</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 8 }}>
                {[['92%', 0.92], ['6%', 0.06], ['2%', 0.02]].map(([label, pct]) => (
                  <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ flex: 1, height: 8, background: '#e5e7eb', borderRadius: 4, overflow: 'hidden' }}>
                      <div style={{ height: '100%', background: '#2563eb', borderRadius: 4, width: `${pct * 100}%` }} />
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 500, color: '#6b7280', width: 30, textAlign: 'right' }}>{label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Review card */}
            <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: '#2563eb', flexShrink: 0 }}>
                  {course.teacherId?.name?.[0] || 'S'}D
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>Sample Reviewer</div>
                  <div style={{ display: 'flex', gap: 2 }}>{[1,2,3,4,5].map(n => <StarFilled key={n} />)}</div>
                </div>
                <span style={{ marginLeft: 'auto', fontSize: 12, color: '#9ca3af' }}>2 weeks ago</span>
              </div>
              <p style={{ fontSize: 14, lineHeight: 1.7, color: '#4b5563', margin: 0 }}>
                &ldquo;This course completely changed how I approach my work. The frameworks are immediately applicable and the instructor explains concepts with real-world clarity.&rdquo;
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR */}
        <div style={{ position: 'sticky', top: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Course Highlights */}
          <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 20 }}>
            <h4 style={{ fontSize: 14, fontWeight: 700, color: '#111827', margin: '0 0 14px' }}>Course Highlights</h4>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: '#4b5563' }}>
                <InfinityIcon />Full lifetime access
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: '#4b5563' }}>
                <MobileIcon />Access on mobile and TV
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: '#4b5563' }}>
                <BadgeIcon />Certificate of completion
              </li>
            </ul>
          </div>

          {/* Share */}
          <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 20 }}>
            <h4 style={{ fontSize: 14, fontWeight: 700, color: '#111827', margin: '0 0 14px' }}>Share this course</h4>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                type="button"
                onClick={handleCopyLink}
                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '9px 14px', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 14, fontWeight: 600, color: '#374151', background: '#fff', cursor: 'pointer' }}
              >
                <ShareIcon />{copied ? 'Copied!' : 'Copy Link'}
              </button>
              <button style={{ width: 38, height: 38, border: '1px solid #e5e7eb', borderRadius: 8, background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <GlobeIcon />
              </button>
              <a href={`mailto:?subject=${encodeURIComponent(course.title)}&body=${encodeURIComponent(window.location.href)}`}
                style={{ width: 38, height: 38, border: '1px solid #e5e7eb', borderRadius: 8, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', color: '#374151' }}>
                <MailIcon />
              </a>
            </div>
          </div>

          {/* Related */}
          {relatedCourses.length > 0 && (
            <div>
              <h4 style={{ fontSize: 14, fontWeight: 700, color: '#111827', margin: '0 0 12px', padding: '0 2px' }}>Related Courses</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {relatedCourses.map((rc) => (
                  <Link key={rc._id} to={`/courses/${rc._id}`}
                    style={{ display: 'flex', gap: 12, padding: 12, background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, textDecoration: 'none', transition: 'box-shadow 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.boxShadow='0 4px 12px rgba(0,0,0,0.08)'}
                    onMouseLeave={e => e.currentTarget.style.boxShadow='none'}
                  >
                    <div style={{ width: 64, height: 64, borderRadius: 8, overflow: 'hidden', background: '#e0e4f0', flexShrink: 0 }}>
                      {rc.thumbnail && <img src={`${IMG_BASE}${rc.thumbnail}`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                      <p style={{ margin: '0 0 4px', fontSize: 14, fontWeight: 600, color: '#111827', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{rc.title}</p>
                      <span style={{ fontSize: 14, fontWeight: 700, color: '#2563eb' }}>{rc.price ? `$${rc.price}` : 'Free'}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CourseDetail
