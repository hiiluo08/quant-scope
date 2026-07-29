import React, { useState, useEffect } from 'react'
import { useApi } from '../hooks/useApi'
import { getSymbols, getMarketData } from '../api/queries'
import { AsyncState } from '../components/AsyncState'
import { ResearchNotice } from '../components/ResearchNotice'
import { LineSeriesChart } from '../components/charts/LineSeriesChart'
import { DataTable, type Column } from '../components/DataTable'
import type { MarketRow } from '../api/types'

export const MarketDataPage: React.FC = () => {
	const [selectedSymbol, setSelectedSymbol] = useState<string>('')
	const symbolsState = useApi('symbols', getSymbols)

	useEffect(() => {
		if (symbolsState.status === 'success' && symbolsState.data.symbols.length > 0) {
			if (!selectedSymbol) {
				const defaultSym = symbolsState.data.symbols.includes('SPY')
					? 'SPY'
					: symbolsState.data.symbols[0]
				setSelectedSymbol(defaultSym)
			}
		}
	}, [symbolsState, selectedSymbol])

	const marketDataState = useApi(
		selectedSymbol ? `market-data-${selectedSymbol}` : '',
		(signal) => (selectedSymbol ? getMarketData(selectedSymbol, signal) : Promise.reject('No symbol selected'))
	)

	const columns: Column<MarketRow>[] = [
		{ key: 'date', header: 'Date', render: (r) => r.date },
		{ key: 'open', header: 'Open', render: (r) => r.open.toFixed(2) },
		{ key: 'high', header: 'High', render: (r) => r.high.toFixed(2) },
		{ key: 'low', header: 'Low', render: (r) => r.low.toFixed(2) },
		{ key: 'close', header: 'Close', render: (r) => r.close.toFixed(2) },
		{ key: 'adj_close', header: 'Adj Close', render: (r) => r.adjusted_close.toFixed(2)},
		{ key: 'volume', header: 'Volume', render: (r) => r.volume.toLocaleString() },
	]

	return (
		<div className="market-data-page">
			<ResearchNotice message="Market Data Explorer: Displays daily normalized OHLCV data. Past prices are not indicative of future returns." />

			<div className="card" style={{ marginBottom: '1rem' }}>
				<h1 className="card-title">Market Data Explorer</h1>
				<AsyncState state={symbolsState}>
					{(symbolsData) => (
						<div style={{ marginTop: '0.5rem' }}>
							<label htmlFor="symbol-select" style={{ marginRight: '0.5rem', fontWeight: 'bold' }}>
								Symbol:
							</label>
							<select
								id="symbol-select"
								aria-label="Symbol"
								value={selectedSymbol}
								onChange={(e) => setSelectedSymbol(e.target.value)}
								style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solidvar(--border)' }}>
								{symbolsData.symbols.map((sym) => (
									<option key={sym} value={sym}>
										{sym}
									</option>
								))}
							</select>
						</div>
					)}
				</AsyncState>
			</div>

			{selectedSymbol && (
				<AsyncState state={marketDataState}>
					{(marketData) => {
						const rows = marketData.data || []
						const tableRows = [...rows].slice(-100).reverse()

						return (
							<>
								<LineSeriesChart
									title={`${marketData.symbol} — Adjusted Close Price`}
									data={rows}
									dataKey="adjusted_close"
									color="var(--data-primary)"
									type="line"
								/>

								<LineSeriesChart
									title={`${marketData.symbol} — Trading Volume`}
									data={rows}
									dataKey="volume"
									color="var(--data-secondary)"
									type="bar"
								/>

								<div className="card" style={{ marginTop: '1rem' }}>
									<DataTable
									caption={`Recent 100 sessions for ${marketData.symbol}`}
									columns={columns}
									data={tableRows}
									getRowKey={(r) => r.date}
									/>
								</div>
							</>
						)
					}}
				</AsyncState>
			)}
		</div>
	)
}