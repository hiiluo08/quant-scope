import React from 'react';
import {
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
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

const CandlestickShape = (props: any) => {
  const { x, width, low, high, open, close, yAxis } = props;
  const isGrowing = close >= open;
  const color = isGrowing ? 'var(--positive)' : 'var(--negative)';
  
  if (!yAxis || !yAxis.scale) return null;
  
  const scale = yAxis.scale;
  const yTop = scale(Math.max(open, close));
  const yBottom = scale(Math.min(open, close));
  const yHigh = scale(high);
  const yLow = scale(low);
  const xCenter = x + width / 2;

  return (
    <g stroke={color} fill={isGrowing ? 'transparent' : color} strokeWidth={2}>
      {/* Wick */}
      <line x1={xCenter} y1={yHigh} x2={xCenter} y2={yTop} />
      <line x1={xCenter} y1={yBottom} x2={xCenter} y2={yLow} />
      {/* Body */}
      <rect x={x} y={yTop} width={width} height={Math.max(yBottom - yTop, 1)} />
    </g>
  );
};

export const CandlestickChart: React.FC<CandlestickChartProps> = ({ data, title }) => {
  const chartData = data.map(d => ({
    ...d,
    bodyRange: [Math.min(d.open, d.close), Math.max(d.open, d.close)]
  }));

  const minLow = Math.min(...data.map(d => d.low));
  const maxHigh = Math.max(...data.map(d => d.high));
  const domain = [
    Math.floor(minLow * 0.95),
    Math.ceil(maxHigh * 1.05)
  ];

  return (
    <div className="card" style={{ height: '400px', width: '100%', marginBottom: '24px' }}>
      <h3 className="card-title" style={{ marginBottom: '16px' }}>{title}</h3>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis dataKey="date" stroke="var(--text-muted)" tickFormatter={(val) => val.substring(5)} />
          <YAxis domain={domain} stroke="var(--text-muted)" />
          <Tooltip 
            contentStyle={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--ink)' }}
            formatter={(value: any, name: any) => {
              if (name === 'bodyRange') return null;
              return value;
            }}
            labelStyle={{ color: 'var(--text-muted)' }}
          />
          <Bar 
            dataKey="bodyRange" 
            shape={<CandlestickShape />} 
            isAnimationActive={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};
