import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { render } from '@testing-library/react'
import { vi } from 'vitest'

// Renders with the same providers main.jsx sets up (minus AuthHydrator/
// RealtimeProvider, which reach out to the network on mount) so components
// that call useQuery/useMutation or useNavigate work as they do in the app.
// Pass `path` (e.g. "/courses/:id") when the component reads useParams —
// without it, `route` is rendered directly with no param matching.
export function renderWithProviders(ui, { route = '/', path } = {}) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[route]}>
        {path ? <Routes><Route path={path} element={ui} /></Routes> : ui}
      </MemoryRouter>
    </QueryClientProvider>
  )
}

export function jsonResponse(data, status = 200) {
  return {
    ok: status < 400,
    status,
    headers: { get: () => 'application/json' },
    json: async () => data,
  }
}

// Installs a fetch mock keyed by "METHOD /path" (path matched as substring),
// falling through to a 404 for anything unlisted so a missing stub fails
// loudly instead of hanging. Each route's value is either the raw JSON body
// to return (200), a function returning [data, status] for custom statuses,
// or a function returning a full mocked Response for edge cases.
export function mockFetch(routes) {
  global.fetch = vi.fn((url, options = {}) => {
    const method = (options.method || 'GET').toUpperCase()
    const path = new URL(url).pathname + new URL(url).search
    const key = Object.keys(routes).find((k) => {
      const [m, p] = k.split(' ')
      return m === method && path.includes(p)
    })
    if (!key) return Promise.resolve(jsonResponse({ success: false, message: `No mock for ${method} ${path}` }, 404))

    const value = routes[key]
    if (typeof value !== 'function') return Promise.resolve(jsonResponse(value))
    const result = value()
    if (Array.isArray(result)) return Promise.resolve(jsonResponse(...result))
    return Promise.resolve(result)
  })
  return global.fetch
}
