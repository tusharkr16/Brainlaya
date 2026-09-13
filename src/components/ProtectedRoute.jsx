import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { LoadingState } from './StateViews'

const HOME_BY_ROLE = { teacher: '/teacher', student: '/student', admin: '/admin' }

// roles: optional array — omit to just require "logged in", any role.
function ProtectedRoute({ roles, children }) {
  const status = useAuthStore((s) => s.status)
  const user = useAuthStore((s) => s.user)
  const location = useLocation()

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface">
        <LoadingState label="Checking your session…" />
      </div>
    )
  }

  if (!user) return <Navigate to="/login" state={{ from: location.pathname }} replace />

  if (roles && !roles.includes(user.role)) {
    return <Navigate to={HOME_BY_ROLE[user.role] || '/'} replace />
  }

  return children
}

export default ProtectedRoute
