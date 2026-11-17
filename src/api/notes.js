import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '../lib/api'

export function useNote(lessonId) {
  return useQuery({
    queryKey: ['note', lessonId],
    queryFn: () => api.get(`/notes/${lessonId}`),
    enabled: Boolean(lessonId),
  })
}

export function useSaveNote(lessonId) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body) => api.put(`/notes/${lessonId}`, { body }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['note', lessonId] }),
  })
}
