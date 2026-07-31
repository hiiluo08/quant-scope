import { describe, expect, it } from 'vitest'
import { deriveStrategyHealth, extractTopSignals, deriveFactorLeaders } from './commandCenterTransforms'

describe('commandCenterTransforms', () => {
    it('deriveStrategyHealth extracts key metrics', () => {
        const backtest = {
            strategy_name: 'Alpha',
            end_date: '2026-07-31',
            metrics: { cagr: 0.1, sharpe_ratio: 1.5, max_drawdown: -0.05, average_exposure: 0.8 }
        } as any
        const res = deriveStrategyHealth(backtest)
        expect(res?.strategy_name).toBe('Alpha')
        expect(res?.cagr).toBe(0.1)
    })
    
    it('extractTopSignals sorts predictions', () => {
        const data = [
            { symbol: 'A', prediction: 0.1, date: '2026-07-31' },
            { symbol: 'B', prediction: 0.5, date: '2026-07-31' },
            { symbol: 'C', prediction: 0.2, date: '2026-07-31' }
        ] as any
        const res = extractTopSignals(data)
        expect(res[0].symbol).toBe('B')
        expect(res[1].symbol).toBe('C')
    })
    
    it('deriveFactorLeaders gets top symbols', () => {
        const data = {
            data: [
                { symbol: 'A', factor_value: 10, date: '2026-07-31' },
                { symbol: 'B', factor_value: 50, date: '2026-07-31' },
                { symbol: 'C', factor_value: 20, date: '2026-07-31' }
            ]
        } as any
        const res = deriveFactorLeaders(data)
        expect(res[0].symbol).toBe('B')
        expect(res[1].symbol).toBe('C')
    })
})
