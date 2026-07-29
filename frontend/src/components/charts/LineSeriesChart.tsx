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
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey={xKey} tick={{ fill: 'var(--ink)' }} />
                <YAxis domain={['auto', 'auto']} tick={{ fill: 'var(--ink)' }} />
                <Tooltip />
                <Line type="monotone" dataKey={dataKey} stroke={color} dot={false} strokeWidth={2} />
            </LineChart>
            ) : (
            <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey={xKey} tick={{ fill: 'var(--ink)' }} />
                <YAxis tick={{ fill: 'var(--ink)' }} />
                <Tooltip />
                <Bar dataKey={dataKey} fill={color} />
            </BarChart>
            )}
        </ResponsiveContainer>
        </div>
    </div>
    )
}