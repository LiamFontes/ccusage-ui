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

interface AccumulatedCostChartProps {
  data: DailyEntry[];
  isLoading?: boolean;
}

export function AccumulatedCostChart({
  data,
  isLoading,
}: AccumulatedCostChartProps) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6 h-80">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Accumulated Cost
        </h3>
        <div className="animate-pulse bg-gray-200 rounded h-56" />
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
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        Cost Accumulation
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <ComposedChart
          data={chartData}
          margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
        >
          <CartesianGrid stroke="#f5f5f5" />
          <XAxis dataKey="date" scale="band" />
          <YAxis tickFormatter={(val) => formatCurrency(val)} />
          <Tooltip
            formatter={(value: any) => formatCurrency(value)}
            labelStyle={{ color: '#374151' }}
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
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
