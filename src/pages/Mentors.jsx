import { useState } from 'react'
import mentorSarah from '../assets/course-math.jpg'
import mentorMarcus from '../assets/course-tech.jpg'
import mentorElena from '../assets/course-design.jpg'

const FEATURED_MENTORS = [
  {
    photo: mentorSarah,
    badge: 'Top Rated',
    badgeStyle: 'bg-brand-green text-white',
    name: 'Dr. Sarah Jenkins',
    subjects: 'Advanced Mathematics • Physics',
    rating: 4.9,
    reviews: 124,
    experience: '12 Years Exp.',
    bio: 'Passionate about making complex physics concepts accessible to high school students.',
    price: 65,
  },
  {
    photo: mentorMarcus,
    badge: 'New Expert',
    badgeStyle: 'bg-secondary text-white',
    name: 'Marcus Thorne',
    subjects: 'Computer Science • AI Ethics',
    rating: 5.0,
    reviews: 18,
    experience: '8 Years Exp.',
    bio: 'Former Senior Engineer helping students master Python and understand the ethics of AI.',
    price: 80,
  },
  {
    photo: mentorElena,
    badge: 'Bilingual',
    badgeStyle: 'bg-brand-green text-white',
    name: 'Elena Rodriguez',
    subjects: 'Creative Writing • SAT Prep',
    rating: 4.8,
    reviews: 95,
    experience: '6 Years Exp.',
    bio: 'Specializing in narrative structure and persuasive essay writing. I help students find their voice.',
    price: 50,
  },
]

const ALL_MENTORS = [
  { name: 'Julian Chen', subject: 'UX/UI Design', rating: 4.9, experience: '10yr Exp.', price: 75 },
  { name: 'Sophia Lee', subject: 'Mandarin • ESL', rating: 4.7, experience: '5yr Exp.', price: 45 },
  { name: 'Dr. Robert Vance', subject: 'Organic Chemistry', rating: 5.0, experience: '20yr Exp.', price: 90 },
  { name: 'Amara Okoro', subject: 'Business Strategy', rating: 4.9, experience: '15yr Exp.', price: 110 },
  { name: 'Kevin Zhang', subject: 'Music Theory • Piano', rating: 4.8, experience: '7yr Exp.', price: 55 },
  { name: 'Lila Thompson', subject: 'Environmental Science', rating: 4.6, experience: '4yr Exp.', price: 60 },
  { name: 'David Miller', subject: 'K-8 General Academics', rating: 4.9, experience: '9yr Exp.', price: 40 },
  { name: 'Priya Sharma', subject: 'Data Science • Stats', rating: 4.9, experience: '11yr Exp.', price: 85 },
]

const FILTERS = ['Expertise', 'Grade Level', 'Rating', 'Availability']

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  )
}

function SlidersIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h13M21 18h0" />
      <circle cx="16" cy="6" r="2" />
      <circle cx="8" cy="12" r="2" />
      <circle cx="17" cy="18" r="2" />
    </svg>
  )
}

function ChevronIcon() {
  return (
    <svg viewBox="0 0 20 20" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="m5 7.5 5 5 5-5" />
    </svg>
  )
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 10h12M11 5l5 5-5 5" />
    </svg>
  )
}

function ChevronNavIcon({ direction }) {
  return (
    <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d={direction === 'left' ? 'M12.5 15 7.5 10l5-5' : 'M7.5 15l5-5-5-5'} />
    </svg>
  )
}

function StarIcon() {
  return (
    <svg viewBox="0 0 20 20" width="15" height="15" fill="#f59e0b" aria-hidden="true">
      <path d="M10 1.5l2.47 5.53 6.03.62-4.53 4.05 1.3 5.9L10 14.77l-5.27 2.83 1.3-5.9L1.5 7.65l6.03-.62L10 1.5z" />
    </svg>
  )
}

function FeaturedMentorCard({ mentor }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-surface-dim bg-surface-container-lowest">
      <div className="relative h-64">
        <img src={mentor.photo} alt={mentor.name} className="h-full w-full object-cover" />
        <span className={`absolute top-4 right-4 rounded-full px-3.5 py-1.5 text-xs font-semibold ${mentor.badgeStyle}`}>
          {mentor.badge}
        </span>
      </div>

      <div className="p-6">
        <div className="mb-1 flex items-start justify-between gap-3">
          <h3 className="text-xl font-bold text-on-surface">{mentor.name}</h3>
          <div className="text-right">
            <p className="text-xl font-extrabold text-on-surface">${mentor.price}</p>
            <p className="text-xs text-on-surface-variant">/ session</p>
          </div>
        </div>
        <p className="mb-2 text-sm font-semibold text-brand-green">{mentor.subjects}</p>

        <div className="mb-3 flex items-center gap-1.5 text-sm text-on-surface-variant">
          <StarIcon />
          <span className="font-bold text-on-surface">{mentor.rating}</span>
          <span>({mentor.reviews} reviews)</span>
          <span>&bull;</span>
          <span>{mentor.experience}</span>
        </div>

        <p className="mb-5 text-sm leading-relaxed text-on-surface-variant">{mentor.bio}</p>

        <div className="flex gap-3">
          <button
            type="button"
            className="flex-1 rounded-lg bg-secondary py-2.5 text-sm font-bold text-white transition-colors hover:bg-secondary-hover"
          >
            Book Session
          </button>
          <button
            type="button"
            className="flex-1 rounded-lg border border-surface-dim py-2.5 text-sm font-bold text-on-surface"
          >
            View Profile
          </button>
        </div>
      </div>
    </div>
  )
}

function MentorGridCard({ mentor }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-surface-dim bg-surface-container-lowest">
      <div className="aspect-square bg-accent-design" />
      <div className="p-5">
        <h3 className="text-lg font-bold text-on-surface">{mentor.name}</h3>
        <p className="mb-2 text-sm font-semibold text-secondary">{mentor.subject}</p>
        <div className="mb-3 flex items-center gap-1.5 text-sm text-on-surface-variant">
          <StarIcon />
          <span className="font-bold text-on-surface">{mentor.rating}</span>
          <span>{mentor.experience}</span>
        </div>
        <p className="mb-4 text-lg font-extrabold text-on-surface">
          ${mentor.price}
          <span className="text-sm font-normal text-on-surface-variant">/session</span>
        </p>
        <button
          type="button"
          className="w-full rounded-lg bg-secondary py-2.5 text-sm font-bold text-white transition-colors hover:bg-secondary-hover"
        >
          Book
        </button>
        <button type="button" className="mt-2 w-full text-sm font-semibold text-on-surface-variant">
          Profile
        </button>
      </div>
    </div>
  )
}

function Mentors() {
  const [page, setPage] = useState(1)
  const totalPages = 12

  return (
    <div className="bg-surface">
      <div className="px-16 pt-12 pb-8 max-lg:px-6">
        <div className="mx-auto max-w-7xl">
          <h1 className="mb-4 text-5xl font-extrabold text-on-surface max-lg:text-4xl">
            Find Your Perfect Mentor
          </h1>
          <p className="max-w-2xl text-lg text-on-surface-variant">
            Connect with world-class educators and industry experts. Tailored learning experiences
            for every grade level and subject.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3 rounded-2xl border border-surface-dim bg-surface-container-lowest p-4">
            <label className="flex min-w-[240px] flex-1 items-center gap-2.5 rounded-xl bg-surface-container-low px-4 py-3 text-on-surface-variant">
              <SearchIcon />
              <input
                type="text"
                placeholder="Search by name, expertise, or keyword..."
                className="w-full border-none bg-transparent text-sm text-on-surface outline-none placeholder:text-on-surface-variant"
              />
            </label>

            {FILTERS.map((filter) => (
              <button
                key={filter}
                type="button"
                className="flex items-center gap-2 rounded-xl border border-surface-dim px-4 py-3 text-sm font-semibold text-on-surface"
              >
                {filter}
                <ChevronIcon />
              </button>
            ))}

            <button
              type="button"
              aria-label="More filters"
              className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary text-white"
            >
              <SlidersIcon />
            </button>
          </div>
        </div>
      </div>

      <div className="px-16 py-10 max-lg:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-on-surface">Featured Mentors</h2>
            <a href="#all-mentors" className="flex items-center gap-1 text-sm font-semibold text-secondary">
              View all experts
              <ArrowIcon />
            </a>
          </div>

          <div className="grid grid-cols-3 gap-6 max-lg:grid-cols-1">
            {FEATURED_MENTORS.map((mentor) => (
              <FeaturedMentorCard key={mentor.name} mentor={mentor} />
            ))}
          </div>
        </div>
      </div>

      <div id="all-mentors" className="px-16 py-10 max-lg:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 flex items-center justify-between max-sm:flex-col max-sm:items-start max-sm:gap-3">
            <h2 className="text-2xl font-bold text-on-surface">Explore All Mentors</h2>
            <label className="flex items-center gap-2 text-sm text-on-surface-variant">
              Sort by:
              <span className="flex items-center gap-1 font-bold text-secondary">
                Most Relevant
                <ChevronIcon />
              </span>
            </label>
          </div>

          <div className="grid grid-cols-4 gap-6 max-lg:grid-cols-2 max-sm:grid-cols-1">
            {ALL_MENTORS.map((mentor) => (
              <MentorGridCard key={mentor.name} mentor={mentor} />
            ))}
          </div>

          <div className="mt-10 flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              aria-label="Previous page"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-surface-dim text-on-surface"
            >
              <ChevronNavIcon direction="left" />
            </button>

            {[1, 2, 3].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setPage(n)}
                className={
                  page === n
                    ? 'flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-sm font-bold text-white'
                    : 'flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold text-on-surface-variant'
                }
              >
                {n}
              </button>
            ))}
            <span className="px-1 text-on-surface-variant">...</span>
            <button
              type="button"
              onClick={() => setPage(totalPages)}
              className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold text-on-surface-variant"
            >
              {totalPages}
            </button>

            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              aria-label="Next page"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-surface-dim text-on-surface"
            >
              <ChevronNavIcon direction="right" />
            </button>
          </div>
        </div>
      </div>

      <div className="px-16 py-10 max-lg:px-6">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-2xl bg-linear-to-br from-secondary to-[#1d4fc4] px-10 py-14 text-center text-white">
          <h2 className="mb-4 text-4xl font-extrabold max-lg:text-3xl">Can't find the right fit?</h2>
          <p className="mx-auto mb-8 max-w-xl text-lg text-white/85">
            Our learning specialists can help you find a mentor tailored to your specific goals
            and schedule.
          </p>
          <div className="flex justify-center gap-4 max-sm:flex-col max-sm:items-stretch">
            <button
              type="button"
              className="rounded-lg bg-white px-7 py-3.5 text-base font-bold text-secondary"
            >
              Get a Match
            </button>
            <button
              type="button"
              className="rounded-lg border border-white/60 px-7 py-3.5 text-base font-bold text-white"
            >
              Browse Subjects
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Mentors
