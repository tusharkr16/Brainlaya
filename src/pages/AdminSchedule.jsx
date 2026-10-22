import { useState } from 'react'
import DashboardShell from '../components/DashboardShell'
import { Modal } from '@/components/ui/modal'
import { useSchedule, useCreateScheduleEntry, useDeleteScheduleEntry } from '../api/schedule'
import { useAdminCourses } from '../api/admin'
import { LoadingState, ErrorState, EmptyState } from '../components/StateViews'

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
// ClassSchedule.dayOfWeek is 0=Sun..6=Sat; DAYS above is Mon-first for display.
const DAY_INDEX = [1, 2, 3, 4, 5, 6, 0]

const START_HOUR = 8
const END_HOUR = 18
const HOUR_HEIGHT = 64

const CHIP_COLORS = ['#7fa8ff', '#ffc94d', '#c4a6ff', '#ff8fa3', '#9fe6c0']

function timeToMinutes(t) {
  const [h, m] = t.split(':').map(Number)
  return h * 60 + m
}

function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
      <path d="M12 5v14M5 12h14" />
    </svg>
  )
}

function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m-8 0 1 12a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1l1-12" />
    </svg>
  )
}

function AddClassModal({ courses, onClose }) {
  const createEntry = useCreateScheduleEntry()
  const [form, setForm] = useState({
    courseId: courses[0]?._id || '',
    title: '',
    dayOfWeek: 1,
    startTime: '09:00',
    endTime: '10:00',
    color: CHIP_COLORS[0],
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    createEntry.mutate(
      { ...form, dayOfWeek: Number(form.dayOfWeek) },
      { onSuccess: onClose }
    )
  }

  return (
    <Modal open onClose={onClose} className="max-w-md p-7">
      <h3 className="mb-5 text-xl font-bold text-on-surface">Schedule a class</h3>
      {createEntry.error && (
        <p className="mb-4 rounded-lg bg-error/10 px-4 py-2.5 text-sm font-medium text-error">{createEntry.error.message}</p>
      )}
      {courses.length === 0 ? (
        <p className="text-sm text-on-surface-variant">No approved courses to schedule yet.</p>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
          <select
            value={form.courseId}
            onChange={(e) => setForm((f) => ({ ...f, courseId: e.target.value }))}
            className="rounded-lg border border-surface-dim px-4 py-2.5 text-sm text-on-surface outline-none focus:border-secondary"
          >
            {courses.map((c) => (
              <option key={c._id} value={c._id}>
                {c.title}
              </option>
            ))}
          </select>
          <input
            type="text"
            required
            placeholder="Session title, e.g. Welcome to the Cosmos"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            className="rounded-lg border border-surface-dim px-4 py-2.5 text-sm text-on-surface outline-none focus:border-secondary"
          />
          <select
            value={form.dayOfWeek}
            onChange={(e) => setForm((f) => ({ ...f, dayOfWeek: e.target.value }))}
            className="rounded-lg border border-surface-dim px-4 py-2.5 text-sm text-on-surface outline-none focus:border-secondary"
          >
            {DAYS.map((label, i) => (
              <option key={label} value={DAY_INDEX[i]}>
                {label}
              </option>
            ))}
          </select>
          <div className="flex gap-3">
            <input
              type="time"
              required
              value={form.startTime}
              onChange={(e) => setForm((f) => ({ ...f, startTime: e.target.value }))}
              className="flex-1 rounded-lg border border-surface-dim px-4 py-2.5 text-sm text-on-surface outline-none focus:border-secondary"
            />
            <input
              type="time"
              required
              value={form.endTime}
              onChange={(e) => setForm((f) => ({ ...f, endTime: e.target.value }))}
              className="flex-1 rounded-lg border border-surface-dim px-4 py-2.5 text-sm text-on-surface outline-none focus:border-secondary"
            />
          </div>
          <div className="flex items-center gap-2">
            {CHIP_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setForm((f) => ({ ...f, color: c }))}
                aria-label={`Color ${c}`}
                className="h-7 w-7 rounded-full transition-transform"
                style={{ background: c, transform: form.color === c ? 'scale(1.15)' : 'scale(1)', boxShadow: form.color === c ? '0 0 0 2px white, 0 0 0 4px ' + c : 'none' }}
              />
            ))}
          </div>
          <button
            type="submit"
            disabled={createEntry.isPending}
            className="rounded-lg bg-secondary py-2.5 text-sm font-bold text-white transition-colors hover:bg-secondary-hover disabled:opacity-50"
          >
            {createEntry.isPending ? 'Scheduling…' : 'Schedule Class'}
          </button>
        </form>
      )}
    </Modal>
  )
}

function ClassChip({ entry, onDelete }) {
  const top = ((timeToMinutes(entry.startTime) - START_HOUR * 60) / 60) * HOUR_HEIGHT
  const height = Math.max(((timeToMinutes(entry.endTime) - timeToMinutes(entry.startTime)) / 60) * HOUR_HEIGHT, 28)

  return (
    <div
      className="group absolute inset-x-1 overflow-hidden rounded-lg px-2 py-1 text-left"
      style={{ top, height, background: `${entry.color}26`, borderLeft: `3px solid ${entry.color}` }}
    >
      <p className="truncate text-[11px] font-semibold" style={{ color: entry.color }}>
        {entry.title}
      </p>
      <p className="truncate text-[10px] text-on-surface-variant">
        {entry.startTime}–{entry.endTime}
      </p>
      <button
        type="button"
        onClick={() => onDelete(entry._id)}
        aria-label={`Remove ${entry.title}`}
        className="absolute top-1 right-1 hidden h-5 w-5 items-center justify-center rounded-full bg-white text-error shadow-sm group-hover:flex"
      >
        <TrashIcon />
      </button>
    </div>
  )
}

function WeekCalendar({ entries, onDelete }) {
  const hours = Array.from({ length: END_HOUR - START_HOUR + 1 }, (_, i) => START_HOUR + i)

  return (
    <div className="overflow-x-auto">
      <div className="grid min-w-[820px] grid-cols-[64px_repeat(7,1fr)]">
        <div className="border-b border-surface-dim" />
        {DAYS.map((label) => (
          <div key={label} className="border-b border-surface-dim px-2 py-3 text-center text-sm font-semibold text-on-surface">
            {label}
          </div>
        ))}

        <div className="relative" style={{ height: (END_HOUR - START_HOUR) * HOUR_HEIGHT }}>
          {hours.slice(0, -1).map((h, i) => (
            <div
              key={h}
              className="absolute right-2 -translate-y-2 text-xs text-on-surface-variant"
              style={{ top: i * HOUR_HEIGHT }}
            >
              {String(h).padStart(2, '0')}:00
            </div>
          ))}
        </div>

        {DAY_INDEX.map((dayNum) => (
          <div key={dayNum} className="relative border-l border-surface-dim" style={{ height: (END_HOUR - START_HOUR) * HOUR_HEIGHT }}>
            {hours.slice(0, -1).map((h, i) => (
              <div key={h} className="absolute inset-x-0 border-t border-surface-dim" style={{ top: i * HOUR_HEIGHT }} />
            ))}
            {entries
              .filter((e) => e.dayOfWeek === dayNum)
              .map((e) => (
                <ClassChip key={e._id} entry={e} onDelete={onDelete} />
              ))}
          </div>
        ))}
      </div>
    </div>
  )
}

function AdminSchedule() {
  const { data, isPending, isError, error, refetch } = useSchedule()
  const { data: coursesData } = useAdminCourses({ status: 'approved', limit: 100 })
  const deleteEntry = useDeleteScheduleEntry()
  const [adding, setAdding] = useState(false)

  const entries = data?.data || []
  const approvedCourses = coursesData?.data || []

  return (
    <DashboardShell active="Schedule">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-on-surface">Class Schedule</h1>
          <p className="mt-1 text-on-surface-variant">Every scheduled class across the platform, by day and time.</p>
        </div>
        <button
          type="button"
          onClick={() => setAdding(true)}
          className="flex items-center gap-2 rounded-xl bg-secondary px-4 py-2.5 text-sm font-bold text-white shadow-[var(--shadow-card-sm)] transition-colors hover:bg-secondary-hover"
        >
          <PlusIcon />
          Schedule Class
        </button>
      </div>

      {isPending && <LoadingState />}
      {isError && <ErrorState message={error.message} onRetry={refetch} />}

      {!isPending && !isError && (
        <div className="rounded-2xl border border-surface-dim p-5">
          {entries.length === 0 ? (
            <EmptyState title="No classes scheduled yet" description="Schedule your first class to see it here." />
          ) : (
            <WeekCalendar entries={entries} onDelete={(id) => deleteEntry.mutate(id)} />
          )}
        </div>
      )}

      {adding && <AddClassModal courses={approvedCourses} onClose={() => setAdding(false)} />}
    </DashboardShell>
  )
}

export default AdminSchedule
