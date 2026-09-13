import { useEffect } from 'react'
import { useAuthStore } from '../store/authStore'
import { authApi } from '../lib/authApi'

// Runs once on app load: the access token only ever lives in memory, so a
// hard refresh has none. This silently trades the httpOnly refresh cookie
// (if any) for a fresh access token before the rest of the app renders
// anything that depends on auth state.
function AuthHydrator() {
  useEffect(() => {
    authApi
      .refresh()
      .then((res) => useAuthStore.getState().setSession(res.data.user, res.data.accessToken))
      .catch(() => useAuthStore.getState().clear())
  }, [])

  return null
}

export default AuthHydrator
