import React from 'react'

export interface StatusBadgeProps {
  label: string
  icon?: React.ReactNode
  tone?: 'neutral' | 'positive' | 'negative' | 'warning'
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ label, icon, tone = 'neutral' }) => {
  let backgroundColor = 'var(--surface-2)'
  let color = 'var(--text-primary)'
  
  if (tone === 'positive') {
    backgroundColor = 'rgba(16, 185, 129, 0.1)'
    color = 'var(--positive)'
  } else if (tone === 'negative') {
    backgroundColor = 'rgba(239, 68, 68, 0.1)'
    color = 'var(--negative)'
  } else if (tone === 'warning') {
    backgroundColor = 'rgba(245, 158, 11, 0.1)'
    color = 'var(--warning)'
  }

  return (
    <span className="status-badge" style={{ backgroundColor, color, display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '2px 8px', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 500 }}>
      {icon}
      {label}
    </span>
  )
}
