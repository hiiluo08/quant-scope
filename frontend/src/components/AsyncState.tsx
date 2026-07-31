import React from 'react'
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
      <div role="status" className={`async-loading variant-${variant}`}>
        Loading research data...
      </div>
    )
  }

  if (state.status === 'error') {
    return (
      <div className={`async-error variant-${variant}`} role="alert">
        <p className="async-error-title">{errorMessage}</p>
        <p className="async-error-detail">{state.error.message}</p>
        <button type="button" onClick={state.retry}>
          Retry
        </button>
      </div>
    )
  }

  if (state.status === 'empty') {
    return (
      <div className={`async-empty variant-${variant}`}>
        <h2>{emptyMessage}</h2>
        <button type="button" onClick={state.retry}>
          Refresh
        </button>
      </div>
    )
  }

  return <>{children(state.data)}</>
}
