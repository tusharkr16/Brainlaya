import { useState } from 'react'
import DashboardShell from '../components/DashboardShell'

const FAQS = [
  {
    q: 'How do I enroll in a course?',
    a: 'Go to Explore Courses, find a course you like, and click "Enroll Now" on the course detail page. Free courses are instantly accessible after enrollment.',
  },
  {
    q: 'How do I join a live class?',
    a: 'Open the course in My Learning, go to the Live Classes tab. When a session is about to start, the "Join Session" button activates — it stays disabled until the scheduled time.',
  },
  {
    q: 'Where are my notes saved?',
    a: 'Notes are saved per-lesson in the Notes tab inside each course. Click "Save Notes" after writing — your notes are stored securely and only visible to you.',
  },
  {
    q: 'How do I submit an assignment?',
    a: 'Go to the Assignments tab inside the course. Click "Submit assignment →" under any pending assignment, write your answer, and hit Submit.',
  },
  {
    q: 'How do I earn a certificate?',
    a: 'Complete 100% of a course by marking all lessons as done. A certificate will then appear in your Certificates page.',
  },
  {
    q: 'Can I re-watch recorded sessions?',
    a: 'Yes — recordings are available in the Recordings tab inside each course, once your teacher uploads the session link.',
  },
  {
    q: 'How do I change my password?',
    a: "Go to Settings in the sidebar and use the Change Password section. You will need your current password to set a new one.",
  },
  {
    q: 'I found a bug or have a suggestion. What should I do?',
    a: 'Please reach out via the contact email below. We read every message and prioritize your feedback.',
  },
]

function ChevronIcon({ open }) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
      <polyline points="6 9 12 15 18 9" />
    </svg>
  )
}

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-surface-dim last:border-0">
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className="flex w-full items-center justify-between gap-4 py-4 text-left text-sm font-semibold text-on-surface hover:text-secondary transition-colors"
      >
        {q}
        <span className="shrink-0 text-on-surface-variant"><ChevronIcon open={open} /></span>
      </button>
      {open && (
        <p className="pb-4 text-sm leading-relaxed text-on-surface-variant">{a}</p>
      )}
    </div>
  )
}

function HelpPage() {
  return (
    <DashboardShell active="Help">
      <div className="mb-7">
        <h1 className="text-3xl font-extrabold text-on-surface">Help & Support</h1>
        <p className="mt-1 text-sm text-on-surface-variant">Find answers to common questions or get in touch.</p>
      </div>

      <div className="max-w-2xl space-y-6">
        {/* FAQ */}
        <div className="rounded-2xl border border-surface-dim bg-surface-container-lowest px-6">
          <h2 className="pt-5 pb-3 font-bold text-on-surface">Frequently Asked Questions</h2>
          {FAQS.map((f) => <FAQItem key={f.q} {...f} />)}
        </div>

        {/* Contact */}
        <div className="rounded-2xl border border-surface-dim bg-surface-container-lowest p-6">
          <h2 className="mb-1 font-bold text-on-surface">Still need help?</h2>
          <p className="text-sm text-on-surface-variant mb-4">
            Our support team is here for you. We typically respond within one business day.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <a
              href="mailto:support@brainlaya.dev"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-secondary px-5 py-2.5 text-sm font-bold text-white hover:opacity-90 transition-all"
            >
              Email Support
            </a>
            <a
              href="https://github.com/tusharkr16/Brainlaya/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-surface-dim px-5 py-2.5 text-sm font-semibold text-on-surface hover:border-secondary hover:text-secondary transition-all"
            >
              Report a Bug on GitHub
            </a>
          </div>
        </div>
      </div>
    </DashboardShell>
  )
}

export default HelpPage
