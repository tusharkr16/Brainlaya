import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import WhyChoose from './components/WhyChoose'
import Journey from './components/Journey'
import PopularCourses from './components/PopularCourses'
import Testimonials from './components/Testimonials'
import Footer from './components/Footer'
import Courses from './pages/Courses'
import CourseDetail from './pages/CourseDetail'
import Mentors from './pages/Mentors'

function Landing() {
  return (
    <>
      <Hero />
      <WhyChoose />
      <Journey />
      <PopularCourses />
      <Testimonials />
    </>
  )
}

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/courses/:slug" element={<CourseDetail />} />
        <Route path="/mentors" element={<Mentors />} />
      </Routes>
      <Footer />
    </>
  )
}

export default App
