import { useAuthStore } from '../store/authStore'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api'

export class ApiError extends Error {
  constructor(message, status, errors) {
    super(message)
    this.status = status
    this.errors = errors
  }
}

async function rawRequest(path, { method = 'GET', body, token, isFormData = false } = {}) {
  const headers = {}
  if (!isFormData) headers['Content-Type'] = 'application/json'
  if (token) headers.Authorization = `Bearer ${token}`

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    credentials: 'include', // send the httpOnly refresh cookie
    body: body === undefined ? undefined : isFormData ? body : JSON.stringify(body),
  })

  const isJson = res.headers.get('content-type')?.includes('application/json')
  const payload = isJson ? await res.json() : null

  if (!res.ok) {
    throw new ApiError(payload?.message || res.statusText, res.status, payload?.errors)
  }
  return payload
}

let refreshPromise = null

// Refreshes the access token exactly once even if many requests 401 at the
// same time, by sharing a single in-flight refresh call.
async function refreshAccessToken() {
  if (!refreshPromise) {
    refreshPromise = rawRequest('/auth/refresh', { method: 'POST' })
      .then((payload) => {
        useAuthStore.getState().setSession(payload.data.user, payload.data.accessToken)
        return payload.data.accessToken
      })
      .catch((err) => {
        useAuthStore.getState().clear()
        throw err
      })
      .finally(() => {
        refreshPromise = null
      })
  }
  return refreshPromise
}

// Public request helper: attaches the current access token, and on a 401
// (except from auth endpoints themselves) tries one silent refresh + retry.
export async function apiRequest(path, options = {}) {
  const token = useAuthStore.getState().accessToken
  try {
    return await rawRequest(path, { ...options, token })
  } catch (err) {
    const isAuthRoute = path.startsWith('/auth/')
    if (err instanceof ApiError && err.status === 401 && !isAuthRoute && token) {
      const newToken = await refreshAccessToken()
      return rawRequest(path, { ...options, token: newToken })
    }
    throw err
  }
}

export const api = {
  get: (path) => apiRequest(path),
  post: (path, body) => apiRequest(path, { method: 'POST', body }),
  patch: (path, body) => apiRequest(path, { method: 'PATCH', body }),
  delete: (path) => apiRequest(path, { method: 'DELETE' }),
  upload: (path, formData) => apiRequest(path, { method: 'POST', body: formData, isFormData: true }),
}
