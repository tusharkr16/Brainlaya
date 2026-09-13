// Shared axis math for Histogram/LineChart: pick a "nice" max and a small set
// of evenly-spaced ticks instead of scaling exactly to the data max.
function niceMax(rawMax) {
  if (rawMax <= 0) return 4
  const magnitude = 10 ** Math.floor(Math.log10(rawMax))
  const normalized = rawMax / magnitude
  let niceNormalized
  if (normalized <= 1) niceNormalized = 1
  else if (normalized <= 2) niceNormalized = 2
  else if (normalized <= 4) niceNormalized = 4
  else if (normalized <= 5) niceNormalized = 5
  else niceNormalized = 10
  return niceNormalized * magnitude
}

export function computeTicks(rawMax) {
  const max = niceMax(rawMax)
  // Small integer maxes get one tick per unit (0,1,2..) instead of quarters of a decimal.
  const count = max <= 4 && Number.isInteger(max) ? max : 4
  const step = max / count
  return { max, ticks: Array.from({ length: count + 1 }, (_, i) => step * i) }
}

export function formatTick(v) {
  return Number.isInteger(v) ? v.toLocaleString() : v.toFixed(1)
}

// The dataviz skill's validated categorical order (fixed, never cycled/reordered).
export const CATEGORICAL_COLORS = ['#2a78d6', '#eb6834', '#1baf7a', '#eda100', '#e87ba4', '#008300', '#4a3aa7', '#e34948']

export const SEQUENTIAL_BLUE = '#2a78d6'
export const SEQUENTIAL_GREEN = '#008300'
