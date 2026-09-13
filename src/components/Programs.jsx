import { Link } from 'react-router-dom'

function LiveIcon() {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <path d="m10 9 5 3-5 3V9Z" />
    </svg>
  )
}

function AppliedIcon() {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2 2 7l10 5 10-5-10-5Z" />
      <path d="M2 17l10 5 10-5" />
      <path d="M2 12l10 5 10-5" />
    </svg>
  )
}

function ProfessionalIcon() {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="8" width="18" height="11" rx="2" />
      <path d="M8 8V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <path d="M3 13h18" />
    </svg>
  )
}

function SelfPacedIcon() {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="8" />
      <path d="M12 8v4l3 2" />
    </svg>
  )
}

function OtherIcon() {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2v4M12 18v4M4.9 4.9l2.8 2.8M16.3 16.3l2.8 2.8M2 12h4M18 12h4M4.9 19.1l2.8-2.8M16.3 7.7l2.8-2.8" />
    </svg>
  )
}

function ArrowIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  )
}

const PROGRAMS = [
  {
    slug: 'academic-live',
    icon: LiveIcon,
    title: 'Academic Live',
    body: 'Real-time classes with certified teachers covering your school and college curriculum.',
    tint: 'bg-[#2563eb]',
    soft: 'bg-[#e5edfd] text-[#2563eb]',
    glow: 'from-[#2563eb]/10',
  },
  {
    slug: 'applied-academic-learning',
    icon: AppliedIcon,
    title: 'Applied Academic Learning',
    body: 'Bridge theory and practice with project-based learning tied to real academic outcomes.',
    tint: 'bg-[#1d4e43]',
    soft: 'bg-[#dcede9] text-[#1d4e43]',
    glow: 'from-[#1d4e43]/10',
  },
  {
    slug: 'professional-learning',
    icon: ProfessionalIcon,
    title: 'Professional Learning',
    body: 'Industry-aligned programs designed to build job-ready skills for your career.',
    tint: 'bg-[#c2740c]',
    soft: 'bg-[#f6e6cf] text-[#8a5a2b]',
    glow: 'from-[#c2740c]/10',
  },
  {
    slug: 'self-paced-learning',
    icon: SelfPacedIcon,
    title: 'Self Paced Learning',
    body: 'Learn on your own schedule with lifetime access to recorded lessons and resources.',
    tint: 'bg-[#7c3aed]',
    soft: 'bg-[#ede4fd] text-[#7c3aed]',
    glow: 'from-[#7c3aed]/10',
  },
  {
    slug: 'other-learning',
    icon: OtherIcon,
    title: 'Other Learning',
    body: 'Explore hobby courses, workshops, and skill-building content beyond the core tracks.',
    tint: 'bg-[#be123c]',
    soft: 'bg-[#fbe2e8] text-[#be123c]',
    glow: 'from-[#be123c]/10',
  },
]

function Programs() {
  return (
    <section className="bg-surface-container-lowest px-16 py-20 max-lg:px-6 max-lg:py-14">
      <div className="mx-auto max-w-7xl">
        <span className="mx-auto mb-4 block w-fit rounded-full bg-accent-design px-4 py-1.5 text-xs font-bold tracking-wide text-primary uppercase">
          Learning Formats
        </span>
        <h2 className="text-center text-4xl font-extrabold text-on-surface max-lg:text-3xl">
          Explore Our Programs
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-lg text-on-surface-variant">
          Whichever way you learn best, Brainlaya has a program built around it.
        </p>

        <div className="mt-14 grid grid-cols-5 gap-6 max-lg:grid-cols-3 max-sm:grid-cols-1">
          {PROGRAMS.map(({ slug, icon: Icon, title, body, tint, soft, glow }) => (
            <Link
              key={slug}
              to="/courses"
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-surface-dim bg-surface-container-lowest p-6 shadow-[var(--shadow-card-sm)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[var(--shadow-card-md)]"
            >
              <span className={`absolute inset-x-0 top-0 h-1 ${tint}`} />
              <div
                className={`pointer-events-none absolute inset-0 bg-linear-to-b ${glow} to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
              />

              <span
                className={`relative z-10 mb-6 flex h-14 w-14 items-center justify-center rounded-2xl ${soft} transition-transform duration-300 group-hover:scale-110`}
              >
                <Icon />
              </span>
              <h3 className="relative z-10 mb-2 text-lg font-bold text-on-surface">{title}</h3>
              <p className="relative z-10 mb-6 flex-1 text-sm leading-relaxed text-on-surface-variant">
                {body}
              </p>
              <span className="relative z-10 inline-flex items-center gap-1.5 text-sm font-bold text-primary">
                Learn more
                <ArrowIcon className="transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Programs
