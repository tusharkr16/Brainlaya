import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '../lib/api'

export function useMyEnrollments(enabled = true) {
  return useQuery({
    queryKey: ['myEnrollments'],
    queryFn: () => api.get('/enrollments/mine'),
    enabled,
  })
}

export function useEnroll() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (courseId) => api.post('/enrollments', { courseId }),
    onSuccess: (_, courseId) => {
      qc.invalidateQueries({ queryKey: ['myEnrollments'] })
      qc.invalidateQueries({ queryKey: ['course', courseId] })
      qc.invalidateQueries({ queryKey: ['courses'] })
    },
  })
}

export function useUnenroll() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (courseId) => api.delete(`/enrollments/${courseId}`),
    onSuccess: (_, courseId) => {
      qc.invalidateQueries({ queryKey: ['myEnrollments'] })
      qc.invalidateQueries({ queryKey: ['course', courseId] })
      qc.invalidateQueries({ queryKey: ['courses'] })
    },
  })
}
