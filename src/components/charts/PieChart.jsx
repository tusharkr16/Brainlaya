import { CATEGORICAL_COLORS } from './chartUtils'

// Native CSS conic-gradient pie/donut — no charting library needed for a
// handful of categorical slices. Colors are the dataviz skill's validated
// categorical order (fixed, never reordered/cycled per-chart).
function PieChart({ data, size = 160, valueFormatter = (v) => v }) {
  const total = data.reduce((sum, d) => sum + d.value, 0)

  if (total === 0) {
    return <p className="text-sm text-on-surface-variant">No data yet.</p>
  }

  let cursor = 0
  const stops = data.map((d, i) => {
    const start = (cursor / total) * 360
    cursor += d.value
    const end = (cursor / total) * 360
    return `${CATEGORICAL_COLORS[i % CATEGORICAL_COLORS.length]} ${start}deg ${end}deg`
  })

  return (
    <div className="flex flex-wrap items-center gap-6">
      <div
        className="shrink-0 rounded-full"
        style={{
          width: size,
          height: size,
          background: `conic-gradient(${stops.join(', ')})`,
          WebkitMask: 'radial-gradient(farthest-side, transparent calc(100% - 28px), #000 calc(100% - 28px))',
          mask: 'radial-gradient(farthest-side, transparent calc(100% - 28px), #000 calc(100% - 28px))',
        }}
        role="img"
        aria-label={data.map((d) => `${d.label}: ${valueFormatter(d.value)}`).join(', ')}
      />
      <ul className="flex flex-1 min-w-[140px] flex-col gap-2">
        {data.map((d, i) => (
          <li key={d.label} className="flex items-center gap-2 text-sm">
            <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: CATEGORICAL_COLORS[i % CATEGORICAL_COLORS.length] }} />
            <span className="flex-1 truncate text-on-surface-variant">{d.label}</span>
            <span className="font-semibold text-on-surface">{valueFormatter(d.value)}</span>
            <span className="text-xs text-on-surface-variant">({Math.round((d.value / total) * 100)}%)</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default PieChart
