import { cleanup, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { App } from './App'

vi.mock('./pages/OverviewPage', async () => {
  const React = await import('react')
  const { AsyncState } = await import('./components/AsyncState')
  const { ApiError } = await import('./api/client')
  return {
    OverviewPage: () => {
      const [retried, setRetried] = React.useState(false)
      const state = retried
        ? { status: 'success' as const, data: 'overview recovered', retry: () => setRetried(false) }
        : { status: 'error' as const, error: new ApiError(503, 'Backend unavailable'), retry: () => setRetried(true) }
      const envelope = { factors: [], count: 0 }
      return <><h1>Overview page</h1><AsyncState state={state}>{() => envelope.count === 0
        ? <section><h2>No persisted overview artifacts</h2><p>Run the matching jobs, then retry.</p></section>
        : <p>overview content</p>}</AsyncState></>
    },
  }
})
vi.mock('./pages/MarketDataPage', () => ({ MarketDataPage: () => <h1>Market Data page</h1> }))
vi.mock('./pages/FactorsPage', () => ({ FactorsPage: () => <h1>Factors page</h1> }))
vi.mock('./pages/BacktestsPage', () => ({ BacktestsPage: () => <h1>Backtests page</h1> }))
vi.mock('./pages/MLLabPage', () => ({ MLLabPage: () => <h1>ML Lab page</h1> }))

function renderAt(path: string) {
  return render(<MemoryRouter initialEntries={[path]}><App /></MemoryRouter>)
}

afterEach(() => {
  cleanup()
})

describe('application routing and resilient states', () => {
  it.each([
    ['/', 'Command Center'],
    ['/market-data', 'Markets'],
    ['/factors', 'Factors'],
    ['/backtests', 'Strategies'],
    ['/ml', 'ML Signals'],
  ])('keeps an accessible navigation destination for %s', async (path, linkName) => {
    renderAt(path)
    expect(screen.getAllByRole('link', { name: linkName })[0]).toBeInTheDocument()
  })

  it('redirects an unknown route and exposes current navigation state', async () => {
    renderAt('/not-a-route')
    expect(await screen.findByRole('heading', { name: 'Overview page' })).toBeInTheDocument()
    expect(screen.getAllByRole('link', { name: 'Command Center' })[0]).toHaveAttribute('aria-current', 'page')
  })

  it('runs AsyncState Retry and then renders the page-level nested envelope empty state', async () => {
    const user = userEvent.setup()
    renderAt('/')
    const alert = await screen.findByRole('alert')
    expect(alert).toHaveTextContent('Backend unavailable')
    await user.click(within(alert).getByRole('button', { name: 'Retry' }))
    await waitFor(() => expect(screen.queryByRole('alert')).not.toBeInTheDocument())
    expect(screen.getByRole('heading', { name: 'No persisted overview artifacts' })).toBeInTheDocument()
    expect(screen.getByText(/Run the matching jobs/)).toBeInTheDocument()
  })

  it('navigates between real App routes with keyboard interaction', async () => {
    const user = userEvent.setup()
    renderAt('/')
    const factorsLink = screen.getAllByRole('link', { name: 'Factors' })[0]
    factorsLink.focus()
    await user.keyboard('{Enter}')
    expect(await screen.findByRole('heading', { name: 'Factors page' })).toBeInTheDocument()
    expect(screen.getAllByRole('link', { name: 'Factors' })[0]).toHaveAttribute('aria-current', 'page')
  })
})
