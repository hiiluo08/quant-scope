import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { DrawdownRow } from '../../pages/backtestTransforms'

export function DrawdownChart({ data }: { data: DrawdownRow[] }) {
  return (
    <section className="card" aria-label="Drawdown from running peak">
      <h3 className="chart-title">Drawdown from running peak</h3>
      <div className="chart-container">
        <ResponsiveContainer>
          <AreaChart data={data}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Area
              dataKey="drawdown"
              stroke="var(--negative)"
              fill="var(--negative)"
              fillOpacity={0.2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}