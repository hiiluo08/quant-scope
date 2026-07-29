import { getJson } from './client'
import type { MarketResponse, SymbolsResponse } from './types'

export const getSymbols = (signal?: AbortSignal) =>
    getJson<SymbolsResponse>('/market-data/symbols', signal)

export const getMarketData = (symbol: string, signal?: AbortSignal) =>
    getJson<MarketResponse>(`/market-data/${symbol}?limit=500`, signal)