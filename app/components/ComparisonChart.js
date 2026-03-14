'use client';

import { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from 'recharts';

function formatChartValue(val) {
  if (val >= 1000000) return `$${(val / 1000000).toFixed(1)}M`;
  if (val >= 1000) return `$${(val / 1000).toFixed(0)}K`;
  return `$${val.toFixed(0)}`;
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="bg-surface-800 border border-white/10 rounded-lg px-4 py-3 shadow-xl">
      <p className="text-xs text-muted mb-2 font-display font-medium">{label}</p>
      {payload.map((entry, i) => (
        <div key={i} className="flex items-center gap-2 text-sm">
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-muted-light">{entry.name}:</span>
          <span className="text-white font-mono font-medium">
            {formatChartValue(entry.value)}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function ComparisonChart({ pageA, pageB, investment = 1000 }) {
  const multiplier = investment / 1000;

  const chartData = useMemo(() => {
    const yearlyA = pageA.yearly_breakdown;
    const yearlyB = pageB.yearly_breakdown;
    const sp500 = pageA.sp500_yearly_breakdown;

    return yearlyA.map((rowA) => {
      const rowB = yearlyB.find((b) => b.year === rowA.year);
      const sp500Row = sp500.find((s) => s.year === rowA.year);
      return {
        year: rowA.year.toString(),
        [pageA.company_name]: rowA.value * multiplier,
        [pageB.company_name]: rowB ? rowB.value * multiplier : null,
        'S&P 500': sp500Row ? sp500Row.value * multiplier : null,
      };
    });
  }, [pageA, pageB, multiplier]);

  return (
    <div className="bg-surface-800 rounded-2xl border border-white/5 p-4 sm:p-6">
      <h3 className="font-display font-semibold text-white mb-1">
        Growth of ${investment.toLocaleString('en-US')}
      </h3>
      <p className="text-xs text-muted mb-6">
        {pageA.company_name} vs. {pageB.company_name} vs. S&P 500, {pageA.start_year} to present
      </p>

      <div className="h-[300px] sm:h-[380px] -ml-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.04)"
              vertical={false}
            />
            <XAxis
              dataKey="year"
              tick={{ fill: '#64748b', fontSize: 12 }}
              tickLine={false}
              axisLine={{ stroke: 'rgba(255,255,255,0.05)' }}
              interval="preserveStartEnd"
            />
            <YAxis
              tick={{ fill: '#64748b', fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={formatChartValue}
              width={65}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
              iconType="circle"
              iconSize={8}
            />
            <Line
              type="monotone"
              dataKey={pageA.company_name}
              stroke="#00dc82"
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 4, strokeWidth: 0, fill: '#00dc82' }}
            />
            <Line
              type="monotone"
              dataKey={pageB.company_name}
              stroke="#60a5fa"
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 4, strokeWidth: 0, fill: '#60a5fa' }}
            />
            <Line
              type="monotone"
              dataKey="S&P 500"
              stroke="#64748b"
              strokeWidth={1.5}
              strokeDasharray="4 4"
              dot={false}
              activeDot={{ r: 3, strokeWidth: 0, fill: '#64748b' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
