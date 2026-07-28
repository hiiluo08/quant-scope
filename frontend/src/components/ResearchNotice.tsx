import React from 'react'

interface ResearchNoticeProps {
  message?: string
}

export const ResearchNotice: React.FC<ResearchNoticeProps> = ({
  message = 'Research Notice: QuantScope dashboard displays educational quantitative research evidence only. It does not provide financial advice, performance guarantees, or live trading signals.',
}) => {
  return (
    <div className="research-notice" role="note">
      <span aria-hidden="true">⚠️</span>
      <div>{message}</div>
    </div>
  )
}
