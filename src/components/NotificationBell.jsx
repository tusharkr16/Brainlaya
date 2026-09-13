import { useState, useRef, useEffect } from 'react'
import { useNotificationStore } from '../store/notificationStore'
import { useMarkAllNotificationsRead, useMarkNotificationRead } from '../api/notifications'

function BellIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9a6 6 0 1 1 12 0c0 5 2 6 2 6H4s2-1 2-6Z" />
      <path d="M10 19a2 2 0 0 0 4 0" />
    </svg>
  )
}

function timeAgo(iso) {
  const diffMs = Date.now() - new Date(iso).getTime()
  const mins = Math.round(diffMs / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.round(mins / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.round(hours / 24)}d ago`
}

function NotificationBell() {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const items = useNotificationStore((s) => s.items)
  const unreadCount = useNotificationStore((s) => s.unreadCount)
  const connected = useNotificationStore((s) => s.connected)
  const markAllRead = useMarkAllNotificationsRead()
  const markOneRead = useMarkNotificationRead()

  useEffect(() => {
    if (!open) return
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [open])

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        aria-label="Notifications"
        onClick={() => setOpen((o) => !o)}
        className="relative flex h-10 w-10 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-surface-container-low"
      >
        <BellIcon />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-error px-1 text-[10px] font-bold text-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
        {!connected && <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-surface-container-lowest bg-amber-500" title="Reconnecting…" />}
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-80 overflow-hidden rounded-xl border border-surface-dim bg-surface-container-lowest shadow-[var(--shadow-card-lg)]">
          <div className="flex items-center justify-between border-b border-surface-dim p-3.5">
            <p className="text-sm font-bold text-on-surface">Notifications</p>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={() => markAllRead.mutate()}
                className="text-xs font-semibold text-secondary hover:underline"
              >
                Mark all read
              </button>
            )}
          </div>
          <div className="max-h-96 overflow-y-auto">
            {!connected && (
              <p className="bg-amber-50 px-3.5 py-2 text-xs font-medium text-amber-700">Reconnecting to live updates…</p>
            )}
            {items.length === 0 ? (
              <p className="p-6 text-center text-sm text-on-surface-variant">You're all caught up.</p>
            ) : (
              items.map((n) => (
                <button
                  key={n._id}
                  type="button"
                  onClick={() => !n.read && markOneRead.mutate(n._id)}
                  className={
                    n.read
                      ? 'flex w-full flex-col gap-0.5 border-b border-surface-dim px-3.5 py-3 text-left last:border-0'
                      : 'flex w-full flex-col gap-0.5 border-b border-surface-dim bg-accent-design/40 px-3.5 py-3 text-left last:border-0'
                  }
                >
                  <p className="text-sm text-on-surface">{n.message}</p>
                  <span className="text-[11px] text-on-surface-variant">{timeAgo(n.createdAt)}</span>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default NotificationBell
