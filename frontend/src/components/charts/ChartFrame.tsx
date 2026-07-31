import React from 'react'

export interface ChartFrameProps {
  title: string
  description?: string
  children: React.ReactNode
  action?: React.ReactNode
}

export const ChartFrame: React.FC<ChartFrameProps> = ({ title, description, children, action }) => {
  return (
    <div className="chart-frame" style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
        <div>
          <h3 style={{ fontSize: '1rem', fontWeight: 600, margin: 0, color: 'var(--text-primary)' }}>{title}</h3>
          {description && <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '4px' }}>{description}</p>}
        </div>
        {action && <div>{action}</div>}
      </div>
      <div style={{ flex: 1, minHeight: 0, position: 'relative' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
          {children}
        </div>
      </div>
    </div>
  )
}
