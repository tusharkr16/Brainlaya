import { describe, it, expect, afterEach, beforeEach } from 'vitest'
import { screen, fireEvent, waitFor } from '@testing-library/react'
import { renderWithProviders, mockFetch } from '../test/test-utils'
import Login from './Login'
import { useAuthStore } from '../store/authStore'

describe('Login', () => {
  beforeEach(() => {
    useAuthStore.setState({ user: null, accessToken: null, status: 'ready' })
  })
  afterEach(() => {
    useAuthStore.setState({ user: null, accessToken: null, status: 'ready' })
  })

  it('logs in and stores the session on valid credentials', async () => {
    const fetchMock = mockFetch({
      'POST /auth/login': {
        success: true,
        data: { user: { id: 'u1', name: 'Sam Student', email: 'sam@test.dev', role: 'student' }, accessToken: 'token-123' },
      },
    })

    renderWithProviders(<Login />)

    fireEvent.change(screen.getByPlaceholderText('you@example.com'), { target: { value: 'sam@test.dev' } })
    fireEvent.change(screen.getByPlaceholderText('••••••••'), { target: { value: 'Password123!' } })
    fireEvent.click(screen.getByRole('button', { name: /continue/i }))

    await waitFor(() => expect(useAuthStore.getState().user?.email).toBe('sam@test.dev'))
    expect(useAuthStore.getState().accessToken).toBe('token-123')
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/auth/login'),
      expect.objectContaining({ method: 'POST' })
    )
  })

  it('shows an error message on invalid credentials and does not set a session', async () => {
    mockFetch({
      'POST /auth/login': () => [{ success: false, message: 'Invalid email or password' }, 401],
    })

    renderWithProviders(<Login />)

    fireEvent.change(screen.getByPlaceholderText('you@example.com'), { target: { value: 'sam@test.dev' } })
    fireEvent.change(screen.getByPlaceholderText('••••••••'), { target: { value: 'wrong' } })
    fireEvent.click(screen.getByRole('button', { name: /continue/i }))

    expect(await screen.findByRole('alert')).toHaveTextContent('Invalid email or password')
    expect(useAuthStore.getState().user).toBeNull()
  })
})
