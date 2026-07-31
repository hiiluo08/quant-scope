import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useApi } from '../hooks/useApi'
import { getSymbols, getMarketData } from '../api/queries'
import { AsyncState } from '../components/AsyncState'
import { LineSeriesChart } from '../components/charts/LineSeriesChart'
import { CandlestickChart } from '../components/charts/CandlestickChart'
import { DataTable, type Column } from '../components/DataTable'
import { SearchBox } from '../components/SearchBox'
import { Panel } from '../components/ui/Panel'
import { DataFreshness } from '../components/ui/DataFreshness'
import { Metric } from '../components/ui/Metric'
import type { MarketRow } from '../api/types'
import { formatDate } from '../lib/formatters'

export const MarketDataPage: React.FC = () => {
	const formatVolume = (val?: number) => {
		if (val === undefined) return '0';
		if (val >= 1e9) return (val / 1e9).toFixed(2) + 'B';
		if (val >= 1e6) return (val / 1e6).toFixed(2) + 'M';
		if (val >= 1e3) return (val / 1e3).toFixed(2) + 'K';
		return val.toFixed(0);
	}
	const [searchParams, setSearchParams] = useSearchParams()
	const urlSymbol = searchParams.get('symbol')
	
	const [selectedSymbol, setSelectedSymbol] = useState<string>(urlSymbol || '')
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

	useEffect(() => {
		if (selectedSymbol && selectedSymbol !== urlSymbol) {
			setSearchParams({ symbol: selectedSymbol }, { replace: true })
		}
	}, [selectedSymbol, urlSymbol, setSearchParams])

	const marketDataState = useApi(
		selectedSymbol ? `market-data-${selectedSymbol}` : '',
		(signal) => (selectedSymbol ? getMarketData(selectedSymbol, signal) : Promise.reject('No symbol selected'))
	)

	const columns: Column<MarketRow>[] = [
		{ key: 'date', header: 'Date', render: (r) => formatDate(r.date), sortValue: (r) => r.date },
		{ key: 'open', header: 'Open', render: (r) => r.open.toFixed(2), align: 'end' },
		{ key: 'high', header: 'High', render: (r) => r.high.toFixed(2), align: 'end' },
		{ key: 'low', header: 'Low', render: (r) => r.low.toFixed(2), align: 'end' },
		{ key: 'close', header: 'Close', render: (r) => r.close.toFixed(2), align: 'end' },
		{ key: 'adj_close', header: 'Adj Close', render: (r) => r.adjusted_close.toFixed(2), align: 'end'},
		{ key: 'volume', header: 'Volume', render: (r) => r.volume.toLocaleString(), align: 'end' },
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
		<div className="page-enter" style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '32px' }}>
			<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
				<div>
					<h1 className="page-title" style={{ margin: 0, fontSize: '1.75rem', color: 'var(--text-primary)' }}>Market Data</h1>
					<p style={{ color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>Search and analyze over 500 symbols</p>
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
				<AsyncState state={marketDataState} variant="panel">
					{(marketData) => {
						const allRows = marketData.data || []
						const filteredRows = filterDataByTimeRange(allRows)
						const tableRows = [...filteredRows]
						
						const latestRow = filteredRows[filteredRows.length - 1]
						const prevRow = filteredRows[filteredRows.length - 2]
						
						let priceTrend: 'up' | 'down' | 'neutral' = 'neutral'
						if (latestRow && prevRow) {
							priceTrend = latestRow.close > prevRow.close ? 'up' : latestRow.close < prevRow.close ? 'down' : 'neutral'
						}

						return (
							<div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
								<Panel>
									<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
										<div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
											<Metric 
												label="Latest Close" 
												value={latestRow ? `$${latestRow.close.toFixed(2)}` : '-'} 
												tone="neutral" 
											/>
											<Metric 
												label="Latest Volume" 
												value={latestRow ? formatVolume(latestRow.volume) : '-'} 
											/>
											<Metric 
												label="30-Day Avg Volume" 
												value={formatVolume(filteredRows.slice(-30).reduce((a, b) => a + b.volume, 0) / Math.min(30, filteredRows.length || 1))} 
											/>
										</div>
										{latestRow && <DataFreshness timestamp={latestRow.date} />}
									</div>

									<div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
										{['1M', '3M', '6M', '1Y', 'ALL'].map(range => (
											<button 
												key={range}
												onClick={() => setTimeRange(range as any)}
												style={{
													padding: '4px 12px',
													background: timeRange === range ? 'var(--surface-2)' : 'transparent',
													color: timeRange === range ? 'var(--text-primary)' : 'var(--text-secondary)',
													border: `1px solid ${timeRange === range ? 'var(--border-strong)' : 'var(--border-subtle)'}`,
													borderRadius: '4px',
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

									<div style={{ height: '400px', marginBottom: '24px' }}>
										<CandlestickChart
											title={`${marketData.symbol} Price`}
											data={filteredRows}
										/>
									</div>
									<div style={{ height: '240px' }}>
										<LineSeriesChart
											title={`${marketData.symbol} Volume`}
											data={filteredRows}
											dataKey="volume"
											color="var(--accent)"
											type="bar"
										/>
									</div>
								</Panel>

								<Panel title={`Recent sessions for ${marketData.symbol}`}>
									<DataTable
										caption="Daily OHLCV"
										columns={columns}
										data={tableRows}
										getRowKey={(r) => r.date}
										initialSortKey="date"
										initialSortAsc={false}
									/>
								</Panel>
							</div>
						)
					}}
				</AsyncState>
			)}
		</div>
	)
}