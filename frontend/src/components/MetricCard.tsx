export function MetricCard({ label, value }: { label: string; value: string }) {
  let valueClass = 'metric-value'
  if (value === '—' || value === 'Not available') {
    valueClass += ' muted'
  } else if (value.startsWith('-')) {
    valueClass += ' negative'
  } else if (value.includes('%')) {
    valueClass += ' positive'
  }

  return (
    <div className="metric-card" aria-label={label}>
      <span className="metric-label">{label}</span>
      <span className={valueClass}>{value}</span>
    </div>
  )
}