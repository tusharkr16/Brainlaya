function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="#2563eb" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="m20 20-4.3-4.3" />
    </svg>
  )
}

function BookIcon() {
  return (
    <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="#2563eb" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 6.5c-1.5-1.3-3.5-2-6-2v13c2.5 0 4.5.7 6 2 1.5-1.3 3.5-2 6-2v-13c-2.5 0-4.5.7-6 2Z" />
      <path d="M12 6.5v13" />
    </svg>
  )
}

function ShieldCheckIcon() {
  return (
    <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="#2563eb" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  )
}

const STEPS = [
  {
    icon: SearchIcon,
    title: 'Find your course',
    body: 'Browse our vast library of courses curated by industry experts across multiple domains.',
  },
  {
    icon: BookIcon,
    title: 'Learn at your pace',
    body: 'Access bite-sized lessons and interactive projects anytime, anywhere on any device.',
  },
  {
    icon: ShieldCheckIcon,
    title: 'Get Certified',
    body: 'Earn industry-recognized certificates and unlock new career opportunities worldwide.',
  },
]

function Journey() {
  return (
    <section className="border-t border-surface-dim bg-[#eef3fb] px-16 py-20 max-lg:px-6 max-lg:py-14">
      <div className="mx-auto max-w-7xl">
        <h2 className="text-center text-4xl font-extrabold text-on-surface max-lg:text-3xl">
          Your Journey to Success
        </h2>
        <p className="mt-4 text-center text-lg text-on-surface-variant">
          Start your transformation in three simple steps.
        </p>

        <div className="relative mt-20 grid grid-cols-3 gap-10 max-md:grid-cols-1 max-md:gap-16">
          <div className="absolute top-14 right-0 left-0 h-px bg-surface-dim max-md:hidden" />

          {STEPS.map(({ icon: Icon, title, body }, i) => (
            <div key={title} className="group relative flex flex-col items-center text-center">
              <span className="relative flex h-28 w-28 items-center justify-center rounded-full border-2 border-secondary bg-surface-container-lowest transition-transform duration-300 group-hover:scale-110">
                <Icon />
                <span className="absolute -top-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-secondary text-xs font-bold text-white">
                  {i + 1}
                </span>
              </span>
              <h3 className="mt-6 mb-2 text-xl font-bold text-on-surface">{title}</h3>
              <p className="max-w-xs text-[15px] leading-relaxed text-on-surface-variant">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Journey
