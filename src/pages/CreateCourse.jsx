import { useNavigate } from 'react-router-dom'
import DashboardShell from '../components/DashboardShell'
import CourseForm from '../components/CourseForm'
import { useCreateCourse } from '../api/courses'

function CreateCourse() {
  const navigate = useNavigate()
  const createCourse = useCreateCourse()

  return (
    <DashboardShell active="My Courses">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6">
          <h1 className="text-3xl font-extrabold text-on-surface">Create New Course</h1>
          <p className="mt-1 text-on-surface-variant">
            Starts as a draft — you can keep editing before submitting it for admin review.
          </p>
        </div>

        <CourseForm
          submitLabel="Create Course"
          submitting={createCourse.isPending}
          error={createCourse.error?.message}
          onCancel={() => navigate('/teacher/courses')}
          onSubmit={(body) =>
            createCourse.mutate(body, {
              onSuccess: (res) => navigate(`/teacher/courses/${res.data._id}`),
            })
          }
        />
      </div>
    </DashboardShell>
  )
}

export default CreateCourse
