import { useParams } from 'react-router-dom'
import DashboardShell from '../components/DashboardShell'
import LessonPlayer from '../components/LessonPlayer'

function StudentCourseLearn() {
  const { id } = useParams()

  return (
    <DashboardShell active="My Learning">
      <LessonPlayer courseId={id} />
    </DashboardShell>
  )
}

export default StudentCourseLearn
