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
  return <svg viewBox="0 0 20 20" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="m7.5 5 5 5-5 5" /></svg>
}
function ChevronDown({ open }) {
  return <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className={`shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}><path d="m5 7.5 5 5 5-5" /></svg>
}
function StarFilled({ size = 16 }) {
  return <svg viewBox="0 0 20 20" width={size} height={size} fill="#f59e0b"><path d="M10 2l2.4 4.9 5.4.8-3.9 3.8.9 5.4L10 14.4l-4.8 2.5.9-5.4L2.2 7.7l5.4-.8L10 2Z" /></svg>
}
function StarEmpty({ size = 16 }) {
  return <svg viewBox="0 0 20 20" width={size} height={size} fill="none" stroke="#d1d5db" strokeWidth="1.5"><path d="M10 2l2.4 4.9 5.4.8-3.9 3.8.9 5.4L10 14.4l-4.8 2.5.9-5.4L2.2 7.7l5.4-.8L10 2Z" /></svg>
}
function PlayCircle({ className = '', size = 20 }) {
  return <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className={className}><circle cx="12" cy="12" r="9" /><path d="M10 8.5 15.5 12 10 15.5V8.5Z" /></svg>
}
function CheckIcon({ color = '#16a34a' }) {
  return <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round"><path d="m4 10 4 4 8-8" /></svg>
}
function LockIcon() {
  return <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><rect x="5" y="10" width="14" height="10" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></svg>
}
function ClockIcon({ size = 14 }) {
  return <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3.5 2" /></svg>
}
function GlobeIcon() {
  return <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a14 14 0 0 1 0 18 14 14 0 0 1 0-18Z" /></svg>
}
function RefreshIcon() {
  return <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M3 12a9 9 0 1 0 9-9 9 9 0 0 0-6.36 2.64L3 8" /><path d="M3 3v5h5" /></svg>
}
function InfinityIcon() {
  return <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M12 12c-2-2.5-4-4-6-4a4 4 0 0 0 0 8c2 0 4-1.5 6-4Zm0 0c2 2.5 4 4 6 4a4 4 0 0 0 0-8c-2 0-4 1.5-6 4Z" /></svg>
}
function MobileIcon() {
  return <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><rect x="7" y="2" width="10" height="20" rx="2" /><path d="M12 18h.01" /></svg>
}
function BadgeIcon() {
  return <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M12 2l2 4 5 .5-3.5 3.5 1 5L12 13l-4.5 2 1-5L5 6.5 10 6l2-4Z" /></svg>
}
function ShareIcon() {
  return <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><path d="M8.6 13.5 15.4 17M15.4 7 8.6 10.5" /></svg>
}
function LinkIcon() {
  return <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M9 15 15 9" /><path d="M11 6.5 12.5 5a3.5 3.5 0 0 1 5 5L16 11.5" /><path d="M13 17.5 11.5 19a3.5 3.5 0 0 1-5-5L8 12.5" /></svg>
}
function UsersIcon() {
  return <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></svg>
}
function BookIcon() {
  return <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></svg>
}
function ArrowUpRight() {
  return <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M7 17L17 7M7 7h10v10" /></svg>
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })
}

// ── Rating stars helper ────────────────────────────────────────────────────────
function RatingStars({ rating = 4.9, size = 14 }) {
  const full = Math.floor(rating)
  const half = rating - full >= 0.5
  return (
    <span className="flex items-center gap-0.5">
      {[1,2,3,4,5].map(i =>
        i <= full ? <StarFilled key={i} size={size} /> : <StarEmpty key={i} size={size} />
      )}
    </span>
  )
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
    const onCount = (payload) => { if (payload.courseId === id) setLiveCount(payload.count) }
    socket.on('course:enrollment-count', onCount)
    return () => { socket.emit('course:unwatch', id); socket.off('course:enrollment-count', onCount) }
  }, [id])

  if (isPending) return <div className="mx-auto max-w-5xl px-8 py-20"><LoadingState /></div>
  if (isError) return <div className="mx-auto max-w-5xl px-8 py-20"><ErrorState message={error.message} onRetry={refetch} /></div>

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
    navigator.clipboard.writeText(window.location.href).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000) })
  }

  // Fake outcomes if none provided
  const outcomes = course.outcomes?.length > 0 ? course.outcomes : [
    'Understand core concepts and frameworks',
    'Build real-world projects from scratch',
    'Apply best practices used by professionals',
    'Gain confidence to tackle complex problems',
    'Get hands-on with industry-standard tools',
    'Earn a certificate to showcase your skills',
  ]

  const requirements = course.requirements?.length > 0 ? course.requirements : [
    'Basic computer and internet skills',
    'A willingness to learn and practice',
  ]

  return (
    <div className="min-h-screen" style={{ background: '#f8faff', fontFamily: 'Inter, sans-serif' }}>

      {/* ── DARK HERO ─────────────────────────────────────────────────────── */}
      <section style={{ background: 'linear-gradient(160deg, #0d1b2e 0%, #111827 50%, #0f1f3d 100%)', borderBottom: '1px solid #1e2d4a' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>

          {/* Breadcrumb */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#6b7280', paddingTop: 24, paddingBottom: 20 }}>
            <Link to="/" style={{ color: '#9ca3af', textDecoration: 'none' }} onMouseEnter={e => e.target.style.color='#60a5fa'} onMouseLeave={e => e.target.style.color='#9ca3af'}>Home</Link>
            <ChevronRight />
            <Link to="/courses" style={{ color: '#9ca3af', textDecoration: 'none' }} onMouseEnter={e => e.target.style.color='#60a5fa'} onMouseLeave={e => e.target.style.color='#9ca3af'}>Courses</Link>
            <ChevronRight />
            <span style={{ color: '#93c5fd' }}>{course.category}</span>
            <ChevronRight />
            <span style={{ color: '#6b7280' }}>{course.title?.split(' ').slice(0, 5).join(' ')}</span>
          </nav>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 48, alignItems: 'start', paddingBottom: 40 }}>

            {/* LEFT */}
            <div>
              {/* Category + Level badges */}
              <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                <span style={{ background: '#1e3a5f', color: '#93c5fd', border: '1px solid #2563eb40', borderRadius: 6, padding: '4px 12px', fontSize: 12, fontWeight: 600 }}>
                  {course.category}
                </span>
                <span style={{ background: '#1a2e1a', color: '#86efac', border: '1px solid #16a34a40', borderRadius: 6, padding: '4px 12px', fontSize: 12, fontWeight: 600 }}>
                  Beginner Friendly
                </span>
                {!course.price && (
                  <span style={{ background: '#1a2e1a', color: '#4ade80', border: '1px solid #22c55e50', borderRadius: 6, padding: '4px 12px', fontSize: 12, fontWeight: 700 }}>
                    FREE
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 style={{ fontSize: 34, fontWeight: 800, lineHeight: 1.2, letterSpacing: '-0.02em', margin: '0 0 16px', color: '#f9fafb', fontFamily: 'Manrope, sans-serif', maxWidth: 640 }}>
                {course.title}
              </h1>

              {/* Description */}
              <p style={{ fontSize: 16, lineHeight: 1.7, color: '#9ca3af', marginBottom: 24, maxWidth: 580 }}>
                {course.description}
              </p>

              {/* Rating row */}
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 16, marginBottom: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 18, fontWeight: 800, color: '#fbbf24' }}>4.9</span>
                  <RatingStars rating={4.9} size={15} />
                  <span style={{ fontSize: 13, color: '#6b7280' }}>({enrollmentCount.toLocaleString()} ratings)</span>
                </div>
                <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, color: '#9ca3af' }}>
                  <UsersIcon />{enrollmentCount.toLocaleString()} students enrolled
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, color: '#9ca3af' }}>
                  <BookIcon />{lessons.length} lessons
                </span>
              </div>

              {/* Instructor row */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
                <span style={{ fontSize: 13, color: '#6b7280' }}>Created by</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg, #2563eb, #7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#fff', flexShrink: 0 }}>
                    {course.teacherId?.name?.[0]?.toUpperCase()}
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#60a5fa', textDecoration: 'underline', textDecorationColor: '#2563eb60' }}>
                    {course.teacherId?.name}
                  </span>
                </div>
              </div>

              {/* Meta row */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, fontSize: 13, color: '#6b7280' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <RefreshIcon />Last updated {formatDate(course.updatedAt)}
                </span>
                {course.language && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <GlobeIcon />{course.language}
                  </span>
                )}
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <ClockIcon size={14} />Full lifetime access
                </span>
              </div>
            </div>

            {/* RIGHT — Enrollment card */}
            <div style={{ position: 'relative' }}>
              <div style={{ background: '#fff', borderRadius: 16, overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.25)', border: '1px solid #e5e7eb' }}>
                {/* Thumbnail */}
                <div style={{ aspectRatio: '16/9', background: 'linear-gradient(135deg, #1e3a8a, #7c3aed)', overflow: 'hidden', position: 'relative' }}>
                  {course.thumbnail ? (
                    <img src={`${IMG_BASE}${course.thumbnail}`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: '50%', width: 60, height: 60, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <PlayCircle size={28} className="text-white opacity-80" />
                      </div>
                    </div>
                  )}
                  <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.15)' }} />
                  <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', background: 'rgba(255,255,255,0.9)', borderRadius: '50%', width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 16px rgba(0,0,0,0.2)' }}>
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="#1e3a8a"><polygon points="5 3 19 12 5 21 5 3" /></svg>
                  </div>
                </div>

                <div style={{ padding: '20px 22px 24px' }}>
                  {/* Price */}
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 4 }}>
                    <span style={{ fontSize: 32, fontWeight: 900, color: '#111827', fontFamily: 'Manrope, sans-serif', lineHeight: 1 }}>
                      {course.price ? `$${course.price}` : 'Free'}
                    </span>
                    {course.price > 0 && (
                      <>
                        <span style={{ fontSize: 16, color: '#9ca3af', textDecoration: 'line-through' }}>${Math.round(course.price * 1.6)}.00</span>
                        <span style={{ fontSize: 11, fontWeight: 700, background: '#fef3c7', color: '#92400e', borderRadius: 6, padding: '2px 8px', flexShrink: 0 }}>38% OFF</span>
                      </>
                    )}
                  </div>
                  {course.price > 0 && (
                    <p style={{ fontSize: 12, color: '#ef4444', fontWeight: 600, marginBottom: 14 }}>⏰ 2 days left at this price!</p>
                  )}

                  {/* CTA button */}
                  {isOwner ? (
                    <div style={{ background: '#eff6ff', borderRadius: 10, padding: '12px 16px', fontSize: 14, color: '#1d4ed8', marginBottom: 12 }}>
                      This is your course — students see an Enroll button here.
                    </div>
                  ) : (!user || user.role === 'student') ? (
                    <button
                      type="button"
                      onClick={handleEnrollClick}
                      disabled={enroll.isPending || unenroll.isPending}
                      style={{
                        width: '100%', padding: '14px', borderRadius: 10, fontSize: 16, fontWeight: 700,
                        cursor: 'pointer', border: 'none', marginBottom: 10,
                        background: isEnrolled ? '#fff7f7' : 'linear-gradient(135deg, #1e3a8a, #2563eb)',
                        color: isEnrolled ? '#dc2626' : '#fff',
                        boxShadow: isEnrolled ? 'inset 0 0 0 1.5px #fca5a5' : '0 6px 20px rgba(37,99,235,0.4)',
                        transition: 'all 0.2s',
                      }}
                    >
                      {enroll.isPending || unenroll.isPending ? 'Please wait…' : isEnrolled ? '✕ Unenroll from course' : '🎓 Enroll Now — It\'s Free'}
                    </button>
                  ) : null}

                  {isEnrolled && (
                    <Link to={`/student/courses/${id}`}
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, textAlign: 'center', fontSize: 14, fontWeight: 700, color: '#fff', textDecoration: 'none', background: 'linear-gradient(135deg, #059669, #10b981)', borderRadius: 10, padding: '12px', marginBottom: 10, boxShadow: '0 4px 12px rgba(16,185,129,0.3)' }}>
                      Continue Learning <ArrowUpRight />
                    </Link>
                  )}

                  {(enroll.error || unenroll.error) && (
                    <p style={{ marginTop: 8, borderRadius: 8, background: '#fef2f2', padding: '10px 14px', fontSize: 13, color: '#dc2626' }}>
                      {(enroll.error || unenroll.error).message}
                    </p>
                  )}

                  {/* Money-back */}
                  {course.price > 0 && (
                    <p style={{ textAlign: 'center', fontSize: 12, color: '#6b7280', marginTop: 8, marginBottom: 14 }}>
                      30-Day Money-Back Guarantee
                    </p>
                  )}

                  {/* Divider */}
                  <div style={{ borderTop: '1px solid #f3f4f6', marginTop: 12, paddingTop: 16 }}>
                    <p style={{ fontSize: 12, fontWeight: 700, color: '#374151', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>This course includes:</p>
                    <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 9 }}>
                      {[
                        [<InfinityIcon />, `${lessons.length} on-demand lessons`, '#2563eb'],
                        [<ClockIcon />, 'Full lifetime access', '#7c3aed'],
                        [<MobileIcon />, 'Access on mobile & desktop', '#059669'],
                        [<BadgeIcon />, 'Certificate of completion', '#d97706'],
                        [<GlobeIcon />, 'Downloadable resources', '#0891b2'],
                      ].map(([icon, label, color]) => (
                        <li key={label} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: '#374151' }}>
                          <span style={{ color }}>{icon}</span>{label}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Share row */}
                  <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
                    <button type="button" onClick={handleCopyLink}
                      style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '8px 12px', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 12, fontWeight: 600, color: '#374151', background: '#fff', cursor: 'pointer', transition: 'all 0.15s' }}>
                      {copied ? '✓ Copied!' : <><LinkIcon /> Copy link</>}
                    </button>
                    <button style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, padding: '8px 12px', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 12, fontWeight: 600, color: '#374151', background: '#fff', cursor: 'pointer' }}>
                      <ShareIcon /> Share
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHAT YOU'LL LEARN ──────────────────────────────────────────────── */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
        <section style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 16, padding: '28px 32px', margin: '32px 0 0' }}>
          <h2 style={{ fontFamily: 'Manrope, sans-serif', fontSize: 22, fontWeight: 800, margin: '0 0 20px', color: '#111827' }}>What you'll learn</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 32px' }}>
            {outcomes.map((o) => (
              <div key={o} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <span style={{ marginTop: 1, flexShrink: 0, width: 20, height: 20, background: '#f0fdf4', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CheckIcon color="#16a34a" />
                </span>
                <span style={{ fontSize: 14, lineHeight: 1.6, color: '#374151' }}>{o}</span>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* ── BODY ──────────────────────────────────────────────────────────── */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px 64px', display: 'grid', gridTemplateColumns: '1fr 380px', gap: 32, alignItems: 'start' }}>

        {/* LEFT */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>

          {/* Requirements */}
          <section style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 16, padding: '24px 28px' }}>
            <h2 style={{ fontFamily: 'Manrope, sans-serif', fontSize: 20, fontWeight: 800, margin: '0 0 16px', color: '#111827' }}>Requirements</h2>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {requirements.map((r) => (
                <li key={r} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 14, color: '#4b5563', lineHeight: 1.6 }}>
                  <span style={{ marginTop: 6, width: 6, height: 6, borderRadius: '50%', background: '#6b7280', flexShrink: 0 }} />{r}
                </li>
              ))}
            </ul>
          </section>

          {/* About */}
          <section style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 16, padding: '24px 28px' }}>
            <h2 style={{ fontFamily: 'Manrope, sans-serif', fontSize: 20, fontWeight: 800, margin: '0 0 16px', color: '#111827' }}>About this course</h2>
            <p style={{ fontSize: 15, lineHeight: 1.75, color: '#4b5563', margin: 0 }}>{course.description}</p>
            <div style={{ marginTop: 20, display: 'flex', flexWrap: 'wrap', gap: 20 }}>
              {[
                { label: 'Skill level', value: 'All levels' },
                { label: 'Students', value: enrollmentCount.toLocaleString() },
                { label: 'Languages', value: course.language || 'English' },
                { label: 'Lessons', value: `${lessons.length} lessons` },
              ].map(({ label, value }) => (
                <div key={label} style={{ padding: '12px 20px', background: '#f8fafc', borderRadius: 10, border: '1px solid #e5e7eb' }}>
                  <p style={{ margin: 0, fontSize: 11, fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>{label}</p>
                  <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#111827' }}>{value}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Curriculum */}
          <section style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 16, overflow: 'hidden' }}>
            <div style={{ padding: '24px 28px 20px', borderBottom: '1px solid #f3f4f6' }}>
              <h2 style={{ fontFamily: 'Manrope, sans-serif', fontSize: 20, fontWeight: 800, margin: '0 0 4px', color: '#111827' }}>Course curriculum</h2>
              <p style={{ margin: 0, fontSize: 13, color: '#6b7280' }}>{lessons.length} lessons • Full lifetime access</p>
            </div>

            {lessons.length === 0 ? (
              <div style={{ padding: '32px 28px', textAlign: 'center', color: '#9ca3af', fontSize: 14 }}>
                No lessons published yet. Check back soon!
              </div>
            ) : (
              <div>
                {lessons.map((lesson, i) => {
                  const isOpen = expandedLesson === lesson._id
                  return (
                    <div key={lesson._id} style={{ borderBottom: i < lessons.length - 1 ? '1px solid #f3f4f6' : 'none' }}>
                      <button
                        type="button"
                        onClick={() => setExpandedLesson(isOpen ? null : lesson._id)}
                        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, padding: '16px 28px', background: isOpen ? '#f8fafc' : '#fff', border: 'none', cursor: 'pointer', textAlign: 'left', transition: 'background 0.15s' }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                          {/* Number circle */}
                          <span style={{ width: 32, height: 32, borderRadius: '50%', background: isOpen ? '#eff6ff' : '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: isOpen ? '#2563eb' : '#6b7280', flexShrink: 0 }}>
                            {i + 1}
                          </span>
                          <div>
                            <div style={{ fontSize: 14, fontWeight: 600, color: '#111827', marginBottom: 2 }}>{lesson.title}</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                              {canSeeLessons ? (
                                <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#16a34a', fontWeight: 500 }}>
                                  <PlayCircle size={11} /> Video lesson
                                </span>
                              ) : (
                                <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#9ca3af' }}>
                                  <LockIcon /> Enroll to unlock
                                </span>
                              )}
                              {lesson.scheduledAt && (
                                <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#7c3aed', fontWeight: 500 }}>
                                  <ClockIcon size={11} />{new Date(lesson.scheduledAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <ChevronDown open={isOpen} />
                      </button>

                      {isOpen && (
                        <div style={{ padding: '0 28px 20px 74px', background: '#f8fafc' }}>
                          {canSeeLessons ? (
                            <p style={{ fontSize: 14, lineHeight: 1.75, color: '#4b5563', margin: 0, whiteSpace: 'pre-line' }}>{lesson.content || 'Lesson content will appear here.'}</p>
                          ) : (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#6b7280', background: '#fff', borderRadius: 8, padding: '12px 16px', border: '1px dashed #e5e7eb' }}>
                              <LockIcon />
                              {user ? 'Enroll in this course to access the full lesson.' : 'Log in and enroll to unlock lesson content.'}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </section>

          {/* Instructor */}
          <section style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 16, padding: '24px 28px' }}>
            <h2 style={{ fontFamily: 'Manrope, sans-serif', fontSize: 20, fontWeight: 800, margin: '0 0 20px', color: '#111827' }}>Meet your instructor</h2>
            <div style={{ display: 'flex', gap: 20 }}>
              {/* Avatar */}
              <div style={{ flexShrink: 0 }}>
                {course.teacherId?.avatar ? (
                  <img src={`${IMG_BASE}${course.teacherId.avatar}`} alt="" style={{ width: 88, height: 88, borderRadius: '50%', objectFit: 'cover', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                ) : (
                  <div style={{ width: 88, height: 88, borderRadius: '50%', background: 'linear-gradient(135deg, #1e40af, #7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, fontWeight: 800, color: '#fff' }}>
                    {course.teacherId?.name?.[0]?.toUpperCase()}
                  </div>
                )}
              </div>

              <div style={{ flex: 1 }}>
                <h3 style={{ fontFamily: 'Manrope, sans-serif', fontSize: 20, fontWeight: 800, margin: '0 0 4px', color: '#111827' }}>
                  {course.teacherId?.name}
                </h3>
                {teacher?.headline && (
                  <p style={{ fontSize: 14, fontWeight: 600, color: '#7c3aed', margin: '0 0 12px' }}>{teacher.headline}</p>
                )}
                {!teacher?.headline && (
                  <p style={{ fontSize: 13, fontWeight: 500, color: '#6b7280', margin: '0 0 12px' }}>Expert Instructor at Brainlaya</p>
                )}

                {/* Stats strip */}
                <div style={{ display: 'flex', gap: 24, marginBottom: teacher?.bio ? 16 : 0, flexWrap: 'wrap' }}>
                  {[
                    { icon: '⭐', val: '4.8', label: 'Avg. rating' },
                    { icon: '👥', val: enrollmentCount.toLocaleString(), label: 'Students' },
                    { icon: '📚', val: `${lessons.length}`, label: 'Lessons' },
                    teacher?.teachingExperience?.length > 0 && { icon: '🏆', val: `${teacher.teachingExperience.length}+`, label: 'Years exp.' },
                  ].filter(Boolean).map(({ icon, val, label }) => (
                    <div key={label}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 15, fontWeight: 700, color: '#111827' }}>
                        <span>{icon}</span>{val}
                      </div>
                      <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 2 }}>{label}</div>
                    </div>
                  ))}
                </div>

                {teacher?.bio && (
                  <p style={{ fontSize: 14, lineHeight: 1.75, color: '#4b5563', margin: 0, display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {teacher.bio}
                  </p>
                )}

                {teacher && (
                  <Link to={`/users/${course.teacherId?._id}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, marginTop: 12, fontSize: 13, fontWeight: 600, color: '#2563eb', textDecoration: 'none' }}>
                    View full profile <ArrowUpRight />
                  </Link>
                )}
              </div>
            </div>
          </section>

          {/* Reviews */}
          <section style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 16, padding: '24px 28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <h2 style={{ fontFamily: 'Manrope, sans-serif', fontSize: 20, fontWeight: 800, margin: 0, color: '#111827' }}>Student reviews</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <RatingStars rating={4.9} size={14} />
                <span style={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>4.9</span>
                <span style={{ fontSize: 13, color: '#6b7280' }}>course rating</span>
              </div>
            </div>

            {/* Rating bars */}
            <div style={{ display: 'grid', gridTemplateColumns: '110px 1fr 40px', gap: '10px 12px', alignItems: 'center', marginBottom: 24 }}>
              {[
                { label: '5 stars', pct: 92, color: '#f59e0b' },
                { label: '4 stars', pct: 6, color: '#f59e0b' },
                { label: '3 stars', pct: 1.5, color: '#d97706' },
                { label: '2 stars', pct: 0.3, color: '#ef4444' },
                { label: '1 star', pct: 0.2, color: '#ef4444' },
              ].map(({ label, pct, color }) => (
                <>
                  <span key={`l-${label}`} style={{ fontSize: 13, color: '#374151', fontWeight: 500 }}>{label}</span>
                  <div key={`b-${label}`} style={{ height: 8, background: '#f3f4f6', borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{ height: '100%', background: color, borderRadius: 4, width: `${pct}%`, transition: 'width 0.5s' }} />
                  </div>
                  <span key={`p-${label}`} style={{ fontSize: 13, fontWeight: 600, color: '#6b7280', textAlign: 'right' }}>{pct}%</span>
                </>
              ))}
            </div>

            {/* Sample review cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {[
                { name: 'Jordan P.', initials: 'JP', color: '#2563eb', bg: '#eff6ff', days: '5 days ago', text: 'Outstanding course! The explanations are crystal clear and the content is immediately applicable. This is exactly what I needed to level up my skills.' },
                { name: 'Mia L.', initials: 'ML', color: '#7c3aed', bg: '#f5f3ff', days: '2 weeks ago', text: 'The instructor really knows their material. Each lesson builds on the last perfectly. I went from complete beginner to confident practitioner.' },
              ].map(({ name, initials, color, bg, days, text }) => (
                <div key={name} style={{ padding: '18px 20px', background: '#fafbff', border: '1px solid #f0f4ff', borderRadius: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                    <div style={{ width: 42, height: 42, borderRadius: '50%', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color, flexShrink: 0 }}>
                      {initials}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>{name}</span>
                        <span style={{ fontSize: 12, color: '#9ca3af' }}>{days}</span>
                      </div>
                      <RatingStars rating={5} size={12} />
                    </div>
                  </div>
                  <p style={{ fontSize: 14, lineHeight: 1.7, color: '#4b5563', margin: 0 }}>"{text}"</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* RIGHT SIDEBAR */}
        <div style={{ position: 'sticky', top: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Quick stats card */}
          <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 14, padding: '20px 20px 18px' }}>
            <h4 style={{ fontSize: 13, fontWeight: 700, color: '#374151', margin: '0 0 14px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Course at a glance</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {[
                { icon: '📖', label: 'Lessons', val: lessons.length },
                { icon: '👥', label: 'Enrolled', val: enrollmentCount.toLocaleString() },
                { icon: '⭐', label: 'Rating', val: '4.9 / 5' },
                { icon: '🌐', label: 'Language', val: course.language || 'English' },
                { icon: '📅', label: 'Updated', val: formatDate(course.updatedAt) },
                { icon: '🏷️', label: 'Level', val: 'All levels' },
              ].map(({ icon, label, val }) => (
                <div key={label} style={{ padding: '10px 12px', background: '#f8fafc', borderRadius: 8, border: '1px solid #f0f4f8' }}>
                  <div style={{ fontSize: 16, marginBottom: 4 }}>{icon}</div>
                  <div style={{ fontSize: 10, fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#111827', marginTop: 2 }}>{val}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Category tags */}
          <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 14, padding: '18px 20px' }}>
            <h4 style={{ fontSize: 13, fontWeight: 700, color: '#374151', margin: '0 0 12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Tags</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {[course.category, 'Beginner', 'Certification', 'Self-paced', 'Expert-led'].map(tag => (
                <span key={tag} style={{ background: '#f0f4ff', color: '#3730a3', border: '1px solid #c7d2fe', borderRadius: 6, padding: '4px 10px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Related courses */}
          {relatedCourses.length > 0 && (
            <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 14, padding: '18px 20px' }}>
              <h4 style={{ fontSize: 13, fontWeight: 700, color: '#374151', margin: '0 0 14px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Students also viewed</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {relatedCourses.map((rc) => (
                  <Link key={rc._id} to={`/courses/${rc._id}`}
                    style={{ display: 'flex', gap: 12, padding: '10px 12px', background: '#f8fafc', border: '1px solid #f0f4f8', borderRadius: 10, textDecoration: 'none', transition: 'all 0.15s' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#c7d2fe'; e.currentTarget.style.background = '#f0f4ff' }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = '#f0f4f8'; e.currentTarget.style.background = '#f8fafc' }}
                  >
                    <div style={{ width: 60, height: 48, borderRadius: 6, overflow: 'hidden', background: 'linear-gradient(135deg, #1e3a8a, #7c3aed)', flexShrink: 0 }}>
                      {rc.thumbnail && <img src={`${IMG_BASE}${rc.thumbnail}`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }} />}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ margin: '0 0 4px', fontSize: 13, fontWeight: 600, color: '#111827', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.4 }}>{rc.title}</p>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: 11, color: '#9ca3af' }}>{rc.category}</span>
                        <span style={{ fontSize: 13, fontWeight: 700, color: rc.price ? '#2563eb' : '#16a34a' }}>{rc.price ? `$${rc.price}` : 'Free'}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              <Link to="/courses" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, marginTop: 14, fontSize: 13, fontWeight: 600, color: '#2563eb', textDecoration: 'none' }}>
                Browse all courses <ArrowUpRight />
              </Link>
            </div>
          )}

          {/* Help card */}
          <div style={{ background: 'linear-gradient(135deg, #0f172a, #1e3a8a)', borderRadius: 14, padding: '20px', textAlign: 'center' }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>🎓</div>
            <p style={{ fontSize: 14, fontWeight: 700, color: '#fff', margin: '0 0 6px' }}>Have questions?</p>
            <p style={{ fontSize: 12, color: '#93c5fd', margin: '0 0 14px', lineHeight: 1.5 }}>Our team is here to help you make the most of your learning journey.</p>
            <button style={{ width: '100%', padding: '10px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.1)', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CourseDetail
