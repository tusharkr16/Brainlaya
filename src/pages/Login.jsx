import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { authApi } from '../lib/authApi'
import { useAuthStore } from '../store/authStore'

const TRENDING = ['AI & Machine Learning', 'Full-Stack Development', 'UX/UI Design Principles', 'Digital Marketing Pro']
const HOME_BY_ROLE = { teacher: '/teacher', student: '/student', admin: '/admin' }

function TrendUpIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/60">
      <path d="M7 17 17 7M8 7h9v9" />
    </svg>
  )
}

function ArrowRightIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  )
}

function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const res = await authApi.login({ email, password })
      useAuthStore.getState().setSession(res.data.user, res.data.accessToken)
      navigate(location.state?.from || HOME_BY_ROLE[res.data.user.role] || '/')
    } catch (err) {
      setError(err.message || 'Something went wrong, try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-blue-900 via-secondary to-secondary">
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-[28rem] w-[28rem] rounded-full bg-brand-green opacity-80 blur-3xl" />

      <div className="relative mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl items-center gap-12 px-8 py-16 max-lg:px-4 max-lg:py-10 lg:grid-cols-2">
        <div className="hidden flex-col gap-8 lg:flex">
          <span className="w-fit rounded-full border border-white/25 bg-white/15 px-4 py-1.5 text-xs font-semibold text-white">
            Future Ready Learning
          </span>

          <div>
            <h1 className="text-5xl leading-[1.1] font-extrabold text-white">
              Master the skills that
              <br />
              <span className="text-cyan-300">shape the future.</span>
            </h1>
            <p className="mt-6 max-w-md text-base text-white/80">
              Join over 2 million learners worldwide and gain access to industry-leading courses designed by experts.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-md">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm font-semibold text-white">Trending Now</span>
                <TrendUpIcon />
              </div>
              <ul className="flex flex-col gap-2">
                {TRENDING.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-xs text-white/85">
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-300" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-md">
              <p className="text-xs leading-relaxed text-white/90 italic">
                &ldquo;Brainlaya changed my career trajectory. The community is incredible!&rdquo;
              </p>
              <div className="mt-4 flex items-center gap-2.5">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-cyan-300 text-xs font-bold text-brand-green">
                  SJ
                </span>
                <div>
                  <p className="text-xs font-semibold text-white">Sarah Jenkins</p>
                  <p className="text-[11px] text-white/60">Sr. Product Designer</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto w-full max-w-md rounded-3xl border border-white/30 bg-white/25 p-6 shadow-2xl backdrop-blur-xl sm:p-10">
          <h2 className="text-center text-3xl font-extrabold text-on-surface">Welcome back</h2>
          <p className="mt-2 text-center text-sm text-on-surface-variant">Log in to continue to your dashboard.</p>

          {error && (
            <p role="alert" className="mt-6 rounded-lg bg-error/10 px-4 py-2.5 text-center text-sm font-medium text-error">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-on-surface">Email</span>
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="rounded-xl border border-surface-dim bg-surface-container-low px-4 py-3 text-sm text-on-surface outline-none placeholder:text-on-surface-variant focus:border-secondary"
              />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-on-surface">Password</span>
              <input
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="rounded-xl border border-surface-dim bg-surface-container-low px-4 py-3 text-sm text-on-surface outline-none placeholder:text-on-surface-variant focus:border-secondary"
              />
            </label>

            <button
              type="submit"
              disabled={submitting}
              className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-secondary py-3 text-sm font-bold text-white transition-colors hover:bg-secondary-hover disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? 'Logging in…' : 'Continue'}
              {!submitting && <ArrowRightIcon />}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-on-surface-variant">
            Don&apos;t have an account?{' '}
            <Link to="/signup" className="font-semibold text-secondary">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
