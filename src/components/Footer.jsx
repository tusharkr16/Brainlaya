import { useState } from 'react'

function GlobeIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a14 14 0 0 1 0 18 14 14 0 0 1 0-18Z" />
    </svg>
  )
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m4 7 8 6 8-6" />
    </svg>
  )
}

function ChatIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 5h16v11H8l-4 4V5Z" />
    </svg>
  )
}

const COLUMNS = [
  {
    title: 'Platform',
    links: ['Courses', 'Mentors', 'Pricing'],
  },
  {
    title: 'Support',
    links: ['Contact', 'Privacy Policy', 'Terms of Service'],
  },
]

function Footer() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e) => {
    e.preventDefault()
    if (!email) return
    setSubscribed(true)
    setEmail('')
  }

  return (
    <footer className="border-t border-surface-dim bg-[#dde3f7] px-16 py-16 max-lg:px-6 max-lg:py-12">
      <div className="mx-auto grid max-w-7xl grid-cols-[1.3fr_1fr_1fr_1.3fr] gap-10 max-lg:grid-cols-2 max-sm:grid-cols-1">
        <div>
          <p className="mb-3 text-2xl font-extrabold text-on-surface">Brainlaya</p>
          <p className="mb-4 text-sm leading-relaxed text-on-surface-variant">
            &copy; 2026 Brainlaya EdTech.
            <br />
            Empowering learners worldwide.
          </p>
          <div className="flex gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-surface-dim text-on-surface">
              <GlobeIcon />
            </span>
            <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-surface-dim text-on-surface">
              <MailIcon />
            </span>
            <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-surface-dim text-on-surface">
              <ChatIcon />
            </span>
          </div>
        </div>

        {COLUMNS.map((col) => (
          <div key={col.title}>
            <h3 className="mb-4 font-bold text-on-surface">{col.title}</h3>
            <ul className="flex flex-col gap-3">
              {col.links.map((link) => (
                <li key={link}>
                  <a href="#" className="text-sm text-on-surface-variant transition-colors hover:text-on-surface">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div>
          <h3 className="mb-4 font-bold text-on-surface">Newsletter</h3>
          <p className="mb-4 text-sm text-on-surface-variant">
            Get the latest course updates and offers.
          </p>
          <form onSubmit={handleSubscribe} className="flex flex-col gap-3">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className="rounded-lg border border-surface-dim bg-surface-container-lowest px-4 py-2.5 text-sm text-on-surface outline-none focus:border-secondary"
            />
            <button
              type="submit"
              className="rounded-lg bg-secondary px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-secondary-hover"
            >
              {subscribed ? 'Subscribed!' : 'Subscribe'}
            </button>
          </form>
        </div>
      </div>
    </footer>
  )
}

export default Footer
