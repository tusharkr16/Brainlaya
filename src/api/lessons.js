import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '../lib/api'

export function useLessons(courseId, enabled = true) {
  return useQuery({
    queryKey: ['lessons', courseId],
    queryFn: () => api.get(`/lessons/course/${courseId}`),
    enabled: Boolean(courseId) && enabled,
  })
}

export function useCreateLesson(courseId) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body) => api.post(`/lessons/course/${courseId}`, body),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['lessons', courseId] }),
  })
}

export function useUpdateLesson(courseId) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, body }) => api.patch(`/lessons/${id}`, body),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['lessons', courseId] }),
  })
}

export function useDeleteLesson(courseId) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id) => api.delete(`/lessons/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['lessons', courseId] }),
  })
}

export function useCompleteLesson(courseId) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id) => api.post(`/lessons/${id}/complete`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['lessons', courseId] })
      qc.invalidateQueries({ queryKey: ['myEnrollments'] })
    },
  })
}
