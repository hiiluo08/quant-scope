import { describe, expect, it } from 'vitest'
import { readStringParam, writeStringParam } from './urlState'

describe('urlState', () => {
  it('reads and writes parameters correctly', () => {
    expect(writeStringParam('?symbol=SPY', 'range', '6M')).toBe('?symbol=SPY&range=6M')
    expect(readStringParam('?symbol=SPY&range=6M', 'range', '1M')).toBe('6M')
    expect(readStringParam('?symbol=SPY', 'range', '1M')).toBe('1M')
    expect(writeStringParam('?symbol=SPY&range=6M', 'range', '')).toBe('?symbol=SPY')
    expect(writeStringParam('?symbol=SPY', 'symbol', '')).toBe('')
  })
})
