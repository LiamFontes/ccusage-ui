import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { DailyEntry } from '../../server/ccusage.types';
import { formatDate, formatCurrency } from '../../lib/formatters';
import { useIsDark } from '../ThemeProvider';

interface AccumulatedCostChartProps {
  data: DailyEntry[];
  isLoading?: boolean;
}

export function AccumulatedCostChart({
  data,
  isLoading,
}: AccumulatedCostChartProps) {
  const isDark = useIsDark();

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-zinc-900 rounded-lg shadow p-6 h-80">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
          Accumulated Cost
        </h3>
        <div className="animate-pulse bg-gray-200 dark:bg-zinc-800 rounded h-56" />
      </div>
    );
  }

  // Calculate accumulated cost
  let runningTotal = 0;
  const chartData = data.map((entry) => {
    runningTotal += entry.totalCost;
    return {
      date: formatDate(entry.date),
      dailyCost: entry.totalCost,
      accumulatedCost: runningTotal,
    };
  });

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-lg shadow p-6">
      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
        Cost Accumulation
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <ComposedChart
          data={chartData}
          margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
        >
          <CartesianGrid stroke={isDark ? '#374151' : '#f5f5f5'} />
          <XAxis
            dataKey="date"
            scale="band"
            tick={{ fill: isDark ? '#9ca3af' : '#6b7280' }}
          />
          <YAxis
            tickFormatter={(val) => formatCurrency(val)}
            tick={{ fill: isDark ? '#9ca3af' : '#6b7280' }}
          />
          <Tooltip
            formatter={(value: any) => formatCurrency(value)}
            labelStyle={{ color: isDark ? '#d1d5db' : '#374151' }}
            contentStyle={{
              backgroundColor: isDark ? '#1f2937' : '#fff',
              border: isDark ? '1px solid #374151' : '1px solid #e5e7eb',
            }}
          />
          <Legend />
          <Bar
            dataKey="dailyCost"
            barSize={20}
            fill="#3b82f6"
            name="Daily Cost"
          />
          <Line
            type="monotone"
            dataKey="accumulatedCost"
            stroke="#ef4444"
            name="Accumulated Cost"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
