import React from 'react'
import { formatDate } from '../../lib/formatters'

export interface DataFreshnessProps {
  timestamp?: string
  label?: string
}

export const DataFreshness: React.FC<DataFreshnessProps> = ({ timestamp, label }) => {
  const displayLabel = label || (timestamp ? 'As of' : 'Latest available data')
  const dateStr = timestamp ? formatDate(timestamp) : null

  return (
    <div aria-live="polite" style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
      <span>{displayLabel}</span>
      {dateStr && <time dateTime={timestamp}>{dateStr}</time>}
    </div>
  )
}
