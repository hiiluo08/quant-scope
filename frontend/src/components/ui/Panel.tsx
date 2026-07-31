import React from 'react'

export interface PanelProps {
  title?: string
  description?: string
  action?: React.ReactNode
  children: React.ReactNode
  priority?: 'primary' | 'secondary' | 'tertiary'
}

export const Panel: React.FC<PanelProps> = ({ title, description, action, children, priority = 'secondary' }) => {
  return (
    <div className={`panel panel-${priority}`} style={{
      borderColor: priority === 'primary' ? 'var(--accent)' : 'var(--border-subtle)',
      display: 'flex', flexDirection: 'column', gap: '16px'
    }}>
      {(title || description || action) && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            {title && <h2 style={{ fontSize: '1.25rem', fontWeight: 600, margin: 0 }}>{title}</h2>}
            {description && <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '4px' }}>{description}</p>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      <div>{children}</div>
    </div>
  )
}
