
import { Metric } from './ui/Metric'

export function MetricCard({ label, value }: { label: string; value: string }) {
  let tone: 'neutral' | 'positive' | 'negative' | 'muted' = 'neutral'
  if (value === '—' || value === 'Not available') tone = 'muted'
  else if (value.startsWith('-')) tone = 'negative'
  else if (value.includes('%')) tone = 'positive'

  return <Metric label={label} value={value} tone={tone} />
}