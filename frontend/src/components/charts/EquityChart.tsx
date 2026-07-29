import { ResponsiveContainer, LineChart, Line, Tooltip, XAxis, YAxis } from 'recharts'
import type { DailyBacktestRow } from '../../api/types'

export function EquityChart({ data }: { data: DailyBacktestRow[] }) {
  return (
    <section className="card" aria-label="Net equity curve after modeled costs">
      <h3 className="chart-title">Net equity curve after modeled costs</h3>
      <div className="chart-container">
        <ResponsiveContainer>
          <LineChart data={data}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line
              dataKey="equity_curve"
              stroke="var(--data-primary)"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}