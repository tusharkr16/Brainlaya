import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '../lib/api'

export function useAssignments(courseId) {
  return useQuery({
    queryKey: ['assignments', courseId],
    queryFn: () => api.get(`/assignments/course/${courseId}`),
    enabled: Boolean(courseId),
  })
}

export function useCreateAssignment() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body) => api.post('/assignments', body),
    onSuccess: (_, vars) => qc.invalidateQueries({ queryKey: ['assignments', vars.courseId] }),
  })
}

export function useDeleteAssignment(courseId) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id) => api.delete(`/assignments/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['assignments', courseId] }),
  })
}

export function useSubmitAssignment(assignmentId) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body) => api.post(`/assignments/${assignmentId}/submit`, { body }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['submission', assignmentId] }),
  })
}

export function useMySubmission(assignmentId) {
  return useQuery({
    queryKey: ['submission', assignmentId],
    queryFn: () => api.get(`/assignments/${assignmentId}/submission`),
    enabled: Boolean(assignmentId),
  })
}

export function useAssignmentSubmissions(assignmentId) {
  return useQuery({
    queryKey: ['submissions', assignmentId],
    queryFn: () => api.get(`/assignments/${assignmentId}/submissions`),
    enabled: Boolean(assignmentId),
  })
}

export function useGradeSubmission(assignmentId) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ submissionId, score, feedback }) =>
      api.patch(`/assignments/${assignmentId}/submissions/${submissionId}/grade`, { score, feedback }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['submissions', assignmentId] }),
  })
}
