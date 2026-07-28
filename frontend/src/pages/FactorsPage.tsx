import React from 'react'
import { ResearchNotice } from '../components/ResearchNotice'

export const FactorsPage: React.FC = () => {
  return (
    <div className="factors-page">
      <ResearchNotice message="Factors Explorer: Factor values are technical features, not execution signals or alpha guarantees." />
      <div className="card">
        <h1 className="card-title">Factors Explorer</h1>
        <p>Inspect versioned quantitative factors, warm-up periods, and cross-sectional distributions.</p>
      </div>
    </div>
  )
}
