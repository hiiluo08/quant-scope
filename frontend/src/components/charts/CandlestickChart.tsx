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
}

export const CandlestickChart: React.FC<CandlestickChartProps> = ({ data, title }) => {
  const chartData = data.map(d => {
    const isGrowing = d.close >= d.open;
    const color = isGrowing ? 'var(--data-green)' : 'var(--data-red)';
    return {
      ...d,
      wick: [d.low, d.high],
      body: [Math.min(d.open, d.close), Math.max(d.open, d.close)],
      isGrowing,
      color
    };
  });

  const minLow = Math.min(...data.map(d => d.low));
  const maxHigh = Math.max(...data.map(d => d.high));
  const domain = [
    Math.floor(minLow * 0.99),
    Math.ceil(maxHigh * 1.01)
  ];

  return (
    <div className="card" style={{ height: '400px', width: '100%' }}>
      <h3 className="card-title" style={{ marginBottom: '16px' }}>{title}</h3>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border-default)" vertical={false} />
          
          {/* Overlapping X-Axes to draw Wicks and Bodies at the same position */}
          <XAxis dataKey="date" xAxisId="wick" hide />
          <XAxis dataKey="date" xAxisId="body" stroke="var(--text-muted)" tickFormatter={(val) => val.substring(5)} tickLine={false} axisLine={false} />
          
          <YAxis domain={domain} stroke="var(--text-muted)" tickLine={false} axisLine={false} tickFormatter={(val) => val.toFixed(2)} />
          
          <Tooltip 
            contentStyle={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-default)', color: 'var(--text-primary)', borderRadius: '8px', boxShadow: 'var(--shadow-md)' }}
            itemStyle={{ color: 'var(--text-primary)' }}
            labelStyle={{ color: 'var(--text-muted)', marginBottom: '8px' }}
            formatter={(value: any, name: any) => {
              if (name === 'wick' || name === 'body' || name === 'isGrowing' || name === 'color') return [];
              return [value, name];
            }}
          />
          
          {/* Wicks */}
          <Bar dataKey="wick" xAxisId="wick" barSize={2} isAnimationActive={false}>
            {chartData.map((entry, index) => (
              <Cell key={`wick-${index}`} fill={entry.color} />
            ))}
          </Bar>

          {/* Bodies */}
          <Bar dataKey="body" xAxisId="body" barSize={10} isAnimationActive={false}>
            {chartData.map((entry, index) => (
              <Cell 
                key={`body-${index}`} 
                fill={entry.isGrowing ? 'var(--bg-surface)' : entry.color} 
                stroke={entry.color} 
                strokeWidth={2} 
              />
            ))}
          </Bar>
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};
