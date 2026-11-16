import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { authApi } from '../lib/authApi'
import { useAuthStore } from '../store/authStore'

const HOME_BY_ROLE = { teacher: '/teacher', student: '/student', admin: '/admin' }

const DEMO_ACCOUNTS = [
  { label: 'Student',  email: 'student@brainlaya.dev', role: 'student',  color: '#2563eb' },
  { label: 'Teacher',  email: 'teacher@brainlaya.dev', role: 'teacher',  color: '#059669' },
  { label: 'Admin',    email: 'admin@brainlaya.dev',   role: 'admin',    color: '#7c3aed' },
]
const DEMO_PASSWORD = 'Password123!'

const FEATURES = [
  { icon: '🎓', title: '500+ Expert Courses', desc: 'Technology, Science, Design & more' },
  { icon: '🌍', title: '50k+ Learners', desc: 'Join a global learning community' },
  { icon: '🏆', title: 'Certified Learning', desc: 'Earn credentials that matter' },
  { icon: '⚡', title: 'Learn at Your Pace', desc: 'Self-paced or live sessions' },
]

function ArrowRightIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  )
}

function EyeIcon({ open }) {
  return open ? (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  )
}

function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
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
    <div className="flex min-h-[calc(100vh-4rem)]">

      {/* ── LEFT — brand panel ── */}
      <div
        className="hidden lg:flex lg:w-[52%] flex-col justify-between p-14 relative overflow-hidden"
        style={{ background: 'linear-gradient(145deg, #0f172a 0%, #1e3a8a 50%, #1d4ed8 100%)' }}
      >
        {/* Decorative blobs */}
        <div className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full opacity-20" style={{ background: 'radial-gradient(circle, #60a5fa, transparent)' }} />
        <div className="pointer-events-none absolute bottom-0 -left-24 h-80 w-80 rounded-full opacity-15" style={{ background: 'radial-gradient(circle, #818cf8, transparent)' }} />
        <div className="pointer-events-none absolute top-1/2 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-5" style={{ background: 'radial-gradient(circle, #fff, transparent)' }} />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm">
            <span className="text-lg">🎓</span>
          </div>
          <span className="text-xl font-extrabold text-white tracking-tight">Brainlaya</span>
        </div>

        {/* Main copy */}
        <div className="relative z-10 space-y-10">
          <div>
            <span className="inline-block rounded-full border border-blue-400/40 bg-blue-400/10 px-3.5 py-1.5 text-xs font-semibold text-blue-200 mb-5">
              Trusted by 50,000+ learners worldwide
            </span>
            <h2 className="text-4xl xl:text-5xl font-extrabold text-white leading-[1.1]">
              Master the skills<br />
              <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(90deg, #60a5fa, #a5b4fc)' }}>
                that shape your future.
              </span>
            </h2>
            <p className="mt-4 text-base text-blue-100/80 max-w-sm leading-relaxed">
              Expert-led courses in technology, science, design, and business — learn at your own pace.
            </p>
          </div>

          {/* Feature list */}
          <div className="grid grid-cols-2 gap-3">
            {FEATURES.map(f => (
              <div key={f.title} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                <span className="text-xl shrink-0">{f.icon}</span>
                <div>
                  <p className="text-sm font-semibold text-white">{f.title}</p>
                  <p className="text-xs text-blue-200/70 mt-0.5">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonial */}
        <div className="relative z-10 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
          <div className="flex gap-1 mb-3">
            {[...Array(5)].map((_, i) => <span key={i} className="text-amber-400 text-sm">★</span>)}
          </div>
          <p className="text-sm text-white/90 italic leading-relaxed">
            "Brainlaya transformed my career. I went from zero to landing a junior developer role in 6 months."
          </p>
          <div className="mt-4 flex items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 text-xs font-bold text-white">SJ</span>
            <div>
              <p className="text-sm font-semibold text-white">Sarah Jenkins</p>
              <p className="text-xs text-blue-200/60">Junior Developer · Hired via Brainlaya</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── RIGHT — form panel ── */}
      <div className="flex flex-1 flex-col items-center justify-center bg-white px-6 py-12 lg:px-16">
        {/* Mobile logo */}
        <div className="mb-8 flex items-center gap-2 lg:hidden">
          <span className="text-2xl">🎓</span>
          <span className="text-xl font-extrabold text-gray-900">Brainlaya</span>
        </div>

        <div className="w-full max-w-sm">
          <h1 className="text-3xl font-extrabold text-gray-900">Welcome back</h1>
          <p className="mt-2 text-sm text-gray-500">Log in to continue to your dashboard.</p>

          {error && (
            <div role="alert" className="mt-5 rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-sm font-semibold text-gray-700">Email address</label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="text-sm font-semibold text-gray-700">Password</label>
              <div className="relative">
                <input
                  id="password"
                  type={showPw ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 pr-11 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  tabIndex={-1}
                >
                  <EyeIcon open={showPw} />
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="mt-1 flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold text-white transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              style={{ background: 'linear-gradient(135deg, #1e3a8a, #2563eb)' }}
            >
              {submitting ? 'Logging in…' : 'Log in'}
              {!submitting && <ArrowRightIcon />}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-gray-100" />
            <span className="text-xs text-gray-400 font-medium">or try a demo account</span>
            <div className="h-px flex-1 bg-gray-100" />
          </div>

          {/* Demo accounts */}
          <div className="flex flex-col gap-2">
            {DEMO_ACCOUNTS.map((acc) => (
              <button
                key={acc.email}
                type="button"
                onClick={() => { setEmail(acc.email); setPassword(DEMO_PASSWORD) }}
                className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 px-4 py-2.5 text-left hover:border-blue-200 hover:bg-blue-50 transition-all"
              >
                <span
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                  style={{ background: acc.color }}
                >
                  {acc.label[0]}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-gray-800">{acc.label}</p>
                  <p className="text-xs text-gray-400 truncate">{acc.email}</p>
                </div>
                <span className="text-xs font-medium capitalize text-gray-400 bg-gray-100 rounded-full px-2 py-0.5">{acc.role}</span>
              </button>
            ))}
          </div>
          <p className="mt-2.5 text-center text-xs text-gray-400">
            Password: <code className="font-mono text-gray-600">Password123!</code>
          </p>

          <p className="mt-7 text-center text-sm text-gray-500">
            Don't have an account?{' '}
            <Link to="/signup" className="font-semibold text-blue-600 hover:underline">
              Sign up free
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
