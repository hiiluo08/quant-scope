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

const formatValue = (value: number) => {
    if (value >= 1e9) return (value / 1e9).toFixed(2) + 'B'
    if (value >= 1e6) return (value / 1e6).toFixed(2) + 'M'
    if (value >= 1e3) return (value / 1e3).toFixed(2) + 'K'
    return value.toFixed(2)
}

interface LineSeriesChartProps {
    title: string
    data: Array<Record<string, any>>
    dataKey: string
    xKey?: string
    color?: string
    type?: 'line' | 'bar'
}

export const LineSeriesChart: React.FC<LineSeriesChartProps> = ({
    title,
    data,
    dataKey,
    xKey = 'date',
    color = 'var(--data-primary)',
    type = 'line',
}) => {
    return (
    <div className="card">
        <h3 className="chart-title">{title}</h3>
        <div className="chart-container">
        <ResponsiveContainer width="100%" height="100%">
            {type === 'line' ? (
            <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-default)" vertical={false} />
                <XAxis dataKey={xKey} stroke="var(--text-muted)" tickFormatter={(val) => val.substring(5)} tickLine={false} axisLine={false} tickMargin={8} minTickGap={30} />
                <YAxis domain={['auto', 'auto']} stroke="var(--text-muted)" tickLine={false} axisLine={false} tickFormatter={formatValue} width={60} />
                <Tooltip 
                    cursor={{ stroke: 'var(--border-strong)', strokeDasharray: '3 3' }}
                    formatter={(value: any) => [formatValue(Number(value)), dataKey]}
                    contentStyle={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-default)', borderRadius: '8px', boxShadow: 'var(--shadow-md)', color: 'var(--text-primary)' }}
                    itemStyle={{ color: 'var(--text-primary)' }}
                    labelStyle={{ color: 'var(--text-muted)', marginBottom: '4px' }}
                />
                <Line type="monotone" dataKey={dataKey} stroke={color} dot={false} strokeWidth={2} activeDot={{ r: 4, strokeWidth: 0, fill: color }} />
            </LineChart>
            ) : (
            <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-default)" vertical={false} />
                <XAxis dataKey={xKey} stroke="var(--text-muted)" tickFormatter={(val) => val.substring(5)} tickLine={false} axisLine={false} tickMargin={8} minTickGap={30} />
                <YAxis stroke="var(--text-muted)" tickLine={false} axisLine={false} tickFormatter={formatValue} width={60} />
                <Tooltip 
                    cursor={{ fill: 'var(--bg-surface-hover)' }}
                    formatter={(value: any) => [formatValue(Number(value)), dataKey]}
                    contentStyle={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-default)', borderRadius: '8px', boxShadow: 'var(--shadow-md)', color: 'var(--text-primary)' }}
                    itemStyle={{ color: 'var(--text-primary)' }}
                    labelStyle={{ color: 'var(--text-muted)', marginBottom: '4px' }}
                />
                <Bar dataKey={dataKey} fill={color} radius={[4, 4, 0, 0]} isAnimationActive={false} />
            </BarChart>
            )}
        </ResponsiveContainer>
        </div>
    </div>
    )
}