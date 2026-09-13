import { useEffect } from 'react'
import { useAuthStore } from '../store/authStore'
import { useNotificationStore } from '../store/notificationStore'
import { connectSocket, disconnectSocket } from '../lib/socket'
import { api } from '../lib/api'

// Mounted once near the app root. Owns the socket lifecycle: connects when a
// user is authenticated, tears down on logout, and keeps the notification
// store in sync with both the initial fetch and live 'notification:new'
// events. Socket.IO's own client already retries on drop, so we only need to
// reflect connect/disconnect into the store for the UI to show a banner.
function RealtimeProvider() {
  const user = useAuthStore((s) => s.user)
  const accessToken = useAuthStore((s) => s.accessToken)
  const setAll = useNotificationStore((s) => s.setAll)
  const addOne = useNotificationStore((s) => s.addOne)
  const setConnected = useNotificationStore((s) => s.setConnected)
  const reset = useNotificationStore((s) => s.reset)

  useEffect(() => {
    if (!user || !accessToken) {
      disconnectSocket()
      reset()
      return
    }

    api
      .get('/notifications?limit=20')
      .then((res) => setAll(res.data, res.meta.unreadCount))
      .catch(() => {})

    const socket = connectSocket(accessToken)
    socket.on('connect', () => setConnected(true))
    socket.on('disconnect', () => setConnected(false))
    socket.on('connect_error', () => setConnected(false))
    socket.on('notification:new', (notification) => addOne(notification))

    return () => {
      socket.off('connect')
      socket.off('disconnect')
      socket.off('connect_error')
      socket.off('notification:new')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, accessToken])

  return null
}

export default RealtimeProvider
