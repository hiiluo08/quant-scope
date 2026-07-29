import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from 'recharts'
import type { DrawdownRow } from '../../pages/backtestTransforms'

export function DrawdownChart({ data }: { data: DrawdownRow[] }) {
  return (
    <section className="card" aria-label="Drawdown from running peak">
      <h3 className="chart-title">Drawdown from running peak</h3>
      <div className="chart-container">
        <ResponsiveContainer>
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tick={{ fill: 'var(--text-muted)' }} tickMargin={8} minTickGap={30} />
            <YAxis tick={{ fill: 'var(--text-muted)' }} tickFormatter={(v) => (v * 100).toFixed(0) + '%'} width={60} />
            <Tooltip 
                cursor={{ stroke: 'var(--gray-300)', strokeDasharray: '3 3' }}
                formatter={(value: any) => [(Number(value) * 100).toFixed(2) + '%', 'Drawdown']}
                labelStyle={{ color: 'var(--gray-400)', marginBottom: '4px' }}
            />
            <Area
              type="monotone"
              dataKey="drawdown"
              stroke="var(--negative)"
              strokeWidth={2}
              fill="var(--negative)"
              fillOpacity={0.1}
              activeDot={{ r: 4, strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}