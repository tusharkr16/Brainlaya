import { Link, useParams } from 'react-router-dom'
import DashboardShell from '../components/DashboardShell'
import LessonPlayer from '../components/LessonPlayer'

function TeacherCoursePreview() {
  const { id } = useParams()

  return (
    <DashboardShell active="My Courses">
      <Link to={`/teacher/courses/${id}`} className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-secondary hover:underline">
        ← Back to Manage
      </Link>
      <LessonPlayer courseId={id} readOnly />
    </DashboardShell>
  )
}

export default TeacherCoursePreview
