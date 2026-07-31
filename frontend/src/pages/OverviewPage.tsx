import React from 'react'
import { Link } from 'react-router-dom'
import { ResearchNotice } from '../components/ResearchNotice'

export const OverviewPage: React.FC = () => {
  return (
    <div className="stack page-enter">
      <div className="page-header">
        <h1 className="page-title">QuantScope</h1>
        <p className="page-subtitle">Quantitative Research Dashboard</p>
      </div>

      <ResearchNotice />

      <div className="card">
        <h2>About QuantScope</h2>
        <p>
          Welcome to the QuantScope quantitative trading research platform. Navigate through market data,
          technical factors, strategy backtests, and machine learning alpha prediction models.
        </p>
      </div>

      <div className="card stack-sm">
        <h2>Research Pipeline</h2>
        <div className="metric-grid">
          <Link to="/market-data" className="card">
            <h3>Market Data</h3>
            <p className="page-subtitle">Daily normalized OHLCV data</p>
          </Link>
          <Link to="/factors" className="card">
            <h3>Factors</h3>
            <p className="page-subtitle">Persisted research features</p>
          </Link>
          <Link to="/backtests" className="card">
            <h3>Backtests</h3>
            <p className="page-subtitle">Strategy artifact results</p>
          </Link>
          <Link to="/ml" className="card">
            <h3>ML Lab</h3>
            <p className="page-subtitle">Alpha prediction models</p>
          </Link>
        </div>
      </div>
    </div>
  )
}
