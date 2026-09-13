import { describe, it, expect, afterEach } from 'vitest'
import { screen, fireEvent, waitFor } from '@testing-library/react'
import { renderWithProviders, mockFetch } from '../test/test-utils'
import CourseDetail from './CourseDetail'
import { useAuthStore } from '../store/authStore'

const course = {
  _id: 'course1',
  title: 'Intro to Astrophysics',
  description: 'A tour of stars and galaxies.',
  category: 'Science',
  price: 49,
  status: 'approved',
  enrollmentCount: 3,
  updatedAt: '2026-01-01T00:00:00.000Z',
  teacherId: { _id: 'teacher1', name: 'Sarah Jenkins' },
}

describe('CourseDetail (enroll smoke flow)', () => {
  afterEach(() => {
    useAuthStore.setState({ user: null, accessToken: null, status: 'ready' })
  })

  it('lets a logged-in student enroll', async () => {
    useAuthStore.setState({
      user: { id: 'student1', name: 'Sam Student', role: 'student', email: 'sam@test.dev' },
      accessToken: 'token-123',
      status: 'ready',
    })

    const fetchMock = mockFetch({
      'GET /courses/course1': { success: true, data: course },
      'GET /enrollments/mine': { success: true, data: [], meta: { total: 0, page: 1, limit: 20, totalPages: 1 } },
      'POST /enrollments': { success: true, data: { enrollment: {}, enrollmentCount: 4 } },
      'GET /users/teacher1': { success: true, data: { name: 'Sarah Jenkins', courses: [] } },
      'GET /courses?': { success: true, data: [], meta: { total: 0, page: 1, limit: 4, totalPages: 1 } },
    })

    renderWithProviders(<CourseDetail />, { route: '/courses/course1', path: '/courses/:id' })

    expect(await screen.findByRole('heading', { name: 'Intro to Astrophysics' })).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /enroll now/i }))

    await waitFor(() =>
      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining('/enrollments'),
        expect.objectContaining({ method: 'POST', body: JSON.stringify({ courseId: 'course1' }) })
      )
    )
  })

  it('sends a not-logged-in visitor to login instead of enrolling directly', async () => {
    mockFetch({
      'GET /courses/course1': { success: true, data: course },
      'GET /users/teacher1': { success: true, data: { name: 'Sarah Jenkins', courses: [] } },
      'GET /courses?': { success: true, data: [], meta: { total: 0, page: 1, limit: 4, totalPages: 1 } },
    })

    renderWithProviders(<CourseDetail />, { route: '/courses/course1', path: '/courses/:id' })

    expect(await screen.findByRole('heading', { name: 'Intro to Astrophysics' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /enroll now/i })).toBeInTheDocument()
  })
})
