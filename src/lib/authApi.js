import { api, apiRequest } from './api'

export const authApi = {
  signup: (data) => apiRequest('/auth/signup', { method: 'POST', body: data }),
  login: (data) => apiRequest('/auth/login', { method: 'POST', body: data }),
  refresh: () => apiRequest('/auth/refresh', { method: 'POST' }),
  logout: () => apiRequest('/auth/logout', { method: 'POST' }),
  me: () => api.get('/auth/me'),
}
