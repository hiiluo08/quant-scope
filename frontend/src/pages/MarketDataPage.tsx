import React from 'react'
import { ResearchNotice } from '../components/ResearchNotice'

export const MarketDataPage: React.FC = () => {
  return (
    <div className="market-data-page">
      <ResearchNotice message="Market Data Explorer: Displays daily normalized OHLCV data. Past prices are not indicative of future returns." />
      <div className="card">
        <h1 className="card-title">Market Data Explorer</h1>
        <p>Explore normalized market datasets and time-series prices for universe assets.</p>
      </div>
    </div>
  )
}
