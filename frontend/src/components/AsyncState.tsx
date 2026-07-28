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
    return <div className="async-loading">Loading data...</div>
  }

  if (state.status === 'error') {
    return (
      <div className="async-error">
        <p>{errorMessage}</p>
        <p><strong>Detail:</strong> {state.error.message}</p>
        <button type="button" onClick={state.retry}>
          Retry
        </button>
      </div>
    )
  }

  if (state.status === 'empty') {
    return (
      <div className="async-empty">
        <p>{emptyMessage}</p>
        <button type="button" onClick={state.retry}>
          Refresh
        </button>
      </div>
    )
  }

  return <>{children(state.data)}</>
}
