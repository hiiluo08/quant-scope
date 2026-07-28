import React from 'react'
import { ResearchNotice } from '../components/ResearchNotice'

export const OverviewPage: React.FC = () => {
  return (
    <div className="overview-page">
      <ResearchNotice />
      <div className="card">
        <h1 className="card-title">QuantScope Research Dashboard</h1>
        <p>
          Welcome to the QuantScope quantitative trading research platform. Navigate through market data,
          technical factors, strategy backtests, and machine learning alpha prediction models.
        </p>
      </div>
    </div>
  )
}
