import { ShineBorder } from '@/components/ui/shine-border'

function BrainIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#2563eb" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.5 3a2.5 2.5 0 0 0-2.5 2.5v.55A3 3 0 0 0 5 9v1a3 3 0 0 0 1 2.24V15a3 3 0 0 0 3 3 2 2 0 0 0 2-2V5.5A2.5 2.5 0 0 0 9.5 3Z" />
      <path d="M14.5 3a2.5 2.5 0 0 1 2.5 2.5v.55A3 3 0 0 1 19 9v1a3 3 0 0 1-1 2.24V15a3 3 0 0 1-3 3 2 2 0 0 1-2-2V5.5A2.5 2.5 0 0 1 14.5 3Z" />
    </svg>
  )
}

function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#2563eb" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="8" />
      <path d="M12 8v4l3 2" />
    </svg>
  )
}

function PeopleIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#2563eb" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="8.5" cy="8" r="2.5" />
      <circle cx="16" cy="9" r="2" />
      <path d="M3.5 19a5 5 0 0 1 10 0" />
      <path d="M14.5 19a4 4 0 0 1 6 0" />
    </svg>
  )
}

function BriefcaseIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#2563eb" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="8" width="18" height="11" rx="2" />
      <path d="M8 8V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <path d="M3 13h18" />
    </svg>
  )
}

const FEATURES = [
  {
    icon: BrainIcon,
    title: 'Expert Mentorship',
    body: 'Get direct guidance from industry veterans who have walked the path before you.',
  },
  {
    icon: ClockIcon,
    title: 'Flexible Learning',
    body: 'Learn at your own pace with lifetime access to all course materials and updates.',
  },
  {
    icon: PeopleIcon,
    title: 'Global Community',
    body: 'Connect with 5M+ learners worldwide to share insights and build your network.',
  },
  {
    icon: BriefcaseIcon,
    title: 'Career-Ready Skills',
    body: 'Curriculums built in partnership with top employers to ensure immediate relevance.',
  },
]

function WhyChoose() {
  return (
    <section className="bg-surface-container-lowest px-16 py-20 max-lg:px-6 max-lg:py-14">
      <div className="mx-auto max-w-7xl">
        <h2 className="text-center text-4xl font-extrabold text-on-surface max-lg:text-3xl">
          Why Choose Brainlaya?
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-lg text-on-surface-variant">
          We provide a comprehensive ecosystem designed for modern learners to excel in the
          competitive global market.
        </p>

        <div className="mt-14 grid grid-cols-4 gap-6 max-lg:grid-cols-2 max-sm:grid-cols-1">
          {FEATURES.map(({ icon: Icon, title, body }) => (
            <div
              key={title}
              className="relative overflow-hidden rounded-2xl border border-surface-dim bg-surface-container-lowest p-7 transition-transform duration-300 hover:scale-105"
            >
              <ShineBorder shineColor={['#2563eb', '#93c5fd', '#2563eb']} />
              <span className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-accent-design">
                <Icon />
              </span>
              <h3 className="mb-2 text-xl font-bold text-on-surface">{title}</h3>
              <p className="text-[15px] leading-relaxed text-on-surface-variant">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default WhyChoose
