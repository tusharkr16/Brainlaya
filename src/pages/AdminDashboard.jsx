import { Link } from 'react-router-dom'
import DashboardShell from '../components/DashboardShell'
import Histogram from '../components/charts/Histogram'
import LineChart from '../components/charts/LineChart'
import PieChart from '../components/charts/PieChart'
import { SEQUENTIAL_GREEN, CATEGORICAL_COLORS } from '../components/charts/chartUtils'
import { useAdminStats } from '../api/admin'
import { LoadingState, ErrorState } from '../components/StateViews'
import { STATUS_BADGE } from '../lib/constants'

function StatCard({ label, value }) {
  return (
    <div className="rounded-2xl border border-surface-dim bg-surface-container-lowest p-5">
      <p className="text-sm text-on-surface-variant">{label}</p>
      <p className="mt-1 text-2xl font-extrabold text-on-surface">{value}</p>
    </div>
  )
}

function Section({ title, description, children }) {
  return (
    <section className="mb-10">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-on-surface">{title}</h2>
        {description && <p className="text-sm text-on-surface-variant">{description}</p>}
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">{children}</div>
    </section>
  )
}

function ChartCard({ title, children }) {
  return (
    <div className="rounded-2xl border border-surface-dim bg-surface-container-lowest p-6">
      <h3 className="mb-6 text-sm font-bold tracking-wide text-on-surface-variant uppercase">{title}</h3>
      {children}
    </div>
  )
}

const ENROLLMENT_STATUS_LABEL = { enrolled: 'Enrolled', dropped: 'Dropped' }

// Two independently-sampled daily series (new enrollments, lesson completions)
// may each be missing dates the other has — align them onto one shared,
// sorted date axis (0 where a series has no activity that day) before charting.
function mergeDailyTrends(a, b) {
  const dates = Array.from(new Set([...a.map((x) => x.date), ...b.map((x) => x.date)])).sort()
  const aMap = Object.fromEntries(a.map((x) => [x.date, x.count]))
  const bMap = Object.fromEntries(b.map((x) => [x.date, x.count]))
  return {
    labels: dates.map((d) => d.slice(5)),
    aValues: dates.map((d) => aMap[d] || 0),
    bValues: dates.map((d) => bMap[d] || 0),
  }
}

function monthLabel(monthStr) {
  return new Date(`${monthStr}-01T00:00:00`).toLocaleString('default', { month: 'short' })
}

function AdminDashboard() {
  const { data, isPending, isError, error, refetch } = useAdminStats()

  return (
    <DashboardShell active="Dashboard">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-on-surface">Platform Overview</h1>
          <p className="mt-1 text-on-surface-variant">Real-time snapshot across every role.</p>
        </div>
        <Link
          to="/admin/courses/pending"
          className="rounded-xl bg-secondary px-5 py-3 text-sm font-bold text-white shadow-[var(--shadow-card-md)] transition-colors hover:bg-secondary-hover"
        >
          Review Approval Queue
        </Link>
      </div>

      {isPending && <LoadingState />}
      {isError && <ErrorState message={error.message} onRetry={refetch} />}

      {!isPending && !isError && (
        <>
          <div className="mb-10 grid grid-cols-2 gap-5 lg:grid-cols-4">
            <StatCard label="Total Users" value={data.data.totalUsers.toLocaleString()} />
            <StatCard label="Teachers" value={data.data.totalTeachers.toLocaleString()} />
            <StatCard label="Students" value={data.data.totalStudents.toLocaleString()} />
            <StatCard label="Est. Revenue" value={`$${data.data.revenue.total.toLocaleString()}`} />
          </div>

          <Section title="Platform" description="Course pipeline across the whole catalog.">
            <ChartCard title="Courses by Status">
              <Histogram
                data={Object.entries(STATUS_BADGE).map(([key, meta]) => ({
                  label: meta.label,
                  value: data.data.coursesByStatus[key] || 0,
                }))}
              />
            </ChartCard>
            <ChartCard title="Courses by Category">
              <PieChart data={data.data.coursesByCategory.map((c) => ({ label: c.category, value: c.count }))} />
            </ChartCard>
          </Section>

          <Section title="Student Analytics" description="Enrollment and learning activity across the platform.">
            <ChartCard title="Student Activity (Last 30 Days)">
              {(() => {
                const { labels, aValues, bValues } = mergeDailyTrends(data.data.enrollmentTrend, data.data.engagementTrend)
                return labels.length === 0 ? (
                  <p className="text-sm text-on-surface-variant">No enrollment or lesson activity in the last 30 days.</p>
                ) : (
                  <LineChart
                    labels={labels}
                    series={[
                      { name: 'New Enrollments', color: CATEGORICAL_COLORS[0], values: aValues },
                      { name: 'Lessons Completed', color: CATEGORICAL_COLORS[1], values: bValues },
                    ]}
                  />
                )
              })()}
            </ChartCard>
            <ChartCard title="Enrollment Status">
              <PieChart
                data={data.data.enrollmentsByStatus.map((e) => ({
                  label: ENROLLMENT_STATUS_LABEL[e.status] || e.status,
                  value: e.count,
                }))}
              />
            </ChartCard>
          </Section>

          <Section title="Teacher Analytics" description="Who's driving enrollments, and how much they're teaching.">
            <ChartCard title="Top Teachers by Enrollments">
              {data.data.topTeachers.length === 0 ? (
                <p className="text-sm text-on-surface-variant">No approved courses with enrollments yet.</p>
              ) : (
                <Histogram data={data.data.topTeachers.map((t) => ({ label: t.name, value: t.totalEnrollments }))} />
              )}
            </ChartCard>
            <ChartCard title="Active Courses per Teacher (Top 5)">
              {data.data.topTeachers.length === 0 ? (
                <p className="text-sm text-on-surface-variant">No approved courses yet.</p>
              ) : (
                <Histogram data={data.data.topTeachers.map((t) => ({ label: t.name, value: t.courseCount }))} />
              )}
            </ChartCard>
          </Section>

          <Section
            title="Revenue Analytics"
            description="Estimated from course price × active enrollments — there's no payment gateway yet, so this isn't real transaction data."
          >
            <ChartCard title="Revenue by Category">
              <PieChart
                data={data.data.revenue.byCategory.map((c) => ({ label: c.category, value: c.revenue }))}
                valueFormatter={(v) => `$${v.toLocaleString()}`}
              />
            </ChartCard>
            <ChartCard title="Monthly Revenue (Last 6 Months)">
              {data.data.revenue.monthly.length === 0 ? (
                <p className="text-sm text-on-surface-variant">No revenue-generating enrollments yet.</p>
              ) : (
                <Histogram
                  color={SEQUENTIAL_GREEN}
                  valueFormatter={(v) => `$${v.toLocaleString()}`}
                  data={data.data.revenue.monthly.map((m) => ({ label: monthLabel(m.month), value: m.revenue }))}
                />
              )}
            </ChartCard>
          </Section>
        </>
      )}
    </DashboardShell>
  )
}

export default AdminDashboard
