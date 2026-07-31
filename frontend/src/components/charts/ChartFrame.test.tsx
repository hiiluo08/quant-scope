import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ChartFrame } from './ChartFrame'

describe('ChartFrame', () => {
    it('renders title and description', () => {
        render(<ChartFrame title="Price action" description="Latest available daily data"><div>Chart body</div></ChartFrame>)
        expect(screen.getByRole('heading', { name: 'Price action' })).toBeVisible()
        expect(screen.getByText('Latest available daily data')).toBeVisible()
    })
})
