import React, { useState, useEffect } from 'react'
import { useApi } from '../hooks/useApi'
import { getSymbols, getMarketData } from '../api/queries'
import { AsyncState } from '../components/AsyncState'
import { ResearchNotice } from '../components/ResearchNotice'
import { LineSeriesChart } from '../components/charts/LineSeriesChart'
import { CandlestickChart } from '../components/charts/CandlestickChart'
import { DataTable, type Column } from '../components/DataTable'
import { SearchBox } from '../components/SearchBox'
import type { MarketRow } from '../api/types'

export const MarketDataPage: React.FC = () => {
	const [selectedSymbol, setSelectedSymbol] = useState<string>('')
	const [timeRange, setTimeRange] = useState<'1M' | '3M' | '6M' | '1Y' | 'ALL'>('ALL')
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

	const filterDataByTimeRange = (data: MarketRow[]) => {
		if (timeRange === 'ALL') return data;
		const now = new Date(data[data.length - 1]?.date || Date.now());
		let monthsToSubtract = 0;
		if (timeRange === '1M') monthsToSubtract = 1;
		if (timeRange === '3M') monthsToSubtract = 3;
		if (timeRange === '6M') monthsToSubtract = 6;
		if (timeRange === '1Y') monthsToSubtract = 12;
		
		const cutoffDate = new Date(now.setMonth(now.getMonth() - monthsToSubtract)).toISOString().split('T')[0];
		return data.filter(d => d.date >= cutoffDate);
	}

	return (
		<div className="stack page-enter">
			<ResearchNotice message="Market Data Explorer: Displays daily normalized OHLCV data. Past prices are not indicative of future returns." />

			<div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
				<div>
					<h1 className="card-title" style={{ margin: 0, fontSize: '24px' }}>Market Data Explorer</h1>
					<p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>Search and analyze over 500 symbols</p>
				</div>
				<AsyncState state={symbolsState}>
					{(symbolsData) => (
						<SearchBox 
							symbols={symbolsData.symbols} 
							selectedSymbol={selectedSymbol} 
							onSelect={setSelectedSymbol} 
						/>
					)}
				</AsyncState>
			</div>

			{selectedSymbol && (
				<AsyncState state={marketDataState}>
					{(marketData) => {
						const allRows = marketData.data || []
						const filteredRows = filterDataByTimeRange(allRows)
						const tableRows = [...filteredRows].slice(-100).reverse()

						return (
							<>
								<div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
									{['1M', '3M', '6M', '1Y', 'ALL'].map(range => (
										<button 
											key={range}
											onClick={() => setTimeRange(range as any)}
											style={{
												padding: '6px 16px',
												background: timeRange === range ? 'var(--data-primary)' : 'var(--surface)',
												color: timeRange === range ? '#fff' : 'var(--ink)',
												border: `1px solid ${timeRange === range ? 'var(--data-primary)' : 'var(--border)'}`,
												borderRadius: '20px',
												cursor: 'pointer',
												fontWeight: 500,
												transition: 'all 0.2s'
											}}
										>
											{range}
										</button>
									))}
								</div>

								<CandlestickChart
									title={`${marketData.symbol} — OHLC Price`}
									data={filteredRows}
								/>

								<LineSeriesChart
									title={`${marketData.symbol} — Trading Volume`}
									data={filteredRows}
									dataKey="volume"
									color="var(--data-secondary)"
									type="bar"
								/>

								<div className="card">
									<DataTable
									caption={`Recent sessions for ${marketData.symbol}`}
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