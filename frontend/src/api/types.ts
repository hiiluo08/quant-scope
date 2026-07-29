export type MarketRow = {
    date: string
    open: number
    high: number
    low: number
    close: number
    volume: number
    adjusted_close: number
}

export type MarketResponse = {
    symbol: string
    count: number
    data: MarketRow[]
}

export type SymbolsResponse = {
    symbols: string[]
    count: number
}