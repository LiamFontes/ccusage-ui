import {
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Area,
} from 'recharts';
import type { Block } from '../../server/ccusage.types';
import { formatCurrency } from '../../lib/formatters';
import { useIsDark } from '../ThemeProvider';

interface QuotaProjectionChartProps {
  activeBlock: Block | undefined;
  limit: number;
  isLoading?: boolean;
}

export function QuotaProjectionChart({
  activeBlock,
  limit,
  isLoading,
}: QuotaProjectionChartProps) {
  const isDark = useIsDark();

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-zinc-900 rounded-lg shadow p-6 h-80">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
          Quota Projection
        </h3>
        <div className="animate-pulse bg-gray-200 dark:bg-zinc-800 rounded h-56" />
      </div>
    );
  }

  if (!activeBlock || !activeBlock.burnRate) {
    return null;
  }

  const startTime = new Date(activeBlock.startTime).getTime();
  const now = Date.now();
  const currentCost = activeBlock.costUSD;
  const costPerHour = activeBlock.burnRate.costPerHour;

  // Calculate projected time to hit limit
  // limit = currentCost + (costPerMs * msRemaining)
  // msRemaining = (limit - currentCost) / costPerMs
  const costPerMs = costPerHour / (60 * 60 * 1000);
  const msRemaining = (limit - currentCost) / costPerMs;
  const projectedEndTime = now + msRemaining;

  const data = [
    {
      time: startTime,
      actualCost: 0,
      projectedCost: 0,
      label: 'Start',
    },
    {
      time: now,
      actualCost: currentCost,
      projectedCost: currentCost,
      label: 'Now',
    },
    {
      time: projectedEndTime,
      // actualCost: null, // Don't plot actual past now
      projectedCost: limit,
      label: 'Limit',
    },
  ];

  const formatTimeKey = (time: number) => {
    return new Date(time).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-lg shadow p-6">
      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
        Quota Projection
      </h3>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={data}
            margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={isDark ? '#374151' : '#e5e7eb'}
            />
            <XAxis
              dataKey="time"
              type="number"
              domain={['dataMin', 'dataMax']}
              tickFormatter={formatTimeKey}
              tick={{ fill: isDark ? '#9ca3af' : '#6b7280' }}
            />
            <YAxis
              tickFormatter={(value) => formatCurrency(value)}
              domain={[0, Math.max(limit * 1.1, currentCost * 1.1)]} // Add some headroom
              tick={{ fill: isDark ? '#9ca3af' : '#6b7280' }}
            />
            <Tooltip
              labelFormatter={(value) => formatTimeKey(value as number)}
              formatter={(value: number | undefined) =>
                formatCurrency(value ?? 0)
              }
              contentStyle={{
                backgroundColor: isDark ? '#1f2937' : '#fff',
                border: isDark ? '1px solid #374151' : '1px solid #e5e7eb',
                color: isDark ? '#f3f4f6' : '#111827',
              }}
            />
            <ReferenceLine
              y={limit}
              label={{
                value: 'Limit',
                fill: isDark ? '#ef4444' : '#dc2626',
                position: 'insideTopRight',
              }}
              stroke={isDark ? '#ef4444' : '#dc2626'}
              strokeDasharray="3 3"
            />
            <Area
              type="monotone"
              dataKey="actualCost"
              stroke="#3b82f6"
              fill="#3b82f6"
              fillOpacity={0.2}
              strokeWidth={2}
              connectNulls
              name="Actual Cost"
            />
            <Line
              type="monotone"
              dataKey="projectedCost"
              stroke="#9ca3af"
              strokeDasharray="5 5"
              strokeWidth={2}
              dot={false}
              name="Projected"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
