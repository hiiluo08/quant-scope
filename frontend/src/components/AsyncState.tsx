import React from 'react'
import type { ApiState } from '../hooks/useApi'

interface AsyncStateProps<T> {
  state: ApiState<T>
  children: (data: T) => React.ReactNode
  emptyMessage?: string
  errorMessage?: string
}

export function AsyncState<T>({
  state,
  children,
  emptyMessage = 'No data available.',
  errorMessage = 'An error occurred while fetching data.',
}: AsyncStateProps<T>): React.ReactElement {
  if (state.status === 'loading') {
    return (
      <div className="async-loading" role="status">
        Loading research data...
      </div>
    )
  }

  if (state.status === 'error') {
    return (
      <div className="async-error" role="alert">
        <svg className="async-error-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
        <div className="async-error-content">
          <p className="async-error-title">{errorMessage}</p>
          <p className="async-error-detail">{state.error.message}</p>
          <button type="button" className="btn-ghost" onClick={state.retry}>
            Retry
          </button>
        </div>
      </div>
    )
  }

  if (state.status === 'empty') {
    return (
      <div className="async-empty">
        <svg className="async-empty-icon" xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"></polyline><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"></path></svg>
        <h2>{emptyMessage}</h2>
        <p>No data available to display.</p>
        <button type="button" className="btn-ghost" onClick={state.retry}>
          Refresh
        </button>
      </div>
    )
  }

  return <>{children(state.data)}</>
}
