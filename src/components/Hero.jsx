import heroImg from '../assets/hero.jpg'
import { AvatarCircles } from '@/components/ui/avatar-circles'

const REVIEW_AVATARS = [
  { imageUrl: 'https://avatars.githubusercontent.com/u/16860528', profileUrl: 'https://github.com/dillionverma' },
  { imageUrl: 'https://avatars.githubusercontent.com/u/20110627', profileUrl: 'https://github.com/tomonarifeehan' },
  { imageUrl: 'https://avatars.githubusercontent.com/u/106103625', profileUrl: 'https://github.com/BankkRoll' },
]

function StarIcon() {
  return (
    <svg viewBox="0 0 20 20" width="16" height="16" fill="#2563eb" aria-hidden="true">
      <path d="M10 1.5l2.47 5.53 6.03.62-4.53 4.05 1.3 5.9L10 14.77l-5.27 2.83 1.3-5.9L1.5 7.65l6.03-.62L10 1.5z" />
    </svg>
  )
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 20 20" width="14" height="14" fill="currentColor" aria-hidden="true">
      <path d="M6 4.5v11l9-5.5-9-5.5z" />
    </svg>
  )
}

function TrendIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true">
      <path d="M4 15l5-5 4 4 7-7" stroke="#8a5a2b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M15 6h5v5" stroke="#8a5a2b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function Hero() {
  return (
    <section className="px-16 pt-20 pb-32 max-lg:px-6 max-lg:pt-10 max-lg:pb-14">
      <div className="mx-auto grid max-w-[1560px] grid-cols-2 items-center gap-20 max-lg:grid-cols-1 max-lg:gap-10 max-lg:text-center">
        <div>
          <h1 className="mb-6 text-[52px] leading-[1.15] font-extrabold tracking-tight text-on-surface max-lg:text-4xl">
            Learn from great teachers.
            <br />
            <span className="text-secondary">Build skills that matter.</span>
          </h1>

          <p className="mb-9 max-w-[520px] text-lg leading-relaxed text-on-surface-variant max-lg:mx-auto">
            Welcome to Brainlaya. Join over 5 million learners worldwide.
            Access premium content from industry experts and take the next
            step in your professional journey.
          </p>

          <div className="mb-10 flex items-center gap-4 max-lg:justify-center max-sm:flex-col max-sm:items-stretch">
            <a
              href="#courses"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-7 py-4 text-base font-semibold text-white transition-colors hover:bg-primary-hover active:translate-y-px"
            >
              Start Learning Now
            </a>
            <a
              href="#preview"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-surface-dim bg-surface-container-lowest px-7 py-4 text-base font-semibold text-on-surface transition-colors hover:border-outline active:translate-y-px"
            >
              <PlayIcon />
              Watch Preview
            </a>
          </div>

          <div className="flex items-center gap-4 max-lg:justify-center">
            <AvatarCircles avatarUrls={REVIEW_AVATARS} numPeople={12} />
            <div className="flex flex-col gap-0.5">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <StarIcon key={i} />
                ))}
              </div>
              <span className="text-sm font-semibold text-on-surface-variant">
                4.8/5 from over 12k student reviews
              </span>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="overflow-hidden rounded-3xl border border-surface-dim bg-surface-container-lowest shadow-[var(--shadow-card-lg)]">
            <img
              src={heroImg}
              alt="Students collaborating around a table with laptops"
              className="block aspect-[4/3] h-auto w-full object-cover"
            />
          </div>

          <div className="absolute bottom-6 -left-6 flex items-center gap-4 rounded-2xl bg-surface-container-lowest px-6 py-4 shadow-[var(--shadow-card-lg)] max-lg:left-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#f3e3cf]">
              <TrendIcon />
            </span>
            <div>
              <p className="mb-0.5 text-sm text-on-surface-variant">Active Students</p>
              <p className="text-xl font-bold text-on-surface">85,420+</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
