import DashboardShell from '../components/DashboardShell'
import { useNotificationStore } from '../store/notificationStore'
import { useMarkNotificationRead, useMarkAllNotificationsRead } from '../api/notifications'

const TYPE_META = {
  new_lesson:           { bg: '#eff6ff', icon: '#2563eb', emoji: '📚', label: 'New Lesson' },
  enrollment_confirmed: { bg: '#f0fdf4', icon: '#16a34a', emoji: '✅', label: 'Enrolled' },
  course_update:        { bg: '#fefce8', icon: '#ca8a04', emoji: '📢', label: 'Announcement' },
  course_announcement:  { bg: '#fefce8', icon: '#ca8a04', emoji: '📢', label: 'Announcement' },
  new_enrollment:       { bg: '#f5f3ff', icon: '#7c3aed', emoji: '🎉', label: 'Enrollment' },
  default:              { bg: '#f5f3ff', icon: '#7c3aed', emoji: '🔔', label: 'Update' },
}

function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.round(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.round(mins / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.round(hours / 24)}d ago`
}

function CheckAllIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12 7 17 22 7" /><path d="M7 12l5 5" />
    </svg>
  )
}

function StudentNotifications() {
  const notifications = useNotificationStore((s) => s.items)
  const unreadCount = useNotificationStore((s) => s.unreadCount)
  const markOne = useMarkNotificationRead()
  const markAll = useMarkAllNotificationsRead()

  const unread = notifications.filter((n) => !n.read)
  const read = notifications.filter((n) => n.read)

  return (
    <DashboardShell active="Notifications">
      <div className="mb-7 flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-extrabold text-on-surface">Notifications</h1>
          <p className="mt-1 text-sm text-on-surface-variant">
            {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}` : 'All caught up!'}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            type="button"
            onClick={() => markAll.mutate()}
            disabled={markAll.isPending}
            className="flex items-center gap-2 rounded-xl border border-surface-dim px-4 py-2 text-sm font-semibold text-on-surface-variant hover:border-secondary hover:text-secondary transition-colors disabled:opacity-50"
          >
            <CheckAllIcon /> Mark all read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="flex flex-col items-center rounded-2xl border border-surface-dim bg-surface-container-lowest py-20 text-center">
          <span className="mb-4 text-5xl">🔔</span>
          <p className="text-lg font-bold text-on-surface">No notifications yet</p>
          <p className="mt-2 max-w-xs text-sm text-on-surface-variant">
            Enroll in a course to start receiving updates about new lessons, announcements, and more.
          </p>
        </div>
      ) : (
        <div className="max-w-2xl space-y-6">
          {unread.length > 0 && (
            <div>
              <h2 className="mb-3 text-xs font-bold uppercase tracking-widest text-on-surface-variant">Unread</h2>
              <div className="space-y-2">
                {unread.map((n) => {
                  const meta = TYPE_META[n.type] || TYPE_META.default
                  return (
                    <div
                      key={n._id}
                      className="flex items-start gap-4 rounded-2xl border border-blue-100 bg-blue-50/50 p-4 cursor-pointer transition-all hover:border-blue-200"
                      onClick={() => !n.read && markOne.mutate(n._id)}
                    >
                      <span
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-lg"
                        style={{ background: meta.bg }}
                      >
                        {meta.emoji}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide" style={{ background: meta.bg, color: meta.icon }}>
                            {meta.label}
                          </span>
                          <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
                          <span className="text-xs text-on-surface-variant">{timeAgo(n.createdAt)}</span>
                        </div>
                        <p className="mt-1 text-sm font-medium text-on-surface leading-snug">{n.message}</p>
                      </div>
                      <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-secondary" />
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {read.length > 0 && (
            <div>
              <h2 className="mb-3 text-xs font-bold uppercase tracking-widest text-on-surface-variant">Earlier</h2>
              <div className="space-y-2">
                {read.map((n) => {
                  const meta = TYPE_META[n.type] || TYPE_META.default
                  return (
                    <div
                      key={n._id}
                      className="flex items-start gap-4 rounded-2xl border border-surface-dim bg-surface-container-lowest p-4"
                    >
                      <span
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-lg opacity-70"
                        style={{ background: meta.bg }}
                      >
                        {meta.emoji}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide opacity-70" style={{ background: meta.bg, color: meta.icon }}>
                            {meta.label}
                          </span>
                          <span className="text-xs text-on-surface-variant">{timeAgo(n.createdAt)}</span>
                        </div>
                        <p className="mt-1 text-sm text-on-surface-variant leading-snug">{n.message}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </DashboardShell>
  )
}

export default StudentNotifications
