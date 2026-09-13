import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Programs from './components/Programs'
import WhyChoose from './components/WhyChoose'
import Journey from './components/Journey'
import PopularCourses from './components/PopularCourses'
import Testimonials from './components/Testimonials'
import Footer from './components/Footer'
import Courses from './pages/Courses'
import CourseDetail from './pages/CourseDetail'
import Mentors from './pages/Mentors'
import Login from './pages/Login'
import Signup from './pages/Signup'
import ProtectedRoute from './components/ProtectedRoute'
import ProfilePage from './pages/ProfilePage'

import TeacherDashboard from './pages/TeacherDashboard'
import TeacherCourses from './pages/TeacherCourses'
import CreateCourse from './pages/CreateCourse'
import TeacherCourseManage from './pages/TeacherCourseManage'
import TeacherCoursePreview from './pages/TeacherCoursePreview'

import StudentDashboard from './pages/StudentDashboard'
import StudentCourses from './pages/StudentCourses'
import StudentCourseLearn from './pages/StudentCourseLearn'

import AdminDashboard from './pages/AdminDashboard'
import AdminPendingCourses from './pages/AdminPendingCourses'
import AdminCourses from './pages/AdminCourses'
import AdminUsers from './pages/AdminUsers'
import AdminAuditLog from './pages/AdminAuditLog'

function Landing() {
  return (
    <>
      <Hero />
      <Programs />
      <WhyChoose />
      <Journey />
      <PopularCourses />
      <Testimonials />
    </>
  )
}

function App() {
  const { pathname } = useLocation()
  const isDashboard = /^\/(teacher|student|admin)(\/|$)/.test(pathname)

  return (
    <>
      {!isDashboard && <Navbar />}
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/courses/:id" element={<CourseDetail />} />
        <Route path="/mentors" element={<Mentors />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route path="/teacher" element={<ProtectedRoute roles={['teacher']}><TeacherDashboard /></ProtectedRoute>} />
        <Route path="/teacher/courses" element={<ProtectedRoute roles={['teacher']}><TeacherCourses /></ProtectedRoute>} />
        <Route path="/teacher/courses/new" element={<ProtectedRoute roles={['teacher']}><CreateCourse /></ProtectedRoute>} />
        <Route path="/teacher/courses/:id" element={<ProtectedRoute roles={['teacher']}><TeacherCourseManage /></ProtectedRoute>} />
        <Route path="/teacher/courses/:id/preview" element={<ProtectedRoute roles={['teacher']}><TeacherCoursePreview /></ProtectedRoute>} />
        <Route path="/teacher/profile" element={<ProtectedRoute roles={['teacher']}><ProfilePage /></ProtectedRoute>} />

        <Route path="/student" element={<ProtectedRoute roles={['student']}><StudentDashboard /></ProtectedRoute>} />
        <Route path="/student/courses" element={<ProtectedRoute roles={['student']}><StudentCourses /></ProtectedRoute>} />
        <Route path="/student/courses/:id" element={<ProtectedRoute roles={['student']}><StudentCourseLearn /></ProtectedRoute>} />
        <Route path="/student/profile" element={<ProtectedRoute roles={['student']}><ProfilePage /></ProtectedRoute>} />

        <Route path="/admin" element={<ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/courses/pending" element={<ProtectedRoute roles={['admin']}><AdminPendingCourses /></ProtectedRoute>} />
        <Route path="/admin/courses" element={<ProtectedRoute roles={['admin']}><AdminCourses /></ProtectedRoute>} />
        <Route path="/admin/users" element={<ProtectedRoute roles={['admin']}><AdminUsers /></ProtectedRoute>} />
        <Route path="/admin/audit-log" element={<ProtectedRoute roles={['admin']}><AdminAuditLog /></ProtectedRoute>} />
      </Routes>
      {!isDashboard && <Footer />}
    </>
  )
}

export default App
