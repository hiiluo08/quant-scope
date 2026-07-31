import { ResponsiveContainer, LineChart, Line, Tooltip, XAxis, YAxis, CartesianGrid, ReferenceLine } from 'recharts'
import type { DailyBacktestRow } from '../../api/types'
import { ChartFrame } from './ChartFrame'
import { formatDate } from '../../lib/formatters'

export function EquityChart({ data }: { data: DailyBacktestRow[] }) {
  if (!data || data.length === 0) {
    return (
      <ChartFrame title="Net equity curve after modeled costs">
        <div className="async-empty">No chart data available</div>
      </ChartFrame>
    )
  }

  const processedData = data.map(d => ({
    ...d,
    formattedDate: d.date ? formatDate(d.date) : ''
  }))

  return (
    <ChartFrame title="Net equity curve after modeled costs">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={processedData}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
          <XAxis dataKey="formattedDate" tick={{ fill: 'var(--text-secondary)' }} tickMargin={8} minTickGap={60} tickLine={false} axisLine={false} />
          <YAxis domain={['auto', 'auto']} tick={{ fill: 'var(--text-secondary)' }} tickFormatter={(v) => v.toFixed(2)} width={90} tickLine={false} axisLine={false} />
          <Tooltip 
              cursor={{ stroke: 'var(--border-subtle)', strokeDasharray: '3 3' }}
              formatter={(value: any) => [Number(value).toFixed(4), 'Equity']}
              contentStyle={{ backgroundColor: 'var(--surface-1)', borderColor: 'var(--border-subtle)', color: 'var(--text-primary)', borderRadius: '8px' }}
              itemStyle={{ color: 'var(--text-primary)' }}
              labelStyle={{ color: 'var(--text-secondary)', marginBottom: '4px' }}
          />
          <ReferenceLine y={1} stroke="var(--border-strong)" strokeDasharray="3 3" label={{ position: 'insideTopLeft', value: 'Baseline', fill: 'var(--text-secondary)', fontSize: 11 }} />
          <Line
            type="monotone"
            dataKey="equity_curve"
            stroke="var(--accent)"
            dot={false}
            strokeWidth={2}
            activeDot={{ r: 4, strokeWidth: 0 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartFrame>
  )
}