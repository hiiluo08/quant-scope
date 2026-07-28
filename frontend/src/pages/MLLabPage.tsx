import React from 'react'
import { ResearchNotice } from '../components/ResearchNotice'

export const MLLabPage: React.FC = () => {
  return (
    <div className="ml-lab-page">
      <ResearchNotice message="ML Lab: Machine learning predictions evaluate 5-day forward return targets. Out-of-sample test results are noisy historical metrics." />
      <div className="card">
        <h1 className="card-title">Machine Learning Lab</h1>
        <p>Review trained XGBoost and LightGBM model manifests, validation/test metrics, and predictions.</p>
      </div>
    </div>
  )
}
