import { create } from 'zustand'

// accessToken deliberately lives only in memory (never localStorage) — the
// refresh token is an httpOnly cookie, so a page reload just calls
// /auth/refresh once (see hydrate()) instead of persisting the access token
// somewhere an XSS bug could read it.
export const useAuthStore = create((set) => ({
  user: null,
  accessToken: null,
  status: 'loading', // 'loading' | 'ready'

  setSession: (user, accessToken) => set({ user, accessToken, status: 'ready' }),
  clear: () => set({ user: null, accessToken: null, status: 'ready' }),
}))
