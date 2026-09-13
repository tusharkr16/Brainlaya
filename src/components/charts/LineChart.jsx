import { useRef, useState } from 'react'
import { computeTicks, formatTick } from './chartUtils'

// series: [{ name, color, values: number[] }] — all aligned to the same `labels`.
// A single series renders with no legend (the card title already names it);
// 2+ series get a legend and the hover tooltip lists every series at that x.
function LineChart({ labels, series, valueFormatter = (v) => v, height = 200 }) {
  const containerRef = useRef(null)
  const [hoverIndex, setHoverIndex] = useState(null)

  const rawMax = Math.max(1, ...series.flatMap((s) => s.values))
  const { max, ticks } = computeTicks(rawMax)
  const n = labels.length

  const xPercent = (i) => (n <= 1 ? 50 : (i / (n - 1)) * 100)
  const bottomPercent = (v) => (v / max) * 100
  const svgY = (v) => 100 - bottomPercent(v)

  const handleMove = (e) => {
    const rect = containerRef.current.getBoundingClientRect()
    const ratio = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width))
    setHoverIndex(Math.round(ratio * (n - 1)))
  }

  return (
    <div>
      {series.length > 1 && (
        <div className="mb-3 flex flex-wrap gap-4 text-xs">
          {series.map((s) => (
            <span key={s.name} className="flex items-center gap-1.5 text-on-surface-variant">
              <span className="h-0.5 w-3 rounded-full" style={{ background: s.color }} />
              {s.name}
            </span>
          ))}
        </div>
      )}

      <div className="flex gap-2">
        <div className="flex w-9 shrink-0 flex-col justify-between text-right text-[11px] text-on-surface-variant" style={{ height }}>
          {[...ticks].reverse().map((t) => (
            <span key={t}>{formatTick(t)}</span>
          ))}
        </div>

        <div className="min-w-0 flex-1">
          <div
            ref={containerRef}
            className="relative border-b border-surface-dim"
            style={{ height }}
            onMouseMove={handleMove}
            onMouseLeave={() => setHoverIndex(null)}
          >
            {ticks.map((t) => (
              <div key={t} className="absolute inset-x-0 border-t border-surface-dim" style={{ bottom: `${(t / max) * 100}%` }} />
            ))}

            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full overflow-visible">
              {series.map((s) => (
                <polyline
                  key={s.name}
                  fill="none"
                  stroke={s.color}
                  strokeWidth="2"
                  vectorEffect="non-scaling-stroke"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  points={s.values.map((v, i) => `${xPercent(i)},${svgY(v)}`).join(' ')}
                />
              ))}
            </svg>

            {hoverIndex !== null && (
              <div className="absolute top-0 bottom-0 border-l border-outline/40" style={{ left: `${xPercent(hoverIndex)}%` }} />
            )}

            {series.map((s) =>
              s.values.map((v, i) => (
                <div
                  key={`${s.name}-${i}`}
                  className="absolute h-2.5 w-2.5 -translate-x-1/2 translate-y-1/2 rounded-full border-2 border-surface-container-lowest transition-transform"
                  style={{
                    left: `${xPercent(i)}%`,
                    bottom: `${bottomPercent(v)}%`,
                    background: s.color,
                    transform: hoverIndex === i ? 'translate(-50%, 50%) scale(1.4)' : undefined,
                  }}
                />
              ))
            )}

            {hoverIndex !== null && (
              <div
                className="pointer-events-none absolute top-1 z-10 min-w-[120px] -translate-x-1/2 rounded-lg border border-surface-dim bg-surface-container-lowest p-2.5 text-xs shadow-[var(--shadow-card-md)]"
                style={{ left: `${Math.min(88, Math.max(12, xPercent(hoverIndex)))}%` }}
              >
                <p className="mb-1 font-semibold text-on-surface">{labels[hoverIndex]}</p>
                {series.map((s) => (
                  <p key={s.name} className="flex items-center justify-between gap-3 text-on-surface-variant">
                    <span className="flex items-center gap-1.5">
                      <span className="h-0.5 w-2.5 rounded-full" style={{ background: s.color }} />
                      {s.name}
                    </span>
                    <span className="font-semibold text-on-surface">{valueFormatter(s.values[hoverIndex])}</span>
                  </p>
                ))}
              </div>
            )}
          </div>

          <div className="mt-2 flex justify-between px-1 text-[11px] text-on-surface-variant">
            <span>{labels[0]}</span>
            {n > 2 && <span>{labels[Math.floor((n - 1) / 2)]}</span>}
            {n > 1 && <span>{labels[n - 1]}</span>}
          </div>
        </div>
      </div>
    </div>
  )
}

export default LineChart
