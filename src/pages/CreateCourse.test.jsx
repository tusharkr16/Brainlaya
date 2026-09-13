import { describe, it, expect, afterEach } from 'vitest'
import { screen, fireEvent, waitFor } from '@testing-library/react'
import { renderWithProviders, mockFetch } from '../test/test-utils'
import CreateCourse from './CreateCourse'
import { useAuthStore } from '../store/authStore'

describe('CreateCourse (teacher smoke flow)', () => {
  afterEach(() => {
    useAuthStore.setState({ user: null, accessToken: null, status: 'ready' })
  })

  it('submits the form and posts a new draft course', async () => {
    useAuthStore.setState({
      user: { id: 't1', name: 'Sarah Jenkins', role: 'teacher', email: 'sarah@test.dev' },
      accessToken: 'token-123',
      status: 'ready',
    })

    const fetchMock = mockFetch({
      'POST /courses': { success: true, data: { _id: 'course1', title: 'New Course' } },
    })

    renderWithProviders(<CreateCourse />)

    fireEvent.change(screen.getByLabelText(/course title/i), { target: { value: 'Data Structures 101' } })
    fireEvent.change(screen.getByLabelText(/category/i), { target: { value: 'Technology' } })
    fireEvent.click(screen.getByLabelText(/free/i))
    fireEvent.change(screen.getByLabelText(/description/i), { target: { value: 'Learn arrays, lists and trees.' } })
    fireEvent.click(screen.getByRole('button', { name: /create course/i }))

    await waitFor(() =>
      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining('/courses'),
        expect.objectContaining({ method: 'POST' })
      )
    )

    const call = fetchMock.mock.calls.find(([url, opts]) => opts?.method === 'POST' && url.includes('/courses'))
    const body = JSON.parse(call[1].body)
    expect(body).toMatchObject({ title: 'Data Structures 101', category: 'Technology', description: 'Learn arrays, lists and trees.', price: null })
  })
})
