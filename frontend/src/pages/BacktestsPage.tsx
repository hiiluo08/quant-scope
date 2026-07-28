import React from 'react'
import { ResearchNotice } from '../components/ResearchNotice'

export const BacktestsPage: React.FC = () => {
  return (
    <div className="backtests-page">
      <ResearchNotice message="Backtesting Results: Backtested metrics include modeled transaction costs and slippage, but represent historical simulations only." />
      <div className="card">
        <h1 className="card-title">Strategy Backtests</h1>
        <p>Analyze equity curves, drawdowns, and performance metrics across baseline and ML strategies.</p>
      </div>
    </div>
  )
}
