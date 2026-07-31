import React from 'react'
import {
    ResponsiveContainer,
    LineChart,
    Line,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
} from 'recharts'
import { ChartFrame } from './ChartFrame'
import { formatDate } from '../../lib/formatters'

const formatValue = (value: number) => {
    if (value >= 1e9) return (value / 1e9).toFixed(2) + 'B'
    if (value >= 1e6) return (value / 1e6).toFixed(2) + 'M'
    if (value >= 1e3) return (value / 1e3).toFixed(2) + 'K'
    return value.toFixed(2)
}

interface LineSeriesChartProps {
    title: string
    description?: string
    action?: React.ReactNode
    data: Array<Record<string, any>>
    dataKey: string
    xKey?: string
    color?: string
    type?: 'line' | 'bar'
}

export const LineSeriesChart: React.FC<LineSeriesChartProps> = ({
    title,
    description,
    action,
    data,
    dataKey,
    xKey = 'date',
    color = 'var(--accent)',
    type = 'line',
}) => {
    if (!data || data.length === 0) {
        return (
            <ChartFrame title={title} description={description} action={action}>
                <div className="async-empty">No chart data available</div>
            </ChartFrame>
        )
    }

    const processedData = data.map(d => ({
        ...d,
        formattedDate: d[xKey] ? formatDate(d[xKey]) : ''
    }))

    return (
    <ChartFrame title={title} description={description} action={action}>
        <ResponsiveContainer width="100%" height="100%">
            {type === 'line' ? (
            <LineChart data={processedData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
                <XAxis dataKey="formattedDate" stroke="var(--text-secondary)" tickLine={false} axisLine={false} tickMargin={8} minTickGap={60} />
                <YAxis domain={['auto', 'auto']} stroke="var(--text-secondary)" tickLine={false} axisLine={false} tickFormatter={formatValue} width={90} />
                <Tooltip 
                    cursor={{ stroke: 'var(--border-subtle)', strokeDasharray: '3 3' }}
                    formatter={(value: any) => [formatValue(Number(value)), dataKey]}
                    contentStyle={{ backgroundColor: 'var(--surface-1)', borderColor: 'var(--border-subtle)', borderRadius: '8px', color: 'var(--text-primary)' }}
                    itemStyle={{ color: 'var(--text-primary)' }}
                    labelStyle={{ color: 'var(--text-secondary)', marginBottom: '4px' }}
                />
                <Line type="monotone" dataKey={dataKey} stroke={color} dot={false} strokeWidth={2} activeDot={{ r: 4, strokeWidth: 0, fill: color }} />
            </LineChart>
            ) : (
            <BarChart data={processedData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
                <XAxis dataKey="formattedDate" stroke="var(--text-secondary)" tickLine={false} axisLine={false} tickMargin={8} minTickGap={60} />
                <YAxis stroke="var(--text-secondary)" tickLine={false} axisLine={false} tickFormatter={formatValue} width={90} />
                <Tooltip 
                    cursor={{ fill: 'var(--surface-2)' }}
                    formatter={(value: any) => [formatValue(Number(value)), dataKey]}
                    contentStyle={{ backgroundColor: 'var(--surface-1)', borderColor: 'var(--border-subtle)', borderRadius: '8px', color: 'var(--text-primary)' }}
                    itemStyle={{ color: 'var(--text-primary)' }}
                    labelStyle={{ color: 'var(--text-secondary)', marginBottom: '4px' }}
                />
                <Bar dataKey={dataKey} fill={color} radius={[4, 4, 0, 0]} isAnimationActive={false} />
            </BarChart>
            )}
        </ResponsiveContainer>
    </ChartFrame>
    )
}