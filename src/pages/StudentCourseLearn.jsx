import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import DashboardShell from '../components/DashboardShell'
import LessonPlayer from '../components/LessonPlayer'
import { useCourse } from '../api/courses'
import { useLessons } from '../api/lessons'
import { useAssignments, useSubmitAssignment, useMySubmission } from '../api/assignments'
import { useNote, useSaveNote } from '../api/notes'
import { LoadingState } from '../components/StateViews'

function BookIcon() {
  return <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></svg>
}
function VideoIcon() {
  return <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="6" width="14" height="12" rx="2" /><path d="m22 8-6 4 6 4V8Z" /></svg>
}
function ListIcon() {
  return <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" /></svg>
}
function PenIcon() {
  return <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" /></svg>
}
function ClipboardIcon() {
  return <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="4.5" width="14" height="17" rx="2" /><path d="M9 4V3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1" /><path d="m9 13 2 2 4-4" /></svg>
}
function PlayIcon() {
  return <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3" /></svg>
}
function ExternalIcon() {
  return <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14 21 3" /></svg>
}

// ─── Notes Tab ────────────────────────────────────────────────────────────────
function NotesTab({ lessons }) {
  const [selectedLesson, setSelectedLesson] = useState(lessons[0]?._id || null)
  if (!lessons.length) return (
    <div className="flex flex-col items-center py-16 text-center">
      <span className="mb-3 text-4xl">📝</span>
      <p className="font-semibold text-on-surface">No lessons yet</p>
    </div>
  )
  return (
    <div className="flex gap-5 max-w-4xl max-lg:flex-col">
      <div className="w-56 shrink-0 max-lg:w-full">
        <p className="mb-2 text-xs font-bold uppercase tracking-widest text-on-surface-variant">Lessons</p>
        <ul className="space-y-1">
          {lessons.map((l, i) => (
            <li key={l._id}>
              <button
                type="button"
                onClick={() => setSelectedLesson(l._id)}
                className={`w-full text-left rounded-xl px-3 py-2.5 text-sm transition-colors ${
                  selectedLesson === l._id
                    ? 'bg-[#eaf1ff] font-semibold text-secondary'
                    : 'text-on-surface-variant hover:bg-surface-container-low'
                }`}
              >
                <span className="font-bold mr-2">{i + 1}.</span>{l.title}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex-1 min-w-0">
        {selectedLesson && <NoteEditor lessonId={selectedLesson} />}
      </div>
    </div>
  )
}

function NoteEditor({ lessonId }) {
  const { data, isPending } = useNote(lessonId)
  const save = useSaveNote(lessonId)
  const [text, setText] = useState(null)
  const [saved, setSaved] = useState(false)

  const body = text !== null ? text : (data?.data?.body || '')

  if (isPending) return <LoadingState />

  const handleSave = async () => {
    await save.mutateAsync(body)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-on-surface">Your notes for this lesson</p>
        {saved && <span className="text-xs font-semibold text-green-600">Saved ✓</span>}
      </div>
      <textarea
        value={body}
        onChange={(e) => { setText(e.target.value); setSaved(false) }}
        placeholder="Write your notes here… ideas, questions, key points."
        rows={14}
        className="w-full rounded-2xl border border-surface-dim bg-surface-container-lowest px-4 py-3 text-sm text-on-surface outline-none placeholder:text-on-surface-variant focus:border-secondary focus:ring-2 focus:ring-secondary/20 resize-y transition-all"
      />
      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleSave}
          disabled={save.isPending}
          className="rounded-xl bg-secondary px-5 py-2 text-sm font-bold text-white hover:opacity-90 disabled:opacity-50 transition-all"
        >
          {save.isPending ? 'Saving…' : 'Save Notes'}
        </button>
      </div>
    </div>
  )
}

// ─── Assignments Tab ───────────────────────────────────────────────────────────
function AssignmentsTab({ courseId }) {
  const { data, isPending } = useAssignments(courseId)
  const assignments = data?.data || []

  if (isPending) return <LoadingState />

  if (!assignments.length) return (
    <div className="flex flex-col items-center py-16 text-center">
      <span className="mb-3 text-4xl">📋</span>
      <p className="font-semibold text-on-surface">No assignments yet</p>
      <p className="mt-1 text-sm text-on-surface-variant">Your teacher hasn't posted any assignments yet.</p>
    </div>
  )

  return (
    <div className="max-w-2xl space-y-4">
      {assignments.map((a) => <AssignmentCard key={a._id} assignment={a} />)}
    </div>
  )
}

function AssignmentCard({ assignment: a }) {
  const [open, setOpen] = useState(false)
  const [text, setText] = useState('')
  const submit = useSubmitAssignment(a._id)
  const { data: subData } = useMySubmission(a._id)
  const submission = subData?.data

  const isOverdue = a.dueDate && new Date(a.dueDate) < new Date()

  return (
    <div className="rounded-2xl border border-surface-dim bg-surface-container-lowest overflow-hidden">
      <div className="flex items-start gap-4 p-5">
        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${submission ? 'bg-green-50 text-green-700' : 'bg-blue-50 text-secondary'}`}>
          <ClipboardIcon />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <p className="font-semibold text-on-surface">{a.title}</p>
            {submission ? (
              <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">Submitted</span>
            ) : isOverdue ? (
              <span className="rounded-full bg-red-50 border border-red-200 px-3 py-1 text-xs font-bold text-red-600">Overdue</span>
            ) : (
              <span className="rounded-full bg-amber-50 border border-amber-200 px-3 py-1 text-xs font-bold text-amber-700">Pending</span>
            )}
          </div>
          {a.description && <p className="mt-1 text-sm text-on-surface-variant">{a.description}</p>}
          <div className="mt-2 flex items-center gap-4 text-xs text-on-surface-variant flex-wrap">
            <span>Max score: <strong className="text-on-surface">{a.maxScore}</strong></span>
            {a.dueDate && (
              <span>Due: <strong className={isOverdue ? 'text-red-600' : 'text-on-surface'}>
                {new Date(a.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
              </strong></span>
            )}
            {submission?.score !== null && submission?.score !== undefined && (
              <span className="text-green-700 font-semibold">Score: {submission.score}/{a.maxScore}</span>
            )}
          </div>
        </div>
      </div>

      {/* Submission area */}
      {submission ? (
        <div className="border-t border-surface-dim bg-surface-container-low px-5 py-4">
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-on-surface-variant">Your Submission</p>
          <p className="text-sm text-on-surface whitespace-pre-wrap">{submission.body}</p>
          {submission.feedback && (
            <div className="mt-3 rounded-xl bg-blue-50 border border-blue-100 p-3">
              <p className="text-xs font-bold text-secondary mb-1">Instructor Feedback</p>
              <p className="text-sm text-on-surface">{submission.feedback}</p>
            </div>
          )}
        </div>
      ) : (
        <div className="border-t border-surface-dim px-5 py-4">
          {!open ? (
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="text-sm font-semibold text-secondary hover:underline"
            >
              Submit assignment →
            </button>
          ) : (
            <div className="space-y-3">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Write your answer here…"
                rows={5}
                className="w-full rounded-xl border border-surface-dim bg-surface-container-lowest px-4 py-3 text-sm text-on-surface outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 resize-y"
              />
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={async () => {
                    await submit.mutateAsync(text)
                    setOpen(false)
                  }}
                  disabled={!text.trim() || submit.isPending}
                  className="rounded-xl bg-secondary px-5 py-2 text-sm font-bold text-white hover:opacity-90 disabled:opacity-50"
                >
                  {submit.isPending ? 'Submitting…' : 'Submit'}
                </button>
                <button type="button" onClick={() => setOpen(false)} className="text-sm text-on-surface-variant hover:text-on-surface">
                  Cancel
                </button>
                {submit.error && <p className="text-xs text-red-600">{submit.error.message}</p>}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Recordings Tab ────────────────────────────────────────────────────────────
function RecordingsTab({ lessons }) {
  const withRecordings = lessons.filter((l) => l.recordingLink)
  if (!withRecordings.length) return (
    <div className="flex flex-col items-center py-16 text-center">
      <span className="mb-3 text-4xl">🎥</span>
      <p className="font-semibold text-on-surface">No recordings yet</p>
      <p className="mt-1 text-sm text-on-surface-variant max-w-xs">When your teacher uploads session recordings, they'll appear here.</p>
    </div>
  )
  return (
    <div className="max-w-2xl space-y-3">
      {withRecordings.map((l, i) => (
        <div key={l._id} className="flex items-start gap-4 rounded-2xl border border-surface-dim bg-surface-container-lowest p-5 hover:border-secondary/40 transition-all">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-700">
            <VideoIcon />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-on-surface">{l.title}</p>
            {l.scheduledAt && (
              <p className="mt-0.5 text-xs text-on-surface-variant">
                Session: {new Date(l.scheduledAt).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
              </p>
            )}
            <a
              href={l.recordingLink}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-1.5 rounded-xl border border-purple-200 bg-purple-50 px-3 py-1.5 text-xs font-semibold text-purple-700 hover:bg-purple-100 transition-colors"
            >
              <PlayIcon /> Watch Recording <ExternalIcon />
            </a>
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── Overview Tab ─────────────────────────────────────────────────────────────
function OverviewTab({ course }) {
  if (!course) return <LoadingState />
  const IMG_BASE = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5001'
  return (
    <div className="max-w-2xl space-y-6">
      {course.thumbnail && (
        <div className="overflow-hidden rounded-2xl">
          <img src={`${IMG_BASE}${course.thumbnail}`} alt={course.title} className="w-full object-cover max-h-56" />
        </div>
      )}
      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-secondary">{course.category}</span>
        <h2 className="mt-1 text-2xl font-extrabold text-on-surface">{course.title}</h2>
        {course.description && (
          <p className="mt-3 text-sm leading-relaxed text-on-surface-variant whitespace-pre-line">{course.description}</p>
        )}
      </div>
      {course.outcomes?.length > 0 && (
        <div className="rounded-2xl border border-surface-dim bg-surface-container-low p-5">
          <h3 className="mb-3 font-bold text-on-surface">What you'll learn</h3>
          <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {course.outcomes.map((o, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-on-surface-variant">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-700 text-[10px] font-bold">✓</span>
                {o}
              </li>
            ))}
          </ul>
        </div>
      )}
      {course.requirements?.length > 0 && (
        <div className="rounded-2xl border border-surface-dim p-5">
          <h3 className="mb-3 font-bold text-on-surface">Requirements</h3>
          <ul className="list-disc list-inside space-y-1 text-sm text-on-surface-variant">
            {course.requirements.map((r, i) => <li key={i}>{r}</li>)}
          </ul>
        </div>
      )}
    </div>
  )
}

// ─── Live Classes Tab ─────────────────────────────────────────────────────────
function LiveClassesTab({ lessons }) {
  const liveLessons = lessons.filter((l) => l.meetingLink && l.scheduledAt)
  const always = lessons.filter((l) => l.meetingLink && !l.scheduledAt)
  if (!liveLessons.length && !always.length) {
    return (
      <div className="flex flex-col items-center py-16 text-center">
        <span className="mb-3 text-4xl">📡</span>
        <p className="font-semibold text-on-surface">No live classes scheduled yet</p>
        <p className="mt-1 text-sm text-on-surface-variant">Your teacher will add live session details here.</p>
      </div>
    )
  }
  return (
    <div className="max-w-2xl space-y-4">
      {liveLessons.map((l) => {
        const dt = new Date(l.scheduledAt)
        const remaining = dt.getTime() - Date.now()
        const isLive = remaining <= 0
        return (
          <div key={l._id} className="flex items-start gap-4 rounded-2xl border border-surface-dim bg-surface-container-lowest p-5">
            <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${isLive ? 'bg-green-100 text-green-700' : 'bg-blue-50 text-secondary'}`}>
              <VideoIcon />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-on-surface">{l.title}</p>
              <p className="mt-0.5 text-xs text-on-surface-variant">
                {dt.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })} · {dt.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
              </p>
              <div className="mt-3">
                {isLive ? (
                  <a href={l.meetingLink} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold text-white"
                    style={{ background: 'linear-gradient(135deg, #16a34a, #15803d)' }}>
                    <PlayIcon /> Join Now <ExternalIcon />
                  </a>
                ) : (
                  <span className="inline-flex items-center gap-1.5 rounded-xl bg-amber-50 border border-amber-200 px-3 py-1.5 text-xs font-semibold text-amber-700">
                    Starts {remaining > 86400000 ? `in ${Math.floor(remaining / 86400000)}d` : remaining > 3600000 ? `in ${Math.floor(remaining / 3600000)}h` : `in ${Math.floor(remaining / 60000)}m`}
                  </span>
                )}
              </div>
            </div>
          </div>
        )
      })}
      {always.map((l) => (
        <div key={l._id} className="flex items-start gap-4 rounded-2xl border border-surface-dim bg-surface-container-lowest p-5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-50 text-green-700"><VideoIcon /></div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-on-surface">{l.title}</p>
            <p className="mt-0.5 text-xs text-on-surface-variant">Always available</p>
            <a href={l.meetingLink} target="_blank" rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-1.5 rounded-xl bg-green-50 border border-green-200 px-3 py-1.5 text-xs font-semibold text-green-700 hover:bg-green-100 transition-colors">
              <PlayIcon /> Join Session <ExternalIcon />
            </a>
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
const TABS = [
  { id: 'curriculum',  label: 'Curriculum',   icon: ListIcon },
  { id: 'live',        label: 'Live Classes',  icon: VideoIcon },
  { id: 'recordings',  label: 'Recordings',   icon: PlayIcon },
  { id: 'notes',       label: 'Notes',         icon: PenIcon },
  { id: 'assignments', label: 'Assignments',   icon: ClipboardIcon },
  { id: 'overview',    label: 'Overview',      icon: BookIcon },
]

function StudentCourseLearn() {
  const { id } = useParams()
  const [tab, setTab] = useState('curriculum')
  const { data: courseData } = useCourse(id)
  const { data: lessonsData } = useLessons(id)
  const { data: assignmentsData } = useAssignments(id)
  const course = courseData?.data
  const lessons = lessonsData?.data || []

  const liveCount    = lessons.filter((l) => l.meetingLink).length
  const recCount     = lessons.filter((l) => l.recordingLink).length
  const asmtCount    = assignmentsData?.data?.length || 0

  return (
    <DashboardShell active="My Learning">
      <div className="mb-5 flex items-center gap-2 text-sm text-on-surface-variant">
        <Link to="/student/courses" className="hover:text-secondary transition-colors">My Learning</Link>
        <span>/</span>
        <span className="text-on-surface font-semibold line-clamp-1">{course?.title || '…'}</span>
      </div>

      <div className="mb-6 flex gap-0 border-b border-surface-dim overflow-x-auto">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`flex shrink-0 items-center gap-2 px-4 py-3 text-sm font-semibold transition-all border-b-2 -mb-px ${
              tab === t.id
                ? 'border-secondary text-secondary'
                : 'border-transparent text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <t.icon />
            {t.label}
            {t.id === 'live' && liveCount > 0 && (
              <span className="rounded-full bg-blue-100 px-1.5 py-0.5 text-[10px] font-bold text-secondary">{liveCount}</span>
            )}
            {t.id === 'recordings' && recCount > 0 && (
              <span className="rounded-full bg-purple-100 px-1.5 py-0.5 text-[10px] font-bold text-purple-700">{recCount}</span>
            )}
            {t.id === 'assignments' && asmtCount > 0 && (
              <span className="rounded-full bg-orange-100 px-1.5 py-0.5 text-[10px] font-bold text-orange-700">{asmtCount}</span>
            )}
          </button>
        ))}
      </div>

      {tab === 'curriculum'  && <LessonPlayer courseId={id} />}
      {tab === 'live'        && <LiveClassesTab lessons={lessons} />}
      {tab === 'recordings'  && <RecordingsTab lessons={lessons} />}
      {tab === 'notes'       && <NotesTab lessons={lessons} />}
      {tab === 'assignments' && <AssignmentsTab courseId={id} />}
      {tab === 'overview'    && <OverviewTab course={course} />}
    </DashboardShell>
  )
}

export default StudentCourseLearn
