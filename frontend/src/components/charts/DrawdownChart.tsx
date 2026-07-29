import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { DrawdownRow } from '../../pages/backtestTransforms'

export function DrawdownChart({ data }: { data: DrawdownRow[] }) {
  return (
    <section className="card" aria-label="Drawdown from running peak">
      <h2>Drawdown from running peak</h2>
      <div style={{ width: '100%', height: 300 }}>
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