import { create } from 'zustand'

export const useNotificationStore = create((set) => ({
  items: [],
  unreadCount: 0,
  connected: true,

  setAll: (items, unreadCount) => set({ items, unreadCount }),
  addOne: (notification) =>
    set((s) => ({ items: [notification, ...s.items].slice(0, 50), unreadCount: s.unreadCount + 1 })),
  markAllRead: () => set((s) => ({ items: s.items.map((n) => ({ ...n, read: true })), unreadCount: 0 })),
  markOneRead: (id) =>
    set((s) => {
      const items = s.items.map((n) => (n._id === id ? { ...n, read: true } : n))
      const wasUnread = s.items.find((n) => n._id === id && !n.read)
      return { items, unreadCount: wasUnread ? Math.max(0, s.unreadCount - 1) : s.unreadCount }
    }),
  setConnected: (connected) => set({ connected }),
  reset: () => set({ items: [], unreadCount: 0, connected: true }),
}))
