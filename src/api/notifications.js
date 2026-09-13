import { useMutation } from '@tanstack/react-query'
import { api } from '../lib/api'
import { useNotificationStore } from '../store/notificationStore'

export function useMarkNotificationRead() {
  const markOneRead = useNotificationStore((s) => s.markOneRead)
  return useMutation({
    mutationFn: (id) => api.patch(`/notifications/${id}/read`),
    onSuccess: (_, id) => markOneRead(id),
  })
}

export function useMarkAllNotificationsRead() {
  const markAllRead = useNotificationStore((s) => s.markAllRead)
  return useMutation({
    mutationFn: () => api.patch('/notifications/read-all'),
    onSuccess: () => markAllRead(),
  })
}
