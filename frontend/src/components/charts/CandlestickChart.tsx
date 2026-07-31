import React from 'react';
import {
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { ChartFrame } from './ChartFrame';
import { formatDate } from '../../lib/formatters';

interface CandlestickData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
}

interface CandlestickChartProps {
  data: CandlestickData[];
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export const CandlestickChart: React.FC<CandlestickChartProps> = ({ data, title, description, action }) => {
  if (!data || data.length === 0) {
    return (
      <ChartFrame title={title} description={description} action={action}>
        <div className="async-empty">No chart data available</div>
      </ChartFrame>
    );
  }

  const chartData = data.map(d => {
    const isGrowing = d.close >= d.open;
    const color = isGrowing ? 'var(--positive)' : 'var(--negative)';
    return {
      ...d,
      wick: [d.low, d.high],
      body: [Math.min(d.open, d.close), Math.max(d.open, d.close)],
      isGrowing,
      color,
      formattedDate: d.date ? formatDate(d.date) : ''
    };
  });

  const minLow = Math.min(...data.map(d => d.low));
  const maxHigh = Math.max(...data.map(d => d.high));
  const domain = [
    Math.floor(minLow * 0.99),
    Math.ceil(maxHigh * 1.01)
  ];

  return (
    <ChartFrame title={title} description={description} action={action}>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
          
          <XAxis dataKey="date" xAxisId="wick" hide />
          <XAxis dataKey="formattedDate" xAxisId="body" stroke="var(--text-secondary)" tickLine={false} axisLine={false} tickMargin={8} minTickGap={60} />
          
          <YAxis domain={domain} stroke="var(--text-secondary)" tickLine={false} axisLine={false} tickFormatter={(val) => val.toFixed(2)} width={90} />
          
          <Tooltip 
            contentStyle={{ backgroundColor: 'var(--surface-1)', borderColor: 'var(--border-subtle)', color: 'var(--text-primary)', borderRadius: '8px' }}
            itemStyle={{ color: 'var(--text-primary)' }}
            labelStyle={{ color: 'var(--text-secondary)', marginBottom: '8px' }}
            formatter={(value: any, name: any) => {
              if (name === 'wick' || name === 'body' || name === 'isGrowing' || name === 'color' || name === 'formattedDate') return [];
              return [value, name];
            }}
            labelFormatter={(label, payload) => {
              if (payload && payload[0] && payload[0].payload) {
                return payload[0].payload.formattedDate;
              }
              return label;
            }}
          />
          
          <Bar dataKey="wick" xAxisId="wick" barSize={2} isAnimationActive={false}>
            {chartData.map((entry, index) => (
              <Cell key={`wick-${index}`} fill={entry.color} />
            ))}
          </Bar>

          <Bar dataKey="body" xAxisId="body" barSize={10} isAnimationActive={false}>
            {chartData.map((entry, index) => (
              <Cell 
                key={`body-${index}`} 
                fill={entry.isGrowing ? 'var(--surface-1)' : entry.color} 
                stroke={entry.color} 
                strokeWidth={2} 
              />
            ))}
          </Bar>
        </ComposedChart>
      </ResponsiveContainer>
    </ChartFrame>
  );
};
