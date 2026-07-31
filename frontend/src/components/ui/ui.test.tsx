import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Metric } from './Metric'
import { DataFreshness } from './DataFreshness'
import { SegmentedControl } from './SegmentedControl'

describe('UI Primitives', () => {
  it('Metric behaves correctly', () => {
    render(<Metric label="Max drawdown" value="-12.34%" tone="negative" />)
    expect(screen.getByLabelText('Max drawdown')).toHaveTextContent('-12.34%')
  })

  it('DataFreshness renders date', () => {
    render(<DataFreshness timestamp="2026-07-30T18:00:00Z" />)
    expect(screen.getByText(/30-07-2026/i)).toBeVisible()
  })

  it('SegmentedControl changes value', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<SegmentedControl label="Range" value="3M" options={['1M', '3M']} onChange={onChange} />)
    await user.click(screen.getByRole('radio', { name: '1M' }))
    expect(onChange).toHaveBeenCalledWith('1M')
  })
})
