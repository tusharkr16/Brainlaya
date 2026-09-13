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

export function useCourses(filters = {}, enabled = true) {
  return useQuery({
    queryKey: ['courses', filters],
    queryFn: () => api.get(`/courses${toQueryString(filters)}`),
    placeholderData: (prev) => prev,
    enabled,
  })
}

export function useCourse(id) {
  return useQuery({
    queryKey: ['course', id],
    queryFn: () => api.get(`/courses/${id}`),
    enabled: Boolean(id),
  })
}

export function useMyCourses(filters = {}) {
  return useQuery({
    queryKey: ['myCourses', filters],
    queryFn: () => api.get(`/courses/mine${toQueryString(filters)}`),
  })
}

export function useCourseStudents(id) {
  return useQuery({
    queryKey: ['courseStudents', id],
    queryFn: () => api.get(`/courses/${id}/students`),
    enabled: Boolean(id),
  })
}

export function useCreateCourse() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body) => api.post('/courses', body),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['myCourses'] }),
  })
}

export function useUpdateCourse() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, body }) => api.patch(`/courses/${id}`, body),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: ['myCourses'] })
      qc.invalidateQueries({ queryKey: ['course', id] })
    },
  })
}

export function useSubmitCourse() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id) => api.post(`/courses/${id}/submit`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['myCourses'] }),
  })
}

export function useDeleteCourse() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, force }) => api.delete(`/courses/${id}${force ? '?force=true' : ''}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['myCourses'] })
      qc.invalidateQueries({ queryKey: ['adminCourses'] })
    },
  })
}

export function usePostAnnouncement() {
  return useMutation({
    mutationFn: ({ id, message }) => api.post(`/courses/${id}/announcements`, { message }),
  })
}
