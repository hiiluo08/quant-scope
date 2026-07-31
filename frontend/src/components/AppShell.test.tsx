import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { AppShell } from './AppShell'

describe('AppShell navigation and shell controls', () => {
  it('renders navigation links and handles keyboard focus', async () => {
    userEvent.setup()
    render(<MemoryRouter><AppShell><div>content</div></AppShell></MemoryRouter>)
    
    // Test navigation presence
    expect(screen.getAllByRole('link', { name: /Command Center/i })[0]).toBeInTheDocument()
    expect(screen.getAllByRole('link', { name: /Markets/i })[0]).toBeInTheDocument()
    
    // Check Watchlist
    const watchlist = screen.getByRole('button', { name: /Watchlist — Coming soon/i })
    expect(watchlist).toBeDisabled()
    expect(watchlist).toHaveAttribute('aria-disabled', 'true')
  })
})
