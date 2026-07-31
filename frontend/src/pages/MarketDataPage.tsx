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
	const formatVolume = (val?: number) => {
		if (val === undefined) return '0';
		if (val >= 1e9) return (val / 1e9).toFixed(2) + 'B';
		if (val >= 1e6) return (val / 1e6).toFixed(2) + 'M';
		if (val >= 1e3) return (val / 1e3).toFixed(2) + 'K';
		return val.toFixed(0);
	}
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
								<div className="kpi-grid">
									<div className="kpi-card">
										<div className="kpi-label">Latest Close</div>
										<div className="kpi-value">${filteredRows[filteredRows.length - 1]?.close.toFixed(2)}</div>
									</div>
									<div className="kpi-card">
										<div className="kpi-label">Latest Volume</div>
										<div className="kpi-value">{formatVolume(filteredRows[filteredRows.length - 1]?.volume)}</div>
									</div>
									<div className="kpi-card">
										<div className="kpi-label">30-Day Avg Volume</div>
										<div className="kpi-value">{formatVolume(filteredRows.slice(-30).reduce((a, b) => a + b.volume, 0) / Math.min(30, filteredRows.length))}</div>
									</div>
								</div>

								<div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
									{['1M', '3M', '6M', '1Y', 'ALL'].map(range => (
										<button 
											key={range}
											onClick={() => setTimeRange(range as any)}
											style={{
												padding: '6px 16px',
												background: timeRange === range ? 'var(--accent-primary)' : 'var(--bg-surface)',
												color: timeRange === range ? 'var(--accent-primary-text)' : 'var(--text-primary)',
												border: `1px solid ${timeRange === range ? 'var(--accent-primary)' : 'var(--border-default)'}`,
												borderRadius: 'var(--radius-full)',
												cursor: 'pointer',
												fontWeight: 500,
												fontSize: '0.875rem',
												transition: 'all var(--transition-fast)'
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
									color="var(--data-blue)"
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