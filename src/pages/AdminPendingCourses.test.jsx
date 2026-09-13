import { describe, it, expect, afterEach } from 'vitest'
import { screen, fireEvent, waitFor } from '@testing-library/react'
import { renderWithProviders, mockFetch } from '../test/test-utils'
import AdminPendingCourses from './AdminPendingCourses'
import { useAuthStore } from '../store/authStore'

describe('AdminPendingCourses (approve smoke flow)', () => {
  afterEach(() => {
    useAuthStore.setState({ user: null, accessToken: null, status: 'ready' })
  })

  it('lists a pending course and approves it', async () => {
    useAuthStore.setState({
      user: { id: 'a1', name: 'Ada Admin', role: 'admin', email: 'admin@test.dev' },
      accessToken: 'token-123',
      status: 'ready',
    })

    const fetchMock = mockFetch({
      'GET /admin/courses/pending': {
        success: true,
        data: [
          {
            _id: 'course1',
            title: 'Modern UX/UI Design',
            category: 'Design',
            status: 'pending_approval',
            teacherId: { name: 'Marcus Lee' },
          },
        ],
        meta: { total: 1, page: 1, limit: 20, totalPages: 1 },
      },
      'POST /admin/courses/course1/approve': { success: true, data: { _id: 'course1', status: 'approved' } },
    })

    renderWithProviders(<AdminPendingCourses />)

    expect(await screen.findByText('Modern UX/UI Design')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /approve/i }))

    await waitFor(() =>
      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining('/admin/courses/course1/approve'),
        expect.objectContaining({ method: 'POST' })
      )
    )
  })

  it('opens the course details modal with the full description', async () => {
    useAuthStore.setState({
      user: { id: 'a1', name: 'Ada Admin', role: 'admin', email: 'admin@test.dev' },
      accessToken: 'token-123',
      status: 'ready',
    })

    mockFetch({
      'GET /admin/courses/pending': {
        success: true,
        data: [
          {
            _id: 'course1',
            title: 'Modern UX/UI Design',
            description: 'Learn the fundamentals of user-centered design.',
            category: 'Design',
            price: 79,
            status: 'pending_approval',
            updatedAt: '2026-01-01T00:00:00.000Z',
            teacherId: { name: 'Marcus Lee', email: 'marcus@test.dev' },
          },
        ],
        meta: { total: 1, page: 1, limit: 20, totalPages: 1 },
      },
      'GET /lessons/course/course1': { success: true, data: [] },
    })

    renderWithProviders(<AdminPendingCourses />)

    expect(await screen.findByText('Modern UX/UI Design')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /view details/i }))

    expect(await screen.findByText('Learn the fundamentals of user-centered design.')).toBeInTheDocument()
    expect(screen.getByText(/marcus@test\.dev/)).toBeInTheDocument()
  })
})
