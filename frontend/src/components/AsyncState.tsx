import React from 'react'
import { AlertCircle, FileSearch, Loader2, RefreshCcw } from 'lucide-react'
import type { ApiState } from '../hooks/useApi'

interface AsyncStateProps<T> {
  state: ApiState<T>
  children: (data: T) => React.ReactNode
  emptyMessage?: string
  errorMessage?: string
  variant?: 'panel' | 'inline' | 'table'
}

export function AsyncState<T>({
  state,
  children,
  emptyMessage = 'No data available.',
  errorMessage = 'An error occurred while fetching data.',
  variant = 'inline'
}: AsyncStateProps<T>): React.ReactElement {
  if (state.status === 'loading') {
    return (
      <div role="status" className={`async-loading variant-${variant}`} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px', gap: '16px', color: 'var(--text-secondary)' }}>
        <Loader2 className="animate-spin" size={32} />
        <p style={{ margin: 0, fontWeight: 500 }}>Loading research data...</p>
      </div>
    )
  }

  if (state.status === 'error') {
    return (
      <div className={`async-error variant-${variant}`} role="alert" style={{ background: 'var(--negative-muted, rgba(239, 68, 68, 0.1))', border: '1px solid var(--negative, #ef4444)', borderRadius: '12px', padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '12px' }}>
        <div style={{ background: 'var(--negative, #ef4444)', color: 'white', padding: '12px', borderRadius: '50%' }}>
          <AlertCircle size={32} />
        </div>
        <div>
          <h3 style={{ margin: '0 0 8px 0', color: 'var(--text-primary)' }}>{errorMessage}</h3>
          <p style={{ margin: 0, color: 'var(--text-secondary)' }}>{state.error.message}</p>
        </div>
        <button type="button" onClick={state.retry} style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '8px', border: 'none', background: 'var(--accent)', color: 'white', cursor: 'pointer', fontWeight: 600 }}>
          <RefreshCcw size={16} /> Try Again
        </button>
      </div>
    )
  }

  if (state.status === 'empty') {
    return (
      <div className={`async-empty variant-${variant}`} style={{ background: 'var(--surface-2)', border: '1px dashed var(--border-strong)', borderRadius: '12px', padding: '40px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '16px' }}>
        <div style={{ color: 'var(--text-secondary)' }}>
          <FileSearch size={48} />
        </div>
        <h3 style={{ margin: 0, color: 'var(--text-primary)' }}>{emptyMessage}</h3>
        <button type="button" onClick={state.retry} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--border-strong)', background: 'transparent', color: 'var(--text-primary)', cursor: 'pointer', fontWeight: 500 }}>
          <RefreshCcw size={16} /> Refresh
        </button>
      </div>
    )
  }

  return <>{children(state.data)}</>
}
