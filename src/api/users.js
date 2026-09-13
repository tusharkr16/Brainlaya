import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '../lib/api'
import { useAuthStore } from '../store/authStore'

export function useTeacherProfile(id) {
  return useQuery({
    queryKey: ['teacherProfile', id],
    queryFn: () => api.get(`/users/${id}`),
    enabled: Boolean(id),
  })
}

export function useUpdateProfile() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body) => api.patch('/users/me', body),
    onSuccess: (res) => {
      const { accessToken } = useAuthStore.getState()
      useAuthStore.getState().setSession(res.data, accessToken)
      qc.invalidateQueries({ queryKey: ['teacherProfile'] })
    },
  })
}
