import React from 'react'

export interface MetricProps {
  label: string
  value: React.ReactNode
  tone?: 'neutral' | 'positive' | 'negative' | 'warning' | 'muted'
  detail?: string
}

export const Metric: React.FC<MetricProps> = ({ label, value, tone = 'neutral', detail }) => {
  let color = '#ffffff'
  if (tone === 'positive') color = 'var(--positive)'
  if (tone === 'negative') color = 'var(--negative)'
  if (tone === 'warning') color = 'var(--warning)'
  if (tone === 'muted') color = 'var(--text-secondary)'

  return (
    <div className="metric" aria-label={label} style={{ display: 'flex', flexDirection: 'column' }}>
      <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: 500, marginBottom: '4px' }}>{label}</span>
      <span style={{ fontSize: '1.5rem', fontWeight: 600, color, lineHeight: 1.2 }}>{value}</span>
      {detail && <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>{detail}</span>}
    </div>
  )
}
