import { computeTicks, formatTick, SEQUENTIAL_BLUE } from './chartUtils'

// Single-series bar chart. Bars are capped at a fixed width and centered with
// real gaps between them — they never stretch to fill the card, so one or
// two data points don't render as a single meaningless rectangle.
function Histogram({ data, color = SEQUENTIAL_BLUE, valueFormatter = (v) => v, height = 200 }) {
  const rawMax = Math.max(1, ...data.map((d) => d.value))
  const { max, ticks } = computeTicks(rawMax)

  return (
    <div className="flex gap-2">
      <div className="flex w-9 shrink-0 flex-col justify-between text-right text-[11px] text-on-surface-variant" style={{ height }}>
        {[...ticks].reverse().map((t) => (
          <span key={t}>{formatTick(t)}</span>
        ))}
      </div>

      <div className="min-w-0 flex-1">
        <div className="relative border-b border-surface-dim" style={{ height }}>
          {ticks.map((t) => (
            <div key={t} className="absolute inset-x-0 border-t border-surface-dim" style={{ bottom: `${(t / max) * 100}%` }} />
          ))}

          <div className="absolute inset-0 flex items-end justify-center gap-4 overflow-x-auto px-2">
            {data.map((d) => (
              <div key={d.label} className="group relative flex h-full w-10 shrink-0 flex-col items-center justify-end">
                <span
                  className="pointer-events-none absolute left-1/2 hidden -translate-x-1/2 -translate-y-2 rounded-md bg-on-surface px-2 py-1 text-[11px] font-semibold whitespace-nowrap text-white group-hover:block group-focus-within:block"
                  style={{ bottom: `${Math.max(2, (d.value / max) * 100)}%` }}
                >
                  {valueFormatter(d.value)}
                </span>
                <div
                  tabIndex={0}
                  aria-label={`${d.label}: ${valueFormatter(d.value)}`}
                  className="w-6 rounded-t-[4px] outline-none transition-opacity group-hover:opacity-80 focus-visible:ring-2 focus-visible:ring-secondary"
                  style={{ height: `${Math.max(2, (d.value / max) * 100)}%`, background: color }}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-2 flex justify-center gap-4 overflow-x-auto px-2">
          {data.map((d) => (
            <span key={d.label} className="w-10 shrink-0 truncate text-center text-[11px] text-on-surface-variant" title={d.label}>
              {d.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Histogram
