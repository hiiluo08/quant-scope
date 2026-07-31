import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from 'recharts'
import type { DrawdownRow } from '../../pages/backtestTransforms'
import { ChartFrame } from './ChartFrame'
import { formatDate } from '../../lib/formatters'

export function DrawdownChart({ data }: { data: DrawdownRow[] }) {
  if (!data || data.length === 0) {
    return (
      <ChartFrame title="Drawdown from running peak">
        <div className="async-empty">No chart data available</div>
      </ChartFrame>
    )
  }

  const processedData = data.map(d => ({
    ...d,
    formattedDate: d.date ? formatDate(d.date) : ''
  }))

  return (
    <ChartFrame title="Drawdown from running peak">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={processedData}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
          <XAxis dataKey="formattedDate" tick={{ fill: 'var(--text-secondary)' }} tickMargin={8} minTickGap={60} tickLine={false} axisLine={false} />
          <YAxis tick={{ fill: 'var(--text-secondary)' }} tickFormatter={(v) => (v * 100).toFixed(0) + '%'} width={90} tickLine={false} axisLine={false} />
          <Tooltip 
              cursor={{ stroke: 'var(--border-subtle)', strokeDasharray: '3 3' }}
              formatter={(value: any) => [(Number(value) * 100).toFixed(2) + '%', 'Drawdown']}
              contentStyle={{ backgroundColor: 'var(--surface-1)', borderColor: 'var(--border-subtle)', color: 'var(--text-primary)', borderRadius: '8px' }}
              itemStyle={{ color: 'var(--text-primary)' }}
              labelStyle={{ color: 'var(--text-secondary)', marginBottom: '4px' }}
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
    </ChartFrame>
  )
}