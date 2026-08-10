import mathThumb from '../assets/course-math.jpg'
import scienceThumb from '../assets/course-science.jpg'
import designThumb from '../assets/course-design.jpg'
import techThumb from '../assets/course-tech.jpg'
import astroThumb from '../assets/course-astro.jpg'

export const PROGRAMS = [
  { slug: 'academic-live', label: 'Academic Live' },
  { slug: 'applied-academic-learning', label: 'Applied Academic Learning' },
  { slug: 'professional-learning', label: 'Professional Learning' },
  { slug: 'self-paced-learning', label: 'Self Paced Learning' },
  { slug: 'other-learning', label: 'Other Learning' },
]

export function getProgramBySlug(slug) {
  return PROGRAMS.find((program) => program.slug === slug)
}

export const COURSES = [
  {
    slug: 'advanced-calculus-analytic-geometry',
    category: 'Mathematics',
    program: 'academic-live',
    thumb: mathThumb,
    rating: 4.9,
    reviews: '1.2k',
    reviewCount: 1200,
    enrolled: 8400,
    title: 'Advanced Calculus & Analytic Geometry',
    subtitle: 'Master complex analysis, multivariable calculus, and differential equations with expert-led courses.',
    teacher: 'Dr. Sarah Jenkins',
    teacherRole: 'Principal Mathematics Instructor & Author',
    teacherAvatar: 'https://avatars.githubusercontent.com/u/16860528',
    teacherBio: 'With over 12 years teaching advanced mathematics, Sarah has helped thousands of students build the analytical foundations needed for engineering and physics careers. She is the author of "Calculus in Practice."',
    teacherStats: { years: '12+', students: '30k+', rating: '4.9' },
    price: 89,
    originalPrice: 149,
    discount: '40% OFF',
    duration: '20 Hours Content',
    languages: 'English',
    updated: '04/2024',
    highlights: ['Full lifetime access', 'Access on mobile and TV', 'Certificate of completion'],
    outcomes: [
      'Solve multivariable calculus problems',
      'Master differential equations',
      'Apply analytic geometry to real systems',
      'Build proofs with mathematical rigor',
    ],
    curriculum: [
      { title: 'Foundations of Analytic Geometry', meta: '4 Lessons • 50m', lessons: ['Coordinate Systems Review', 'Conic Sections'] },
      { title: 'Multivariable Calculus', meta: '7 Lessons • 2h 40m' },
    ],
  },
  {
    slug: 'introduction-to-molecular-biology',
    category: 'Science',
    program: 'applied-academic-learning',
    thumb: scienceThumb,
    rating: 4.7,
    reviews: '840',
    reviewCount: 840,
    enrolled: 5200,
    title: 'Introduction to Molecular Biology',
    subtitle: 'Explore the building blocks of life through lab-driven lessons and expert breakdowns.',
    teacher: 'Prof. Michael Chen',
    teacherRole: 'Molecular Biology Researcher',
    teacherAvatar: 'https://avatars.githubusercontent.com/u/20110627',
    teacherBio: 'Michael has spent 15 years researching cellular mechanisms at leading universities and brings lab-tested teaching methods to every lesson.',
    teacherStats: { years: '15+', students: '22k+', rating: '4.7' },
    price: 75,
    originalPrice: 120,
    discount: '38% OFF',
    duration: '16 Hours Content',
    languages: 'English, Spanish',
    updated: '03/2024',
    highlights: ['Full lifetime access', 'Access on mobile and TV', 'Certificate of completion'],
    outcomes: [
      'Understand cellular structure and function',
      'Explain DNA replication and transcription',
      'Analyze protein synthesis pathways',
      'Apply lab techniques used in research',
    ],
    curriculum: [
      { title: 'Cell Structure & Function', meta: '5 Lessons • 1h 10m' },
      { title: 'DNA, RNA & Protein Synthesis', meta: '6 Lessons • 1h 45m' },
    ],
  },
  {
    slug: 'ui-ux-foundations-for-teens',
    category: 'Arts & Design',
    program: 'professional-learning',
    thumb: designThumb,
    rating: 5.0,
    reviews: '450',
    reviewCount: 450,
    enrolled: 3100,
    title: 'UI/UX Foundations for Teens',
    subtitle: 'Master the art of aligning user needs with business goals through advanced research and strategic design.',
    teacher: 'Lila Roberts',
    teacherRole: 'Principal UX Strategist & Author',
    teacherAvatar: 'https://avatars.githubusercontent.com/u/106103625',
    teacherBio: 'With over 15 years in the industry, Lila has led design teams at Google, Meta, and IDEO. She is a recognized speaker and the author of "Design for Impact." Her mission is to empower designers to speak the language of business.',
    teacherStats: { years: '15+', students: '50k+', rating: '4.8' },
    price: 120,
    originalPrice: 199,
    discount: '35% OFF',
    duration: '24 Hours Content',
    languages: 'English, Spanish',
    updated: '05/2024',
    highlights: ['Full lifetime access', 'Access on mobile and TV', 'Certificate of completion'],
    outcomes: [
      'Develop high-level UX roadmaps',
      'Master ethnographic research methods',
      'Calculate Design ROI for leadership',
      'Build ethical design frameworks',
    ],
    curriculum: [
      {
        title: 'Introduction to Strategic UX',
        meta: '4 Lessons • 45m',
        lessons: [
          { title: 'What is UX Strategy?', duration: '12:04' },
          { title: 'Designing for Business Outcomes', duration: '15:30' },
        ],
      },
      { title: 'Advanced User Research Methods', meta: '6 Lessons • 2h 15m' },
    ],
  },
  {
    slug: 'python-for-future-engineers',
    category: 'Technology',
    program: 'self-paced-learning',
    thumb: techThumb,
    rating: 4.8,
    reviews: '2.1k',
    reviewCount: 2100,
    enrolled: 14300,
    title: 'Python for Future Engineers',
    subtitle: 'Learn Python fundamentals through hands-on, project-based lessons built for future engineers.',
    teacher: 'Arjun Patel',
    teacherRole: 'Senior Software Engineer',
    teacherAvatar: 'https://avatars.githubusercontent.com/u/59228569',
    teacherBio: 'Arjun has shipped production systems at three startups and now focuses on teaching Python fundamentals to the next generation of engineers.',
    teacherStats: { years: '9+', students: '40k+', rating: '4.8' },
    price: 99,
    originalPrice: 159,
    discount: '38% OFF',
    duration: '30 Hours Content',
    languages: 'English',
    updated: '06/2024',
    highlights: ['Full lifetime access', 'Access on mobile and TV', 'Certificate of completion'],
    outcomes: [
      'Write clean, idiomatic Python',
      'Build real command-line tools',
      'Understand data structures & algorithms',
      'Ship a capstone project',
    ],
    curriculum: [
      { title: 'Python Basics', meta: '6 Lessons • 1h 30m' },
      { title: 'Data Structures in Practice', meta: '8 Lessons • 2h 50m' },
    ],
  },
  {
    slug: 'astrophysics-beyond-the-solar-system',
    category: 'Science',
    program: 'other-learning',
    thumb: astroThumb,
    rating: 4.6,
    reviews: '310',
    reviewCount: 310,
    enrolled: 2200,
    title: 'Astrophysics: Beyond the Solar System',
    subtitle: 'A guided tour of galaxies, black holes, and the physics that govern the cosmos.',
    teacher: 'Dr. Amelia Vance',
    teacherRole: 'Astrophysicist & Researcher',
    teacherAvatar: 'https://avatars.githubusercontent.com/u/59442788',
    teacherBio: 'Amelia has published research on stellar formation and now brings the wonder of astrophysics to learners of all levels.',
    teacherStats: { years: '10+', students: '18k+', rating: '4.6' },
    price: 110,
    originalPrice: 175,
    discount: '37% OFF',
    duration: '18 Hours Content',
    languages: 'English',
    updated: '02/2024',
    highlights: ['Full lifetime access', 'Access on mobile and TV', 'Certificate of completion'],
    outcomes: [
      'Explain stellar life cycles',
      'Understand black hole physics',
      'Describe galaxy formation theories',
      'Interpret real telescope data',
    ],
    curriculum: [
      { title: 'Stars & Stellar Evolution', meta: '5 Lessons • 1h 20m' },
      { title: 'Black Holes & Galaxies', meta: '6 Lessons • 1h 55m' },
    ],
  },
]

export function getCourseBySlug(slug) {
  return COURSES.find((course) => course.slug === slug)
}

export function getCoursesByProgram(programSlug) {
  return COURSES.filter((course) => course.program === programSlug)
}

export function getRelatedCourses(slug, count = 2) {
  return COURSES.filter((course) => course.slug !== slug).slice(0, count)
}
