import { Link } from 'react-router-dom'
import DashboardShell from '../components/DashboardShell'
import Histogram from '../components/charts/Histogram'
import LineChart from '../components/charts/LineChart'
import PieChart from '../components/charts/PieChart'
import { SEQUENTIAL_GREEN, CATEGORICAL_COLORS } from '../components/charts/chartUtils'
import { useAdminStats, useAuditLog, useAdminUsers } from '../api/admin'
import { LoadingState, ErrorState } from '../components/StateViews'
import { STATUS_BADGE } from '../lib/constants'

function DotsIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
      <circle cx="5" cy="12" r="1.6" />
      <circle cx="12" cy="12" r="1.6" />
      <circle cx="19" cy="12" r="1.6" />
    </svg>
  )
}

function TrendUpIcon() {
  return (
    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 15 10 9l4 4 6-6" />
      <path d="M14 6h6v6" />
    </svg>
  )
}

const STAT_TILES = [
  { label: 'Total Users', bg: '#ff5da2', text: 'text-white', sub: 'text-white/80', chip: 'bg-white/25 text-white' },
  { label: 'Pending Approval', bg: '#ffc94d', text: 'text-[#4a3400]', sub: 'text-[#4a3400]/70', chip: 'bg-black/10 text-[#4a3400]' },
  { label: 'Approved Courses', bg: '#7fa8ff', text: 'text-white', sub: 'text-white/80', chip: 'bg-white/25 text-white' },
]

function StatTile({ tile, value }) {
  return (
    <div className="flex min-w-[220px] flex-1 flex-col justify-between rounded-2xl p-5" style={{ background: tile.bg }}>
      <div className="flex items-start justify-between">
        <p className={`text-sm font-semibold ${tile.sub}`}>{tile.label}</p>
        <span className={`flex h-7 w-7 items-center justify-center rounded-full ${tile.chip}`}>
          <DotsIcon />
        </span>
      </div>
      <p className={`mt-4 text-[34px] leading-none font-extrabold ${tile.text}`}>{value}</p>
      <div className="mt-4 flex items-center gap-2 text-xs font-semibold">
        <span className={tile.sub}>Last 7 Days</span>
        <span className={`flex items-center gap-1 rounded-full px-2 py-0.5 ${tile.chip}`}>
          <TrendUpIcon /> 20%
        </span>
      </div>
    </div>
  )
}

const DONUT_COLORS = ['#ffc94d', '#7fa8ff', '#c4a6ff', '#ff8fa3', '#9fe6c0']

function Donut({ segments, total }) {
  const size = 180
  const stroke = 26
  const r = (size - stroke) / 2
  const circumference = 2 * Math.PI * r
  let offset = 0

  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} className="shrink-0 -rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#f1f3f9" strokeWidth={stroke} />
      {segments.map((s) => {
        const fraction = total > 0 ? s.value / total : 0
        const dash = fraction * circumference
        const gap = circumference - dash
        const circle = (
          <circle
            key={s.label}
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={s.color}
            strokeWidth={stroke}
            strokeDasharray={`${Math.max(dash - 3, 0)} ${gap + 3}`}
            strokeDashoffset={-offset}
            strokeLinecap="round"
          />
        )
        offset += dash
        return circle
      })}
    </svg>
  )
}

function timeAgo(iso) {
  const diffMs = Date.now() - new Date(iso).getTime()
  const mins = Math.round(diffMs / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.round(mins / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.round(hours / 24)}d ago`
}

function activityLabel(entry) {
  const target = entry.meta?.name || entry.meta?.email || `#${String(entry.targetId).slice(-6)}`
  switch (entry.action) {
    case 'user.create':
      return <>Added new user <strong>{target}</strong></>
    case 'user.role_change':
      return <>Changed a user&apos;s role</>
    case 'user.suspend':
      return <>Suspended a user</>
    case 'user.reactivate':
      return <>Reactivated a user</>
    case 'user.delete':
      return <>Removed <strong>{target}</strong></>
    case 'user.update':
      return <>Updated <strong>{target}</strong></>
    case 'user.password_change':
      return <>Reset a user&apos;s password</>
    case 'course.approve':
      return <>Approved a course</>
    case 'course.reject':
      return <>Rejected a course</>
    case 'course.archive':
      return <>Archived a course</>
    default:
      return entry.action
  }
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
  const { data: activityData } = useAuditLog({ page: 1, limit: 6 })
  const { data: usersData } = useAdminUsers({ page: 1, limit: 5 })

  const activity = activityData?.data || []
  const recentUsers = usersData?.data || []

  return (
    <DashboardShell active="Dashboard">
      {isPending && <LoadingState />}
      {isError && <ErrorState message={error.message} onRetry={refetch} />}

      {!isPending && !isError && (
        <>
          <div className="mb-10 grid grid-cols-1 gap-6 xl:grid-cols-[1fr_340px]">
            <div className="min-w-0">
              <div className="mb-6 flex flex-wrap gap-4">
                <StatTile tile={STAT_TILES[0]} value={data.data.totalUsers.toLocaleString()} />
                <StatTile tile={STAT_TILES[1]} value={(data.data.coursesByStatus.pending_approval || 0).toLocaleString()} />
                <StatTile tile={STAT_TILES[2]} value={(data.data.coursesByStatus.approved || 0).toLocaleString()} />
              </div>

              <div className="rounded-2xl border border-surface-dim p-5">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-bold text-on-surface">Recently Added Users</h2>
                  <Link to="/admin/users" className="text-sm font-semibold text-secondary hover:underline">
                    View all
                  </Link>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-xs font-semibold tracking-wide text-on-surface-variant uppercase">
                        <th className="pb-3">Name</th>
                        <th className="pb-3">Status</th>
                        <th className="pb-3">Email address</th>
                        <th className="pb-3">Role</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-surface-dim">
                      {recentUsers.map((u) => (
                        <tr key={u._id}>
                          <td className="py-3 pr-4">
                            <div className="flex items-center gap-3">
                              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#eaf1ff] text-sm font-bold text-secondary">
                                {u.name?.[0]?.toUpperCase()}
                              </span>
                              <p className="font-semibold text-on-surface">{u.name}</p>
                            </div>
                          </td>
                          <td className="py-3 pr-4">
                            <span className="inline-flex items-center gap-1.5 text-sm text-on-surface-variant">
                              <span className={`h-2 w-2 rounded-full ${u.status === 'active' ? 'bg-brand-green' : 'bg-error'}`} />
                              {u.status === 'active' ? 'Active' : 'Suspended'}
                            </span>
                          </td>
                          <td className="py-3 pr-4 text-sm text-on-surface-variant">{u.email}</td>
                          <td className="py-3">
                            <span className="inline-flex rounded-md bg-[#eaf1ff] px-2.5 py-1 text-xs font-semibold text-secondary capitalize">
                              {u.role}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2.5">
                <Link
                  to="/admin/users"
                  className="rounded-xl bg-[#ff5da2] px-4 py-3 text-center text-sm font-bold text-white shadow-[0_10px_24px_rgba(255,93,162,0.3)] transition-transform hover:-translate-y-0.5"
                >
                  + Add User
                </Link>
                <Link
                  to="/admin/courses/pending"
                  className="rounded-xl border border-surface-dim px-4 py-3 text-center text-sm font-bold text-on-surface transition-colors hover:bg-surface-container-low"
                >
                  Review Approval Queue
                </Link>
              </div>

              <div className="rounded-2xl border border-surface-dim p-5">
                <h2 className="mb-4 text-lg font-bold text-on-surface">Recent Activity</h2>
                <div className="flex flex-col gap-4">
                  {activity.length === 0 && <p className="text-sm text-on-surface-variant">No admin actions yet.</p>}
                  {activity.map((entry) => (
                    <div key={entry._id} className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#eaf1ff] text-xs font-bold text-secondary">
                        {entry.actorId?.name?.[0]?.toUpperCase() || '?'}
                      </span>
                      <div className="min-w-0">
                        <p className="text-sm leading-snug text-on-surface">{activityLabel(entry)}</p>
                        <p className="text-xs text-on-surface-variant">{timeAgo(entry.timestamp)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-surface-dim p-5">
                <h2 className="mb-5 text-lg font-bold text-on-surface">Course Breakdown</h2>
                {(() => {
                  const segments = Object.entries(STATUS_BADGE)
                    .map(([key, meta], i) => ({
                      label: meta.label,
                      value: data.data.coursesByStatus[key] || 0,
                      color: DONUT_COLORS[i % DONUT_COLORS.length],
                    }))
                    .filter((s) => s.value > 0)
                  const total = segments.reduce((sum, s) => sum + s.value, 0)

                  return total === 0 ? (
                    <p className="text-sm text-on-surface-variant">No courses yet.</p>
                  ) : (
                    <>
                      <div className="relative mx-auto mb-5 flex w-fit items-center justify-center">
                        <Donut segments={segments} total={total} />
                        <div className="absolute flex flex-col items-center">
                          <p className="text-2xl font-extrabold text-on-surface">{total}</p>
                          <p className="text-[11px] text-on-surface-variant">Total Courses</p>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2.5">
                        {segments.map((s) => (
                          <div key={s.label} className="flex items-center justify-between text-sm">
                            <span className="flex items-center gap-2 text-on-surface-variant">
                              <span className="h-2.5 w-2.5 rounded-full" style={{ background: s.color }} />
                              {s.label}
                            </span>
                            <span className="font-semibold text-on-surface">
                              {s.value} <span className="text-on-surface-variant">({Math.round((s.value / total) * 100)}%)</span>
                            </span>
                          </div>
                        ))}
                      </div>
                    </>
                  )
                })()}
              </div>
            </div>
          </div>

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
