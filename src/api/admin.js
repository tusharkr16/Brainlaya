import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '../lib/api'

function toQueryString(params = {}) {
  const usp = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') usp.set(key, value)
  })
  const qs = usp.toString()
  return qs ? `?${qs}` : ''
}

export function usePendingCourses(filters = {}) {
  return useQuery({
    queryKey: ['adminPendingCourses', filters],
    queryFn: () => api.get(`/admin/courses/pending${toQueryString(filters)}`),
  })
}

export function useAdminCourses(filters = {}) {
  return useQuery({
    queryKey: ['adminCourses', filters],
    queryFn: () => api.get(`/admin/courses${toQueryString(filters)}`),
    placeholderData: (prev) => prev,
  })
}

function invalidateCourseQueries(qc) {
  qc.invalidateQueries({ queryKey: ['adminPendingCourses'] })
  qc.invalidateQueries({ queryKey: ['adminCourses'] })
  qc.invalidateQueries({ queryKey: ['courses'] })
}

export function useApproveCourse() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id) => api.post(`/admin/courses/${id}/approve`),
    onSuccess: () => invalidateCourseQueries(qc),
  })
}

export function useRejectCourse() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, reason }) => api.post(`/admin/courses/${id}/reject`, { reason }),
    onSuccess: () => invalidateCourseQueries(qc),
  })
}

export function useArchiveCourse() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id) => api.post(`/admin/courses/${id}/archive`),
    onSuccess: () => invalidateCourseQueries(qc),
  })
}

export function useAdminUsers(filters = {}) {
  return useQuery({
    queryKey: ['adminUsers', filters],
    queryFn: () => api.get(`/admin/users${toQueryString(filters)}`),
    placeholderData: (prev) => prev,
  })
}

function invalidateUserQueries(qc) {
  qc.invalidateQueries({ queryKey: ['adminUsers'] })
}

export function useSuspendUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id) => api.patch(`/admin/users/${id}/suspend`),
    onSuccess: () => invalidateUserQueries(qc),
  })
}

export function useReactivateUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id) => api.patch(`/admin/users/${id}/reactivate`),
    onSuccess: () => invalidateUserQueries(qc),
  })
}

export function useChangeUserRole() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, role }) => api.patch(`/admin/users/${id}/role`, { role }),
    onSuccess: () => invalidateUserQueries(qc),
  })
}

export function useResetUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, confirmEmail }) => api.post(`/admin/users/${id}/reset`, { confirmEmail }),
    onSuccess: () => invalidateUserQueries(qc),
  })
}

export function useAuditLog(filters = {}) {
  return useQuery({
    queryKey: ['auditLog', filters],
    queryFn: () => api.get(`/admin/audit-log${toQueryString(filters)}`),
    placeholderData: (prev) => prev,
  })
}

export function useAdminStats() {
  return useQuery({
    queryKey: ['adminStats'],
    queryFn: () => api.get('/admin/stats'),
    refetchInterval: 30_000,
  })
}
