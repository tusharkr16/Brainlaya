import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { BrandMark } from '../components/icons'
import { authApi } from '../lib/authApi'
import { useAuthStore } from '../store/authStore'

const HOME_BY_ROLE = { teacher: '/teacher', student: '/student' }

function Signup() {
  const navigate = useNavigate()
  const [role, setRole] = useState('student')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const res = await authApi.signup({ name, email, password, role })
      useAuthStore.getState().setSession(res.data.user, res.data.accessToken)
      navigate(HOME_BY_ROLE[res.data.user.role] || '/')
    } catch (err) {
      setError(err.message || 'Something went wrong, try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="grid min-h-[calc(100vh-4rem)] lg:grid-cols-2">
      <div className="relative hidden flex-col justify-between overflow-hidden bg-brand-green px-12 py-14 text-white lg:flex">
        <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-secondary/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-16 h-80 w-80 rounded-full bg-accent-marketing/20 blur-3xl" />

        <BrandMark />

        <div className="relative">
          <h1 className="text-4xl leading-tight font-extrabold">Start Your Learning Journey</h1>
          <p className="mt-4 max-w-sm text-base text-white/80">
            Create a free account to unlock every course, mentor, and skill track on Brainlaya.
          </p>
        </div>

        <p className="relative text-sm text-white/60">Trusted by learners across 40+ countries</p>
      </div>

      <div className="flex items-center justify-center bg-surface px-6 py-16">
        <div className="w-full max-w-md rounded-2xl border border-surface-dim bg-surface-container-lowest p-8 shadow-[var(--shadow-card-sm)]">
          <h2 className="mb-2 text-3xl font-extrabold text-on-surface">Create your account</h2>
          <p className="mb-6 text-sm text-on-surface-variant">It only takes a minute to get started.</p>

          <div className="mb-6 grid grid-cols-2 gap-2 rounded-xl border border-surface-dim bg-surface-container-low p-1">
            {[
              { key: 'student', label: 'I want to learn' },
              { key: 'teacher', label: 'I want to teach' },
            ].map((opt) => (
              <button
                key={opt.key}
                type="button"
                onClick={() => setRole(opt.key)}
                className={
                  role === opt.key
                    ? 'rounded-lg bg-secondary py-2.5 text-sm font-bold text-white transition-colors'
                    : 'rounded-lg py-2.5 text-sm font-semibold text-on-surface-variant transition-colors hover:text-on-surface'
                }
              >
                {opt.label}
              </button>
            ))}
          </div>

          {error && (
            <p role="alert" className="mb-4 rounded-lg bg-error/10 px-4 py-2.5 text-sm font-medium text-error">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <label className="flex flex-col gap-1.5">
              <span className="font-mono text-xs font-medium tracking-wide text-on-surface-variant uppercase">
                Full name
              </span>
              <input
                type="text"
                required
                minLength={2}
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Doe"
                className="rounded-xl border border-surface-dim bg-surface-container-low px-4 py-3 text-sm text-on-surface outline-none placeholder:text-on-surface-variant focus:border-secondary"
              />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="font-mono text-xs font-medium tracking-wide text-on-surface-variant uppercase">
                Email
              </span>
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
              <span className="font-mono text-xs font-medium tracking-wide text-on-surface-variant uppercase">
                Password
              </span>
              <input
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters"
                className="rounded-xl border border-surface-dim bg-surface-container-low px-4 py-3 text-sm text-on-surface outline-none placeholder:text-on-surface-variant focus:border-secondary"
              />
            </label>

            <button
              type="submit"
              disabled={submitting}
              className="mt-2 rounded-lg bg-secondary py-3 text-sm font-bold text-white transition-colors hover:bg-secondary-hover disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? 'Creating account…' : 'Create Account'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-on-surface-variant">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-secondary">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Signup
