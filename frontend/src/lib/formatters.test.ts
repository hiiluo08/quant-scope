import { describe, expect, it } from 'vitest'
import { formatCompactNumber, formatPrice, formatPercent, formatDate, metricTone } from './formatters'

describe('formatters', () => {
  it('formats values correctly', () => {
    expect(formatCompactNumber(1_250_000)).toBe('1.25M')
    expect(formatPrice(104.2)).toBe('$104.20')
    expect(formatPercent(-0.0315)).toBe('-3.15%')
    expect(formatDate('2026-07-30')).toBe('30-07-2026')
    expect(metricTone(null)).toBe('muted')
  })

  it('handles null and undefined', () => {
    expect(formatCompactNumber(null)).toBe('—')
    expect(formatPrice(undefined)).toBe('—')
    expect(formatPercent(NaN)).toBe('—')
    expect(metricTone(undefined)).toBe('muted')
    expect(metricTone(0)).toBe('neutral')
    expect(metricTone(1)).toBe('positive')
    expect(metricTone(-1)).toBe('negative')
  })
})
