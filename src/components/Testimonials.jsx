import { useState } from 'react'

const TESTIMONIALS = [
  {
    quote: 'The quality of instructors at Brainlaya is unmatched. I transitioned from a marketing role to a Junior Developer in just 6 months thanks to their structured curriculum.',
    name: 'Jessica Thompson',
    role: 'Frontend Developer at Vercel',
    avatar: 'https://avatars.githubusercontent.com/u/16860528',
  },
  {
    quote: 'Brainlaya changed my life. Being able to learn at my own pace from world-class experts allowed me to upskill without leaving my full-time job.',
    name: 'Michael Chen',
    role: 'Senior Product Designer',
    avatar: 'https://avatars.githubusercontent.com/u/20110627',
  },
  {
    quote: 'The global community here is incredible. I built a network of peers and mentors across three continents while finishing my certification.',
    name: 'Amara Okafor',
    role: 'Data Scientist at Spotify',
    avatar: 'https://avatars.githubusercontent.com/u/106103625',
  },
]

function StarIcon({ color = '#f59e0b' }) {
  return (
    <svg viewBox="0 0 20 20" width="18" height="18" fill={color} aria-hidden="true">
      <path d="M10 1.5l2.47 5.53 6.03.62-4.53 4.05 1.3 5.9L10 14.77l-5.27 2.83 1.3-5.9L1.5 7.65l6.03-.62L10 1.5z" />
    </svg>
  )
}

function ArrowIcon({ direction }) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d={direction === 'left' ? 'M15 5 8 12l7 7' : 'M9 5l7 7-7 7'} />
    </svg>
  )
}

function TestimonialCard({ testimonial, variant }) {
  const isDark = variant === 'dark'
  return (
    <div
      className={
        isDark
          ? 'flex flex-col justify-between rounded-2xl bg-secondary p-8 text-white'
          : 'flex flex-col justify-between rounded-2xl border border-surface-dim bg-surface-container-lowest p-8'
      }
    >
      <div>
        <div className="mb-5 flex gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <StarIcon key={i} color={isDark ? '#fde68a' : '#f59e0b'} />
          ))}
        </div>
        <p className={isDark ? 'text-lg leading-relaxed italic' : 'text-lg leading-relaxed text-on-surface italic'}>
          "{testimonial.quote}"
        </p>
      </div>

      <div className="mt-8 flex items-center gap-3">
        <img src={testimonial.avatar} alt="" className="h-11 w-11 rounded-full object-cover" />
        <div>
          <p className={isDark ? 'font-bold' : 'font-bold text-on-surface'}>{testimonial.name}</p>
          <p className={isDark ? 'text-sm text-white/75' : 'text-sm text-on-surface-variant'}>{testimonial.role}</p>
        </div>
      </div>
    </div>
  )
}

function Testimonials() {
  const [index, setIndex] = useState(0)
  const next = () => setIndex((i) => (i + 1) % TESTIMONIALS.length)
  const prev = () => setIndex((i) => (i - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)
  const secondIndex = (index + 1) % TESTIMONIALS.length

  return (
    <section className="bg-surface px-16 py-20 max-lg:px-6 max-lg:py-14">
      <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)_2fr] items-center gap-14 max-lg:grid-cols-1">
        <div>
          <h2 className="text-4xl font-extrabold text-on-surface max-lg:text-3xl">
            Hear from our students worldwide
          </h2>
          <p className="mt-4 text-lg text-on-surface-variant">
            Success stories that inspire us to keep building the best learning platform.
          </p>

          <div className="mt-8 flex gap-3">
            <button
              type="button"
              onClick={prev}
              aria-label="Previous testimonial"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-surface-dim text-on-surface transition-colors hover:bg-surface-container-low"
            >
              <ArrowIcon direction="left" />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Next testimonial"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-surface-dim text-on-surface transition-colors hover:bg-surface-container-low"
            >
              <ArrowIcon direction="right" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 max-md:grid-cols-1">
          <TestimonialCard testimonial={TESTIMONIALS[index]} variant="light" />
          <TestimonialCard testimonial={TESTIMONIALS[secondIndex]} variant="dark" />
        </div>
      </div>
    </section>
  )
}

export default Testimonials
