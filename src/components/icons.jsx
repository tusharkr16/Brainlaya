export function BrandMark() {
  return (
    <span className="flex h-14 w-14 flex-col items-center justify-center gap-0.5 rounded-xl border border-white/20 bg-white/10 px-2 py-1.5 backdrop-blur-sm">
      <svg viewBox="0 0 24 24" width="26" height="26">
        <rect x="2" y="2" width="9" height="9" rx="2.5" fill="#f97316" />
        <rect x="13" y="2" width="9" height="9" rx="2.5" fill="#2563eb" />
        <rect x="2" y="13" width="9" height="9" rx="2.5" fill="#ffffff" />
        <rect x="13" y="13" width="9" height="9" rx="2.5" fill="#d9f99d" />
      </svg>
    </span>
  )
}

export function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.9c1.7-1.57 2.7-3.87 2.7-6.62Z" />
      <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.9-2.26c-.8.54-1.83.86-3.06.86-2.35 0-4.34-1.59-5.05-3.72H.95v2.33A9 9 0 0 0 9 18Z" />
      <path fill="#FBBC05" d="M3.95 10.7a5.4 5.4 0 0 1 0-3.4V4.97H.95a9 9 0 0 0 0 8.06l3-2.33Z" />
      <path fill="#EA4335" d="M9 3.58c1.32 0 2.51.46 3.44 1.35l2.58-2.58C13.46.9 11.42 0 9 0A9 9 0 0 0 .95 4.97l3 2.33C4.66 5.17 6.65 3.58 9 3.58Z" />
    </svg>
  )
}

export function AppleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 384 512" aria-hidden="true" fill="currentColor">
      <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141 8 184.8 8 273.5c0 25.7 4.7 52.3 14.1 79.7 12.5 36.4 57.7 125.6 104.8 124.1 24.7-.6 42.1-17.5 74.2-17.5 31.2 0 47.3 17.5 74.9 17.5 47.5-.7 88.3-81.9 100.2-118.4-63.7-30-58.5-88-57.5-90.2zM254.4 89.9c26.5-31.6 24.1-60.4 23.4-70.9-23.6 1.4-50.9 16.4-66.5 34.9-17.2 19.8-27.3 44.3-25.1 70.4 24.7 1.9 48.4-11.4 68.2-34.4z" />
    </svg>
  )
}
