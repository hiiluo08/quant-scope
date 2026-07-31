import { ResponsiveContainer, LineChart, Line, Tooltip, XAxis, YAxis, CartesianGrid, ReferenceLine } from 'recharts'
import type { DailyBacktestRow } from '../../api/types'

export function EquityChart({ data }: { data: DailyBacktestRow[] }) {
  return (
    <section className="card" aria-label="Net equity curve after modeled costs">
      <h3 className="chart-title">Net equity curve after modeled costs</h3>
      <div className="chart-container">
        <ResponsiveContainer>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tick={{ fill: 'var(--text-muted)' }} tickMargin={8} minTickGap={30} />
            <YAxis domain={['auto', 'auto']} tick={{ fill: 'var(--text-muted)' }} tickFormatter={(v) => v.toFixed(2)} width={60} />
            <Tooltip 
                cursor={{ stroke: 'var(--gray-300)', strokeDasharray: '3 3' }}
                formatter={(value: any) => [Number(value).toFixed(4), 'Equity']}
                labelStyle={{ color: 'var(--gray-400)', marginBottom: '4px' }}
            />
            <ReferenceLine y={1} stroke="var(--gray-300)" strokeDasharray="3 3" label={{ position: 'insideTopLeft', value: 'Baseline', fill: 'var(--text-muted)', fontSize: 11 }} />
            <Line
              type="monotone"
              dataKey="equity_curve"
              stroke="var(--data-primary)"
              dot={false}
              strokeWidth={2}
              activeDot={{ r: 4, strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}