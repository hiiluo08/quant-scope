import React from 'react'

export interface DetailsDrawerProps {
  title: string
  children: React.ReactNode
}

export const DetailsDrawer: React.FC<DetailsDrawerProps> = ({ title, children }) => {
  return (
    <details style={{
      border: '1px solid var(--border-subtle)',
      borderRadius: '8px',
      overflow: 'hidden'
    }}>
      <summary style={{
        padding: '12px 16px',
        backgroundColor: 'var(--surface-2)',
        cursor: 'pointer',
        fontSize: '0.875rem',
        fontWeight: 500,
        color: 'var(--text-secondary)'
      }}>
        {title}
      </summary>
      <div style={{ padding: '16px', backgroundColor: 'var(--surface-1)' }}>
        {children}
      </div>
    </details>
  )
}
