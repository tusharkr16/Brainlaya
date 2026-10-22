import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '../lib/api'

export function useSchedule() {
  return useQuery({
    queryKey: ['schedule'],
    queryFn: () => api.get('/schedule'),
  })
}

export function useCreateScheduleEntry() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (entry) => api.post('/schedule', entry),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['schedule'] }),
  })
}

export function useDeleteScheduleEntry() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id) => api.delete(`/schedule/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['schedule'] }),
  })
}
